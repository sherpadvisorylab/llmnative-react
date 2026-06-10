import {FIREBASE_BUCKET_SCRAPE} from "../../constant";
import {currentCountry, currentLang} from "../../libs/locale";
import {fetchJson} from "../../libs/fetch";
import { Config, onConfigChange, ScrapeConfig } from "../../Config";
import { normalizeKey } from "../../libs/utils";
import { DataProviderAdapter } from "../../providers/data/DataProvider";

const SERPAPI_ENDPOINT = "https://api.serpapi.com/search";

const ENGINE_GOOGLE                 = "google";
const ENGINE_GOOGLE_IMAGES          = "google_images";
const ENGINE_GOOGLE_AUTOCOMPLETE    = "google_autocomplete";
const ENGINE_GOOGLE_TRENDS          = "google_trends";
const ENGINE_GOOGLE_MAPS            = "google_maps";
const ENGINE_GOOGLE_MAPS_PHOTOS     = "google_maps_photos";
const ENGINE_GOOGLE_MAPS_REVIEWS    = "google_maps_reviews";

const SERPAPI_PARAMS = {
    engine: null,
    device: null,
    no_cache: false,
    async: false,
    output: "json",
};

const SEARCH_QUERY = { q: null };

const ADVANCED = {
    tbs: null,
    safe: "active",
    nfpr: 0,
    filter: 1,
};

// Locale-dependent params are computed lazily at call time so they always
// reflect the user's current country/language preference, not the value at
// module load time (which would be wrong if the user changes locale later).
function buildEngineParams(engine: string): object {
    const nameCountry = currentCountry();
    const codeCountry = currentCountry(true);
    const codeLang    = currentLang(true);

    const GEOGRAPHIC_LOCATION  = { location: nameCountry, uule: null };
    const GEOGRAPHIC_LOCATION2 = { geo: nameCountry, region: null };
    const LOCALIZATION = {
        google_domain: "google.com",
        gl: codeCountry.toLowerCase(),
        hl: codeLang,
        cr: "country" + codeCountry,
        lr: "lang_" + codeLang,
    };
    const MAPS_DETAILS = { data_id: null, hl: codeLang };

    const byEngine: Record<string, object> = {
        [ENGINE_GOOGLE]: {
            ...SERPAPI_PARAMS,
            ...GEOGRAPHIC_LOCATION,
            ...LOCALIZATION,
            ...ADVANCED,
            ...SEARCH_QUERY,
            engine: ENGINE_GOOGLE,
            ludocid: null,
            lsig: null,
            kgmid: null,
            si: null,
            tbm: null,
            start: null,
            num: null,
        },
        [ENGINE_GOOGLE_IMAGES]: {
            ...SERPAPI_PARAMS,
            ...GEOGRAPHIC_LOCATION,
            ...LOCALIZATION,
            ...ADVANCED,
            ...SEARCH_QUERY,
            engine: ENGINE_GOOGLE_IMAGES,
            chips: null,
            ijn: null,
        },
        [ENGINE_GOOGLE_AUTOCOMPLETE]: {
            ...SERPAPI_PARAMS,
            ...LOCALIZATION,
            ...SEARCH_QUERY,
            engine: ENGINE_GOOGLE_AUTOCOMPLETE,
            cp: null,
            client: null,
        },
        [ENGINE_GOOGLE_TRENDS]: {
            ...SERPAPI_PARAMS,
            ...GEOGRAPHIC_LOCATION2,
            ...SEARCH_QUERY,
            engine: ENGINE_GOOGLE_TRENDS,
            data_type: null,
            tz: null,
            cat: null,
            gprop: null,
            date: null,
            csv: null,
        },
        [ENGINE_GOOGLE_MAPS]: {
            ...SERPAPI_PARAMS,
            ...GEOGRAPHIC_LOCATION,
            ...LOCALIZATION,
            ...ADVANCED,
            ...SEARCH_QUERY,
            engine: ENGINE_GOOGLE_MAPS,
        },
        [ENGINE_GOOGLE_MAPS_PHOTOS]: {
            ...SERPAPI_PARAMS,
            ...MAPS_DETAILS,
            engine: ENGINE_GOOGLE_MAPS_PHOTOS,
        },
        [ENGINE_GOOGLE_MAPS_REVIEWS]: {
            ...SERPAPI_PARAMS,
            ...MAPS_DETAILS,
            engine: ENGINE_GOOGLE_MAPS_REVIEWS,
        },
    };

    return byEngine[engine] ?? {};
}


