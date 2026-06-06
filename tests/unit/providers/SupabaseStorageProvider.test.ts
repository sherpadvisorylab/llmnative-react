/**
 * SupabaseStorageProvider test suite.
 * Uses fetch mocking to avoid real network calls.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SupabaseStorageProvider } from '../../../src/providers/storage/supabase';

const BASE_URL   = 'https://test.supabase.co';
const ANON_KEY   = 'test-anon-key';
const DEF_BUCKET = 'public';

function provider(bucket?: string) {
    return new SupabaseStorageProvider({ url: BASE_URL, anonKey: ANON_KEY, bucket });
}

// ── Fetch mock helper ─────────────────────────────────────────────────────────

function mockFetch(response: { ok?: boolean; status?: number; body?: any; text?: string }) {
    return vi.spyOn(global, 'fetch').mockResolvedValue({
        ok:   response.ok ?? true,
        status: response.status ?? 200,
        json: async () => response.body ?? {},
        text: async () => response.text ?? '',
        blob: async () => new Blob([JSON.stringify(response.body)], { type: 'application/json' }),
        headers: { get: () => null },
    } as any);
}

beforeEach(() => vi.restoreAllMocks());

// ── getConfigurationState ─────────────────────────────────────────────────────

describe('getConfigurationState()', () => {
    it('reports configured when url + anonKey are set', () => {
        expect(provider().getConfigurationState().configured).toBe(true);
    });

    it('reports not configured when url is missing', () => {
        const p = new SupabaseStorageProvider({ url: '', anonKey: ANON_KEY });
        expect(p.getConfigurationState().configured).toBe(false);
    });

    it('reports not configured when anonKey is missing', () => {
        const p = new SupabaseStorageProvider({ url: BASE_URL, anonKey: '' });
        expect(p.getConfigurationState().configured).toBe(false);
    });
});

// ── getURL ────────────────────────────────────────────────────────────────────

describe('getURL()', () => {
    it('returns the public URL without any network call', async () => {
        const url = await provider().getURL('avatars/photo.jpg');
        expect(url).toBe(`${BASE_URL}/storage/v1/object/public/${DEF_BUCKET}/avatars/photo.jpg`);
    });

    it('uses the configured bucket', async () => {
        const url = await provider('uploads').getURL('doc.pdf');
        expect(url).toBe(`${BASE_URL}/storage/v1/object/public/uploads/doc.pdf`);
    });

    it('uses a per-call bucket override', async () => {
        const url = await provider().getURL('file.txt', { bucket: 'private' });
        expect(url).toBe(`${BASE_URL}/storage/v1/object/public/private/file.txt`);
    });
});

// ── upload ────────────────────────────────────────────────────────────────────

describe('upload()', () => {
    it('POSTs a Blob and returns the public URL', async () => {
        const spy = mockFetch({ ok: true });
        const blob = new Blob(['hello'], { type: 'text/plain' });
        const url = await provider().upload(blob, 'files/hello.txt');

        expect(spy).toHaveBeenCalledWith(
            `${BASE_URL}/storage/v1/object/${DEF_BUCKET}/files/hello.txt`,
            expect.objectContaining({ method: 'POST' })
        );
        expect(url).toBe(`${BASE_URL}/storage/v1/object/public/${DEF_BUCKET}/files/hello.txt`);
    });

    it('converts a data URL (base64) to Blob before uploading', async () => {
        const spy = mockFetch({ ok: true });
        // Simple base64-encoded "A"
        const dataUrl = 'data:text/plain;base64,QQ==';
        const url = await provider().upload(dataUrl, 'text/a.txt');

        expect(spy).toHaveBeenCalled();
        expect(url).toContain('/a.txt');
    });

    it('returns undefined when the server responds with an error', async () => {
        mockFetch({ ok: false, status: 413, text: 'Too large' });
        const blob = new Blob(['x']);
        const url = await provider().upload(blob, 'too-big.bin');
        expect(url).toBeUndefined();
    });
});

// ── createUpload ──────────────────────────────────────────────────────────────

describe('createUpload()', () => {
    it('returns an UploadHandle with url, pause, resume, cancel', () => {
        mockFetch({ ok: true });
        const handle = provider().createUpload(new Blob(['x']), 'file.txt');
        expect(handle.url).toBeInstanceOf(Promise);
        expect(handle.pause).toBeTypeOf('function');
        expect(handle.resume).toBeTypeOf('function');
        expect(handle.cancel).toBeTypeOf('function');
    });

    it('resolves url to the public URL on success', async () => {
        mockFetch({ ok: true });
        const handle = provider().createUpload(new Blob(['x']), 'greet.txt');
        const url = await handle.url;
        expect(url).toContain('greet.txt');
    });

    it('resolves url to undefined when cancelled', async () => {
        // Simulate abort
        vi.spyOn(global, 'fetch').mockRejectedValue(new DOMException('Aborted', 'AbortError'));
        const handle = provider().createUpload(new Blob(['x']), 'aborted.txt');
        handle.cancel();
        const url = await handle.url;
        expect(url).toBeUndefined();
    });
});

// ── delete ────────────────────────────────────────────────────────────────────

describe('delete()', () => {
    it('sends a DELETE request and returns 1 on success', async () => {
        const spy = mockFetch({ ok: true });
        const count = await provider().delete('images/photo.jpg');

        expect(spy).toHaveBeenCalledWith(
            `${BASE_URL}/storage/v1/object/${DEF_BUCKET}`,
            expect.objectContaining({ method: 'DELETE' })
        );
        expect(count).toBe(1);
    });

    it('returns 0 when the server returns 404', async () => {
        mockFetch({ ok: false, status: 404 });
        const count = await provider().delete('missing.jpg');
        expect(count).toBe(0);
    });
});

// ── rename ────────────────────────────────────────────────────────────────────

describe('rename()', () => {
    it('calls the Supabase move API and returns true on success', async () => {
        const spy = mockFetch({ ok: true });
        const ok = await provider().rename('old.jpg', 'new.jpg');

        expect(spy).toHaveBeenCalledWith(
            `${BASE_URL}/storage/v1/object/move`,
            expect.objectContaining({ method: 'POST' })
        );
        expect(ok).toBe(true);
    });

    it('returns false when the move fails', async () => {
        mockFetch({ ok: false, status: 500 });
        const ok = await provider().rename('a.jpg', 'b.jpg');
        expect(ok).toBe(false);
    });
});

// ── download ──────────────────────────────────────────────────────────────────

describe('download()', () => {
    it('returns a Blob on success', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            blob: async () => new Blob(['data'], { type: 'text/plain' }),
        } as any);
        const blob = await provider().download('file.txt');
        expect(blob).toBeInstanceOf(Blob);
    });

    it('returns undefined when fetch fails', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValue({ ok: false, status: 404 } as any);
        const blob = await provider().download('missing.txt');
        expect(blob).toBeUndefined();
    });
});

// ── list ──────────────────────────────────────────────────────────────────────

describe('list()', () => {
    it('returns file entries from the Supabase list API', async () => {
        mockFetch({
            ok: true,
            body: [
                { id: 'abc', name: 'photo.jpg',  metadata: { size: 1024, mimetype: 'image/jpeg' }, updated_at: '2026-01-01' },
                { id: null,  name: 'subfolder',  metadata: null, updated_at: null }, // folder
            ],
        });
        const files = await provider().list('images');
        // By default, only files are returned (includeFolders defaults to false)
        expect(files).toHaveLength(1);
        expect(files[0]).toMatchObject({ name: 'photo.jpg', path: 'images/photo.jpg', size: 1024 });
    });

    it('includes folders when includeFolders: true', async () => {
        mockFetch({
            ok: true,
            body: [
                { id: 'abc', name: 'photo.jpg', metadata: { size: 512 }, updated_at: '' },
                { id: null,  name: 'sub',       metadata: null, updated_at: null },
            ],
        });
        const entries = await provider().list('root', { includeFolders: true });
        expect(entries.some((e) => e.isFolder)).toBe(true);
    });

    it('returns empty array when the API fails', async () => {
        mockFetch({ ok: false, status: 500, text: 'error' });
        const files = await provider().list('broken');
        expect(files).toEqual([]);
    });
});

// ── getFileInfo ───────────────────────────────────────────────────────────────

describe('getFileInfo()', () => {
    it('returns file metadata for a known path', async () => {
        mockFetch({
            ok: true,
            body: [
                { id: 'x1', name: 'doc.pdf', metadata: { size: 2048, mimetype: 'application/pdf' }, updated_at: '2026-01-15' },
            ],
        });
        const info = await provider().getFileInfo('docs/doc.pdf');
        expect(info).toMatchObject({ name: 'doc.pdf' });
    });

    it('returns undefined for a non-existent file', async () => {
        mockFetch({ ok: true, body: [] });
        const info = await provider().getFileInfo('docs/missing.pdf');
        expect(info).toBeUndefined();
    });
});
