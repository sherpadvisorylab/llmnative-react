import {FIREBASE_BUCKET_SCRAPE} from "../../constant";
import {currentCountry, currentLang} from "../../libs/locale";
import {fetchJson} from "../../libs/fetch";
import {cache} from "../../libs/cache";
import { Config, onConfigChange, ScrapeConfig } from "../../Config";
import { normalizeKey, proxy } from "../../libs/utils";

const SERPAPI_ENDPOINT = "https://api.serpapi.com/search";

const ENGINE_GOOGLE                 = "google";
const ENGINE_GOOGLE_IMAGES          = "google_images";
const ENGINE_GOOGLE_AUTOCOMPLETE    = "google_autocomplete";
const ENGINE_GOOGLE_TRENDS          = "google_trends";
const ENGINE_GOOGLE_MAPS            = "google_maps";
const ENGINE_GOOGLE_MAPS_PHOTOS     = "google_maps_photos";
const ENGINE_GOOGLE_MAPS_REVIEWS    = "google_maps_reviews";

const SEARCH_QUERY = {
    q: null,
}

const nameCountry   = currentCountry();
const codeCountry   = currentCountry(true);
const codeLang      = currentLang(true);

const SERPAPI_PARAMS = {
    engine: null,
    device: null,
    no_cache: false,
    async: false,
    output: "json",
};
const GEOGRAPHIC_LOCATION = {
    location: nameCountry,
    uule: null,
}
const GEOGRAPHIC_LOCATION2 = {
    geo: nameCountry,
    region: null,
}
const LOCALIZATION = {
    google_domain: "google.com",
    gl: codeCountry.toLowerCase(),
    hl: codeLang,
    cr: "country" + codeCountry,
    lr: "lang_" + codeLang,
}

const ADVANCED = {
    tbs: null,
    safe: "active",
    nfpr: 0,
    filter: 1,
}

const MAPS_DETAILS = {
    data_id: null,
    hl: codeLang,
}

const SEARCH_BY_ENGINE = {
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


let config: ScrapeConfig | undefined = undefined;
if (typeof onConfigChange === 'function') {
    onConfigChange((newConfig: Config) => {
        config = newConfig.scrape;
    });
}

function removeNullProperties(obj: Record<string, any>): Record<string, any> {
    const newObj: Record<string, any> = {};
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
            ...(SEARCH_BY_ENGINE as any)[engine],
            api_key: apiKey,
            q: search,
        });
        console.log(SERPAPI_ENDPOINT, query);
        const params = new URLSearchParams(query);
        const url = `${SERPAPI_ENDPOINT}?${params}`;

        return proxy(url);
    }

    let apiKey = getSerpApikey();
    while (apiKey) {
        try {
            return await fetchJson(getRequest(apiKey));
        } catch (response: any) {
            if (response.error === "quota_exceeded") {
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



const callSerpApi = async (search: string, strategy: string, {caller = null, storePaths = []}: {caller?: any, storePaths?: string[]} = {}) => {
    return await cache(
        search, strategy,
        {
            callLabel: "Serp Api",
            callKey: normalizeKey(search),
            callBasePath: FIREBASE_BUCKET_SCRAPE,
            callService: "serpApi",
            callFunc: fetchSerpApi,
            callOptions: {}
        },
        caller, storePaths
    );
}

const fetchScrape = (caller: any = null, storePaths: string[] = []) => {
    return {
        googleSearch: async (search: string) => {
            return await callSerpApi(search, ENGINE_GOOGLE, {caller, storePaths});
        },
        googleImages: async (search: string) => {
            return await callSerpApi(search, ENGINE_GOOGLE_IMAGES, {caller, storePaths});
        },
        googleAutocomplete: async (search: string) => {
            return await callSerpApi(search, ENGINE_GOOGLE_AUTOCOMPLETE, {caller, storePaths});
        },
        googleTrends: async (search: string) => {
            return await callSerpApi(search, ENGINE_GOOGLE_TRENDS, {caller, storePaths});
        },
        googleMaps: async (search: string) => {
            return await callSerpApi(search, ENGINE_GOOGLE_MAPS, {caller, storePaths});
        },
        googleMapsPhotos: async (search: string) => {
            return await callSerpApi(search, ENGINE_GOOGLE_MAPS_PHOTOS, {caller, storePaths});
        },
        googleMapsReviews: async (search: string) => {
            return await callSerpApi(search, ENGINE_GOOGLE_MAPS_REVIEWS, {caller, storePaths});
        },
    }
}

export default fetchScrape;