let config: ScrapeConfig | undefined = undefined;
if (typeof onConfigChange === 'function') {
    onConfigChange((newConfig: Config) => {
        config = newConfig.scrape;
    });
}

function removeNullProperties(obj: Record<string, unknown>): Record<string, unknown> {
    const newObj: Record<string, unknown> = {};
    for (const key in obj) {
        if (obj[key] !== null) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}

let API_KEY_INDEX = 0;
function getSerpApikey(next = false) {
    const apis = config?.serpApiKey?.split(",").map(k => k.trim()).filter(Boolean) || [];
    if (apis.length === 0) return null;

    if (next) {
        API_KEY_INDEX++;
    }

    return (API_KEY_INDEX < apis.length
        ? apis[API_KEY_INDEX]
        : null
    );
}

const fetchSerpApi = async (search: string, engine: string) => {
    const getRequest = (apiKey: string) => {
        const query = removeNullProperties({
            ...buildEngineParams(engine),
            api_key: apiKey,
            q: search,
        });
        console.log(SERPAPI_ENDPOINT, query);
        const params = new URLSearchParams(query as Record<string, string>);
        return `${SERPAPI_ENDPOINT}?${params}`;
    }

    let apiKey = getSerpApikey();
    while (apiKey) {
        try {
            return await fetchJson(getRequest(apiKey));
        } catch (response: unknown) {
            if ((response as Record<string, unknown>)?.error === "quota_exceeded") {
                console.warn(`SerpApi: invalid api key: ${apiKey}`, response);
                apiKey = getSerpApikey(true);
                continue;
            }

            console.error(`SerpApi: ${apiKey}`, response);
            throw response;
        }
    }

    return null;
};



const callSerpApi = async (search: string, strategy: string, dataProvider: DataProviderAdapter) => {
    const cachePath = `${FIREBASE_BUCKET_SCRAPE}/${normalizeKey(strategy)}/${normalizeKey(search)}`;
    const cached = await dataProvider.read(cachePath);
    if (cached) return cached;

    const response = await fetchSerpApi(search, strategy);
    if (response) {
        dataProvider.set(cachePath, response);
    } else {
        console.warn(`SerpApi ${strategy}: No Result`);
    }
    return response ?? {};
};

const fetchScrape = (dataProvider: DataProviderAdapter) => {
    return {
        googleSearch:       async (search: string) => callSerpApi(search, ENGINE_GOOGLE, dataProvider),
        googleImages:       async (search: string) => callSerpApi(search, ENGINE_GOOGLE_IMAGES, dataProvider),
        googleAutocomplete: async (search: string) => callSerpApi(search, ENGINE_GOOGLE_AUTOCOMPLETE, dataProvider),
        googleTrends:       async (search: string) => callSerpApi(search, ENGINE_GOOGLE_TRENDS, dataProvider),
        googleMaps:         async (search: string) => callSerpApi(search, ENGINE_GOOGLE_MAPS, dataProvider),
        googleMapsPhotos:   async (search: string) => callSerpApi(search, ENGINE_GOOGLE_MAPS_PHOTOS, dataProvider),
        googleMapsReviews:  async (search: string) => callSerpApi(search, ENGINE_GOOGLE_MAPS_REVIEWS, dataProvider),
    };
};

export default fetchScrape;
