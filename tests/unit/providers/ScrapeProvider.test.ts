/**
 * scrape/index.ts test suite.
 * Tests fetchScrape() — cache hits, SerpApi calls, key rotation and
 * per-engine URL parameters via mocked fetchJson, Config and locale.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock Config (triggers onConfigChange at module load) ──────────────────────

vi.mock('../../../src/Config', () => ({
    onConfigChange: vi.fn((cb: (c: unknown) => void) => {
        cb({ scrape: { serpApiKey: 'key-a,key-b' } });
    }),
}));

// ── Mock fetchJson ────────────────────────────────────────────────────────────

vi.mock('../../../src/libs/fetch', () => ({
    fetchJson: vi.fn(),
}));

// ── Mock locale ───────────────────────────────────────────────────────────────

vi.mock('../../../src/libs/locale', () => ({
    currentCountry: vi.fn((code?: boolean) => (code ? 'US' : 'United States')),
    currentLang:    vi.fn((code?: boolean) => (code ? 'en' : 'English')),
}));

// ── Mock utils ────────────────────────────────────────────────────────────────

vi.mock('../../../src/libs/utils', () => ({
    normalizeKey: vi.fn((s: string) => s.toLowerCase().replace(/\s+/g, '_')),
}));

// ── Suppress console noise from fetchSerpApi ──────────────────────────────────

vi.spyOn(console, 'log').mockReturnValue(undefined);
vi.spyOn(console, 'warn').mockReturnValue(undefined);
vi.spyOn(console, 'error').mockReturnValue(undefined);

// ── Imports after mocks ───────────────────────────────────────────────────────

import fetchScrape from '../../../src/providers/scrape/index';
import * as fetchLib from '../../../src/libs/fetch';

// ── Mock DataProviderAdapter ──────────────────────────────────────────────────

const makeDataProvider = (cached: unknown = null) => ({
    read:      vi.fn(async () => cached),
    set:       vi.fn(async () => undefined),
    update:    vi.fn(async () => undefined),
    remove:    vi.fn(async () => undefined),
    subscribe: vi.fn(() => () => undefined),
    count:     vi.fn(async () => 0),
});

beforeEach(() => vi.clearAllMocks());

// ── fetchScrape() ─────────────────────────────────────────────────────────────

describe('fetchScrape()', () => {
    it('returns an object with all seven scrape methods', () => {
        const scrape = fetchScrape(makeDataProvider());
        const methods = [
            'googleSearch', 'googleImages', 'googleAutocomplete',
            'googleTrends', 'googleMaps', 'googleMapsPhotos', 'googleMapsReviews',
        ];
        for (const m of methods) expect(scrape[m as keyof typeof scrape]).toBeTypeOf('function');
    });
});

// ── cache hit ─────────────────────────────────────────────────────────────────

describe('cache hit', () => {
    it('returns cached result without calling SerpApi', async () => {
        const cached = { organic_results: [{ title: 'cached' }] };
        const dp = makeDataProvider(cached);
        const result = await fetchScrape(dp).googleSearch('cats');
        expect(result).toBe(cached);
        expect(vi.mocked(fetchLib.fetchJson)).not.toHaveBeenCalled();
    });
});

// ── cache miss ────────────────────────────────────────────────────────────────

describe('cache miss', () => {
    it('calls fetchJson and stores the response in the data provider', async () => {
        const apiResult = { organic_results: [{ title: 'live' }] };
        vi.mocked(fetchLib.fetchJson).mockResolvedValueOnce(apiResult);
        const dp = makeDataProvider(null);

        const result = await fetchScrape(dp).googleSearch('dogs');

        expect(vi.mocked(fetchLib.fetchJson)).toHaveBeenCalledOnce();
        expect(dp.set).toHaveBeenCalledOnce();
        expect(result).toBe(apiResult);
    });

    it('hits the SerpApi endpoint URL', async () => {
        vi.mocked(fetchLib.fetchJson).mockResolvedValueOnce({});
        await fetchScrape(makeDataProvider()).googleSearch('react');

        const url = vi.mocked(fetchLib.fetchJson).mock.calls[0][0] as string;
        expect(url).toContain('serpapi.com');
    });

    it('includes the search term in the URL', async () => {
        vi.mocked(fetchLib.fetchJson).mockResolvedValueOnce({});
        await fetchScrape(makeDataProvider()).googleSearch('hello world');

        const url = vi.mocked(fetchLib.fetchJson).mock.calls[0][0] as string;
        expect(url).toContain('hello');
    });

    it('includes an api_key parameter in the URL', async () => {
        vi.mocked(fetchLib.fetchJson).mockResolvedValueOnce({});
        await fetchScrape(makeDataProvider()).googleSearch('test');

        const url = vi.mocked(fetchLib.fetchJson).mock.calls[0][0] as string;
        expect(url).toContain('api_key=');
    });

    it('returns empty object when SerpApi returns null', async () => {
        vi.mocked(fetchLib.fetchJson).mockResolvedValueOnce(null);
        const result = await fetchScrape(makeDataProvider()).googleSearch('nothing');
        expect(result).toEqual({});
    });

    it('does not call dp.set when SerpApi returns null', async () => {
        vi.mocked(fetchLib.fetchJson).mockResolvedValueOnce(null);
        const dp = makeDataProvider(null);
        await fetchScrape(dp).googleSearch('nothing');
        expect(dp.set).not.toHaveBeenCalled();
    });
});

// ── per-engine URL parameters ─────────────────────────────────────────────────

describe('engine routing', () => {
    it('googleSearch uses engine=google', async () => {
        vi.mocked(fetchLib.fetchJson).mockResolvedValueOnce({});
        await fetchScrape(makeDataProvider()).googleSearch('x');
        const url = vi.mocked(fetchLib.fetchJson).mock.calls[0][0] as string;
        expect(url).toMatch(/engine=google(&|$)/);
    });

    it('googleImages uses engine=google_images', async () => {
        vi.mocked(fetchLib.fetchJson).mockResolvedValueOnce({});
        await fetchScrape(makeDataProvider()).googleImages('cats');
        const url = vi.mocked(fetchLib.fetchJson).mock.calls[0][0] as string;
        expect(url).toContain('engine=google_images');
    });

    it('googleAutocomplete uses engine=google_autocomplete', async () => {
        vi.mocked(fetchLib.fetchJson).mockResolvedValueOnce({});
        await fetchScrape(makeDataProvider()).googleAutocomplete('react');
        const url = vi.mocked(fetchLib.fetchJson).mock.calls[0][0] as string;
        expect(url).toContain('engine=google_autocomplete');
    });

    it('googleTrends uses engine=google_trends', async () => {
        vi.mocked(fetchLib.fetchJson).mockResolvedValueOnce({});
        await fetchScrape(makeDataProvider()).googleTrends('typescript');
        const url = vi.mocked(fetchLib.fetchJson).mock.calls[0][0] as string;
        expect(url).toContain('engine=google_trends');
    });

    it('googleMaps uses engine=google_maps', async () => {
        vi.mocked(fetchLib.fetchJson).mockResolvedValueOnce({});
        await fetchScrape(makeDataProvider()).googleMaps('pizza rome');
        const url = vi.mocked(fetchLib.fetchJson).mock.calls[0][0] as string;
        expect(url).toContain('engine=google_maps');
    });
});

// ── API key rotation ──────────────────────────────────────────────────────────

describe('API key rotation', () => {
    it('retries with the next key on quota_exceeded', async () => {
        vi.mocked(fetchLib.fetchJson)
            .mockRejectedValueOnce({ error: 'quota_exceeded' })
            .mockResolvedValueOnce({ results: [{ title: 'ok' }] });

        const dp = makeDataProvider(null);
        const result = await fetchScrape(dp).googleSearch('retry');

        expect(vi.mocked(fetchLib.fetchJson)).toHaveBeenCalledTimes(2);
        expect(result).toEqual({ results: [{ title: 'ok' }] });
    });

    it('re-throws immediately for non-quota errors', async () => {
        vi.mocked(fetchLib.fetchJson).mockRejectedValueOnce({ error: 'server_error' });
        const dp = makeDataProvider(null);
        await expect(fetchScrape(dp).googleSearch('fail')).rejects.toMatchObject({ error: 'server_error' });
        expect(vi.mocked(fetchLib.fetchJson)).toHaveBeenCalledTimes(1);
    });
});
