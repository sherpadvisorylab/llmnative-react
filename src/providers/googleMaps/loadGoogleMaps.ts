/// <reference types="google.maps" />

export interface GoogleMapsConfig {
    /** Google Cloud API key with the "Places API (New)" enabled. */
    apiKey: string;
    /** BCP-47 language for results, e.g. `'it'`. Defaults to the browser's language. */
    language?: string;
    /** Region bias (ccTLD), e.g. `'it'`. */
    region?: string;
}

declare global {
    interface Window {
        [key: `__googleMapsLoader_${string}`]: (() => void) | undefined;
    }
}

let loaderPromise: Promise<typeof google> | undefined;
let loadedApiKey: string | undefined;

/**
 * Loads the Google Maps JS API (places library) exactly once per page, regardless of how
 * many `<AddressAutocomplete>` instances mount. Safe to call repeatedly with the same config;
 * throws if called again with a *different* apiKey than the one already loading/loaded, since
 * the script tag can't be swapped out once injected.
 */
export function loadGoogleMaps(config: GoogleMapsConfig): Promise<typeof google> {
    if (typeof window === 'undefined') {
        return Promise.reject(new Error('loadGoogleMaps can only run in the browser'));
    }
    if (!config.apiKey) {
        return Promise.reject(new Error('GoogleMapsConfig.apiKey is required'));
    }
    if (loadedApiKey !== undefined && loadedApiKey !== config.apiKey) {
        return Promise.reject(new Error('loadGoogleMaps was already initialized with a different apiKey'));
    }
    if (window.google?.maps?.places) return Promise.resolve(window.google);
    if (loaderPromise) return loaderPromise;

    loadedApiKey = config.apiKey;
    const callbackName = `__googleMapsLoader_${Math.random().toString(36).slice(2)}` as const;

    loaderPromise = new Promise<typeof google>((resolve, reject) => {
        window[callbackName] = () => {
            delete window[callbackName];
            if (window.google?.maps?.places) resolve(window.google);
            else reject(new Error('Google Maps script loaded but the places library is unavailable'));
        };

        const script = document.createElement('script');
        const params = new URLSearchParams({
            key: config.apiKey,
            libraries: 'places',
            loading: 'async',
            callback: callbackName,
            ...(config.language ? { language: config.language } : {}),
            ...(config.region ? { region: config.region } : {}),
        });
        script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
        script.async = true;
        script.onerror = () => reject(new Error('Failed to load the Google Maps script'));
        document.head.appendChild(script);
    });

    return loaderPromise;
}
