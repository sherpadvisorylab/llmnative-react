
export const COUNTRIES = {
    "US": "United States",
    "CN": "中国",
    "IT": "Italia",
    "FR": "France",
    "DE": "Deutschland",
    "ES": "España",
    "PT": "Portugal",
    "RU": "Россия",
    "JP": "日本"
};

export const LANGS = {
    "it": "Italiano",
    "en": "English",
    "fr": "Français",
    "de": "Deutsch",
    "es": "Español",
    "pt": "Português",
    "ru": "Русский",
    "ja": "日本語",
    "ko": "한국어"
};


export const currentCountry = (code: boolean = false) => {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem("user.country") : null;
    const fromNav = typeof navigator !== 'undefined' ? navigator.language.split("-")[1] : null;
    const country = stored || fromNav || "US";
    return code ? country : COUNTRIES[country as keyof typeof COUNTRIES];
}
export const currentLang = (code: boolean = false) => {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem("user.lang") : null;
    const fromNav = typeof navigator !== 'undefined' ? navigator.language.split("-")[0] : null;
    const lang = stored || fromNav || "en";
    return code ? lang : LANGS[lang as keyof typeof LANGS];
}
