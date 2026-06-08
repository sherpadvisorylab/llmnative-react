/**
 * Dropbox storage provider test suite.
 * Tests resolvePath, listFolders, search, getThumbnails and copy via
 * mocked fetchWithRetry and getAccessToken.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock Config (triggers onConfigChange at module load) ──────────────────────

vi.mock('../../../src/Config', () => ({
    onConfigChange: vi.fn((cb: (c: unknown) => void) => {
        cb({ dropbox: { clientId: 'test-client-id', rootPath: '/root' } });
    }),
}));

// ── Mock auth ─────────────────────────────────────────────────────────────────

vi.mock('../../../src/auth', () => ({
    getAccessToken: vi.fn(async () => 'mock-token'),
    useAccessToken: vi.fn(() => true),
    AuthButton: vi.fn(() => null),
}));

// ── Mock fetchWithRetry ───────────────────────────────────────────────────────

vi.mock('../../../src/libs/fetch', () => ({
    fetchWithRetry: vi.fn(),
}));

// ── Mock sleep ────────────────────────────────────────────────────────────────

vi.mock('../../../src/libs/utils', () => ({
    sleep: vi.fn(async () => {}),
}));

// ── Mock pathInfo ─────────────────────────────────────────────────────────────

vi.mock('../../../src/libs/path', () => ({
    default: {
        changeFilename: vi.fn((p: string, opts: { ext: string }) =>
            opts.ext === '' ? p.replace(/\.[^.]+$/, '') : p
        ),
    },
}));

// ── Mock react (DropBoxConnectButton uses JSX) ────────────────────────────────

vi.mock('../../../src/components/ui/Icon', () => ({ default: vi.fn(() => null) }));

// ── Imports after mocks ───────────────────────────────────────────────────────

import { resolvePath, dropBox, listFolders } from '../../../src/providers/storage/dropbox';
import * as fetchLib from '../../../src/libs/fetch';

const mockFetch = () => vi.mocked(fetchLib.fetchWithRetry);

beforeEach(() => vi.clearAllMocks());

// ── resolvePath ───────────────────────────────────────────────────────────────

describe('resolvePath()', () => {
    it('prepends rootPath when path does not already start with it', () => {
        expect(resolvePath('/photos')).toBe('/root/photos');
    });

    it('does not double-prepend when path already starts with rootPath', () => {
        expect(resolvePath('/root/photos')).toBe('/root/photos');
    });

    it('includes the Dropbox host URL when includeHost is true', () => {
        const result = resolvePath('/photos', true);
        expect(result).toContain('dropbox.com');
        expect(result).toContain('/root/photos');
    });
});

// ── listFolders ───────────────────────────────────────────────────────────────

describe('listFolders()', () => {
    it('returns entries from a single-page response', async () => {
        mockFetch().mockResolvedValueOnce({
            entries: [
                { '.tag': 'file', path_display: '/root/a.txt', name: 'a.txt' },
                { '.tag': 'folder', path_display: '/root/sub', name: 'sub' },
            ],
            has_more: false,
            cursor: '',
        });

        const entries = await listFolders({ path: '/docs' });

        expect(mockFetch()).toHaveBeenCalledTimes(1);
        expect(entries).toHaveLength(2);
        expect(entries[0]).toMatchObject({ '.tag': 'file', name: 'a.txt' });
    });

    it('follows pagination when has_more is true', async () => {
        mockFetch()
            .mockResolvedValueOnce({
                entries: [{ '.tag': 'file', path_display: '/root/p1.txt', name: 'p1.txt' }],
                has_more: true,
                cursor: 'cursor-abc',
            })
            .mockResolvedValueOnce({
                entries: [{ '.tag': 'file', path_display: '/root/p2.txt', name: 'p2.txt' }],
                has_more: false,
                cursor: '',
            });

        const entries = await listFolders({ path: '/docs' });

        expect(mockFetch()).toHaveBeenCalledTimes(2);
        expect(entries).toHaveLength(2);
        expect(entries[1]).toMatchObject({ name: 'p2.txt' });
    });

    it('returns empty array when folder is empty', async () => {
        mockFetch().mockResolvedValueOnce({ entries: [], has_more: false, cursor: '' });
        const entries = await listFolders({ path: '/empty' });
        expect(entries).toEqual([]);
    });
});

// ── dropBox.search ────────────────────────────────────────────────────────────

describe('dropBox.search()', () => {
    it('returns a path→name map excluding folder entries', async () => {
        mockFetch().mockResolvedValueOnce({
            entries: [
                { '.tag': 'file', path_display: '/root/job/doc.pdf', name: 'doc.pdf' },
                { '.tag': 'folder', path_display: '/root/job/sub', name: 'sub' },
            ],
            has_more: false,
            cursor: '',
        });

        const result = await dropBox.search('/job');

        expect(result).toEqual({ '/root/job/doc.pdf': 'doc.pdf' });
    });

    it('strips extensions when removeExtension is true', async () => {
        mockFetch().mockResolvedValueOnce({
            entries: [{ '.tag': 'file', path_display: '/root/job/report.xlsx', name: 'report.xlsx' }],
            has_more: false,
            cursor: '',
        });

        const result = await dropBox.search('/job', '', true);

        const keys = Object.keys(result);
        expect(keys[0]).not.toContain('.xlsx');
    });
});

// ── dropBox.getThumbnails ─────────────────────────────────────────────────────

describe('dropBox.getThumbnails()', () => {
    it('builds a thumbnail map with base64 data for successful entries', async () => {
        mockFetch().mockResolvedValueOnce({
            entries: [
                { '.tag': 'success', thumbnail: 'base64imagedata', metadata: {} },
            ],
        });

        const req = [{ path: '/photos/a.jpg' }];
        const result = await dropBox.getThumbnails({ thumbnailsRequest: req });

        expect(result['/photos/a.jpg']).toBeDefined();
        expect(result['/photos/a.jpg'].thumbnail).toBe('base64imagedata');
    });

    it('uses placeholder thumbnail for failed entries', async () => {
        mockFetch().mockResolvedValueOnce({
            entries: [
                { '.tag': 'failure', error: 'not_found' },
            ],
        });

        const req = [{ path: '/photos/missing.jpg' }];
        const result = await dropBox.getThumbnails({ thumbnailsRequest: req });

        expect(result['/photos/missing.jpg'].thumbnail).toMatch(/^data:image\//);
    });

    it('calls setThumbnails callback with results', async () => {
        mockFetch().mockResolvedValueOnce({
            entries: [{ '.tag': 'success', thumbnail: 'abc' }],
        });

        const setThumbnails = vi.fn();
        await dropBox.getThumbnails(
            { thumbnailsRequest: [{ path: '/photos/a.jpg' }] },
            setThumbnails,
        );

        expect(setThumbnails).toHaveBeenCalledOnce();
    });

    it('returns empty object when request list is empty', async () => {
        const result = await dropBox.getThumbnails({ thumbnailsRequest: [] });
        expect(result).toEqual({});
        expect(mockFetch()).not.toHaveBeenCalled();
    });
});

// ── dropBox.copy ──────────────────────────────────────────────────────────────

describe('dropBox.copy()', () => {
    it('returns results for a synchronous complete response', async () => {
        mockFetch().mockResolvedValueOnce({
            '.tag': 'complete',
            entries: [
                { '.tag': 'success', metadata: {} },
            ],
        });

        const results = await dropBox.copy([
            { from: '/src/file.txt', to: '/dst/file.txt' },
        ]);

        expect(mockFetch()).toHaveBeenCalledOnce();
        expect(Array.isArray(results)).toBe(true);
    });

    it('polls until job completes for async_job_id response', async () => {
        mockFetch()
            .mockResolvedValueOnce({ '.tag': 'async_job_id', async_job_id: 'job-123' })
            .mockResolvedValueOnce({ '.tag': 'in_progress' })
            .mockResolvedValueOnce({ '.tag': 'complete', entries: [] });

        await dropBox.copy([{ from: '/a.txt', to: '/b.txt' }]);

        expect(mockFetch()).toHaveBeenCalledTimes(3);
    });

    it('throws when copy job fails', async () => {
        mockFetch().mockResolvedValueOnce({ '.tag': 'failed', error: 'path not found' });

        await expect(
            dropBox.copy([{ from: '/missing.txt', to: '/dst.txt' }])
        ).rejects.toThrow();
    });

    it('returns empty array when paths list is empty', async () => {
        const results = await dropBox.copy([]);
        expect(results).toEqual([]);
        expect(mockFetch()).not.toHaveBeenCalled();
    });
});
