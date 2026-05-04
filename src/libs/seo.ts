import {getKeywordIdeas} from "../providers/seo/google/keyword";
import {getGoogleTrendsData} from "../providers/seo/google/trend";

const seo = {
    keyword: getKeywordIdeas,
    trend: getGoogleTrendsData,
    serp: null
}

export default seo;