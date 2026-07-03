import React, {createContext, useState, ReactNode, useRef, useEffect} from 'react';
import {GlobalProvider} from "./Global";

export type FirebaseConfig = {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
};

export type GoogleOAuth2 = {
    clientId: string;
    scope?: string;
};

export type GoogleServiceAccount = {
    type: string;
    project_id: string;
    private_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
};

export type GoogleConfig = {
    oAuth2: GoogleOAuth2;
    serviceAccount?: GoogleServiceAccount;
    developerToken?: string;
}

export type DropboxConfig = {
    clientId: string;
    rootPath: string;
};

export type AIConfig = {
    geminiApiKey?: string;
    openaiApiKey?: string;
    deepSeekApiKey?: string;
    openRouterApiKey?: string;
    openCodeApiKey?: string;
    anthropicApiKey?: string;
    mistralApiKey?: string;
    glmApiKey?: string;
    openAICompatible?: {
        apiKey?: string;
        baseUrl?: string;
        modelsUrl?: string;
        chatCompletionsUrl?: string;
        defaultModel?: string;
        label?: string;
        fallbackModels?: string[];
    };
};

export type ScrapeConfig = {
    serpApiKey?: string;
};

export type ProxyConfig = {
    enabled?: boolean;
    route?: string;
};

export type SupabaseConfig = {
    url: string;
    anonKey: string;
    /** Default storage bucket name. Falls back to "public" if omitted. */
    bucket?: string;
    /** Primary-key column name in Supabase tables. Default: "id". */
    primaryKey?: string;
};

export type Config = {
    title: string;
    firebase?: FirebaseConfig;
    google?: GoogleConfig;
    dropbox?: DropboxConfig;
    supabase?: SupabaseConfig;
    ai?: AIConfig;
    scrape?: ScrapeConfig;
    proxy?: ProxyConfig;
};

type ConfigChangeHandler = (newConfig: Config, prevConfig: Config | null) => void;

let currentConfig: Config | undefined = undefined;


const ConfigContext = createContext<Config | null>(null);
const ConfigUpdateContext = createContext<(cfg: Config) => void>(() => {});

const configChangeHandlers: Set<ConfigChangeHandler> = new Set();

export const onConfigChange = (fn: ConfigChangeHandler) => {
    configChangeHandlers.add(fn);
    if (currentConfig) fn(currentConfig, null);
};

export const RuntimeProvider = ({
                                   children,
                                   defaultConfig,
                               }: {
    children: ReactNode;
    defaultConfig: Config;
}) => {
    const [config, setConfig] = useState<Config>(initConfig(defaultConfig));
    const prevConfigRef = useRef<Config | null>(null);

    useEffect(() => {
        const prev = prevConfigRef.current;

        if (prev !== config) {
            currentConfig = config;
            for (const handler of configChangeHandlers) {
                handler(config, prev);
            }
        }

        prevConfigRef.current = config;
    }, [config]);

    return (
        <ConfigContext.Provider value={config}>
            <ConfigUpdateContext.Provider value={setConfig}>
                <GlobalProvider>
                    {children}
                </GlobalProvider>
            </ConfigUpdateContext.Provider>
        </ConfigContext.Provider>
    );
};

const initConfig = (defaultConfig: Config): Config => {
    currentConfig = defaultConfig;

    // Fire handlers synchronously so dependent modules (e.g. proxy) are configured
    // before the first render — useEffect fires too late for isProxyEnabled() checks.
    for (const handler of configChangeHandlers) {
        handler(currentConfig, null);
    }

    return currentConfig;
}

export const getConfig = () => currentConfig;
