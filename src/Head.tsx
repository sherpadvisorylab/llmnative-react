import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

export type HeadMetaAttributes = Record<string, string | undefined>;

export interface PageMetadataState {
    title?: string;
    description?: string;
    meta?: HeadMetaAttributes;
}

export interface SocialHeadState {
    openGraph?: OpenGraphHeadState;
    twitter?: TwitterHeadState;
}

export interface HeadLinkDescriptor {
    rel: string;
    href?: string;
    as?: string;
    type?: string;
    sizes?: string;
    media?: string;
    hrefLang?: string;
    title?: string;
    crossOrigin?: string;
    [attribute: string]: string | boolean | undefined;
}

export interface HeadLinksState {
    canonical?: string;
    links?: HeadLinkDescriptor[];
}

export interface DocumentHeadState {
    charset?: string;
    viewport?: string;
    base?: DocumentBaseHead;
    httpEquiv?: DocumentHttpEquivMeta;
    robots?: string;
    googlebot?: string;
    canonical?: string;
    ampHtml?: string;
    sitemap?: string;
    keywords?: string | string[];
    author?: string;
    publisher?: string;
    referrer?: string;
    meta?: DocumentMetaAttributes;
    links?: HeadLinkDescriptor[];
}

export interface DocumentBaseHead {
    href?: string;
    target?: '_self' | '_blank' | '_parent' | '_top' | string;
}

export type DocumentHttpEquivMeta = HeadMetaAttributes;
export type DocumentMetaAttributes = HeadMetaAttributes;

export interface LanguageAlternateLink {
    href: string;
    hrefLang: string;
    media?: string;
    type?: string;
    title?: string;
}

export interface LanguageHeadState {
    lang?: string;
    dir?: 'ltr' | 'rtl' | 'auto';
    alternates?: LanguageAlternateLink[];
}

export interface PaginationHeadState {
    prev?: string;
    next?: string;
}

export interface OpenGraphHeadState extends HeadMetaAttributes {
    title?: string;
    type?: string;
    image?: string;
    url?: string;
    description?: string;
    siteName?: string;
    locale?: string;
}

export interface TwitterHeadState extends HeadMetaAttributes {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player' | string;
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    image?: string;
}

export interface HeadScriptAsset {
    src?: string;
    inline?: string;
    type?: string;
    async?: boolean;
    defer?: boolean;
    nonce?: string;
    integrity?: string;
    crossOrigin?: string;
    referrerPolicy?: string;
    id?: string;
}

export interface HeadStyleAsset {
    href?: string;
    inline?: string;
    media?: string;
    title?: string;
    type?: string;
    disabled?: boolean;
    integrity?: string;
    crossOrigin?: string;
    id?: string;
    nonce?: string;
}

export interface HeadFontAsset {
    href: string;
    preload?: boolean;
    preconnect?: string[];
    dnsPrefetch?: string[];
    crossOrigin?: string;
    as?: string;
    type?: string;
    media?: string;
}

export interface AssetsHeadState {
    scripts?: HeadScriptAsset[];
    styles?: HeadStyleAsset[];
    fonts?: HeadFontAsset[];
}

export interface PwaHeadState {
    manifest?: string;
    themeColor?: string;
    backgroundColor?: string;
    colorScheme?: 'normal' | 'light' | 'dark' | 'light dark' | 'dark light' | string;
    applicationName?: string;
    mobileWebAppCapable?: boolean;
    appleMobileWebAppCapable?: boolean;
    appleMobileWebAppTitle?: string;
    appleMobileWebAppStatusBarStyle?: 'default' | 'black' | 'black-translucent';
    favicon?: string;
    appleTouchIcon?: string;
    icons?: PwaIconLink[];
}

export interface PwaIconLink extends HeadLinkDescriptor {
    rel: 'icon' | 'apple-touch-icon' | 'mask-icon' | string;
    href: string;
}

export type SchemaOrgJson = Record<string, unknown>;

export interface SchemaOrgHeadState {
    jsonLd?: SchemaOrgJson | SchemaOrgJson[];
}

export interface HeadProviderProps {
    children: React.ReactNode;
    appName?: string;
}

export interface HeadController {
    metadata: PageMetadataState;
    social: SocialHeadState;
    links: HeadLinksState;
    pagination: PaginationHeadState;
    language: LanguageHeadState;
    document: DocumentHeadState;
    assets: AssetsHeadState;
    pwa: PwaHeadState;
    schemaOrg: SchemaOrgHeadState;
    setPageMetadata: (metadata: PageMetadataState) => void;
    clearPageMetadata: () => void;
    setPageMetadataEntry: (id: string, metadata: PageMetadataState) => void;
    clearPageMetadataEntry: (id: string) => void;
    setSocialHead: (social: SocialHeadState) => void;
    clearSocialHead: () => void;
    setHeadLinks: (links: HeadLinksState) => void;
    clearHeadLinks: () => void;
    setPaginationHead: (pagination: PaginationHeadState) => void;
    clearPaginationHead: () => void;
    setLanguageHead: (language: LanguageHeadState) => void;
    clearLanguageHead: () => void;
    setDocumentHead: (document: DocumentHeadState) => void;
    clearDocumentHead: () => void;
    setAssetsHead: (assets: AssetsHeadState) => void;
    clearAssetsHead: () => void;
    setPwaHead: (pwa: PwaHeadState) => void;
    clearPwaHead: () => void;
    setSchemaOrg: (schemaOrg: SchemaOrgHeadState) => void;
    clearSchemaOrg: () => void;
}

const HeadContext = createContext<HeadController | null>(null);
let metadataEntryId = 0;

export const DEFAULT_HEAD_APP_NAME = 'Ash';
export const DEFAULT_DOCUMENT_HEAD: DocumentHeadState = {
    charset: 'UTF-8',
    viewport: 'width=device-width, initial-scale=1.0',
};
export const DEFAULT_LANGUAGE_HEAD: LanguageHeadState = {
    lang: 'en',
};

type MetadataEntry = {
    id: string;
    metadata: PageMetadataState;
};

function normalizeSocialKey(prefix: string, key: string): string {
    return key.includes(':') ? key : `${prefix}:${key}`;
}

function normalizeKeywords(keywords: DocumentHeadState['keywords']): string | undefined {
    return Array.isArray(keywords) ? keywords.join(', ') : keywords;
}

function normalizeOpenGraphKey(key: string): string {
    return key === 'siteName' ? 'og:site_name' : normalizeSocialKey('og', key);
}

function createDocumentLinks(document: DocumentHeadState): HeadLinkDescriptor[] {
    return [
        ...(document.canonical ? [{ rel: 'canonical', href: document.canonical }] : []),
        ...(document.ampHtml ? [{ rel: 'amphtml', href: document.ampHtml }] : []),
        ...(document.sitemap ? [{ rel: 'sitemap', href: document.sitemap, type: 'application/xml' }] : []),
        ...(document.links ?? []),
    ];
}

function createPaginationLinks(pagination: PaginationHeadState): HeadLinkDescriptor[] {
    return [
        ...(pagination.prev ? [{ rel: 'prev', href: pagination.prev }] : []),
        ...(pagination.next ? [{ rel: 'next', href: pagination.next }] : []),
    ];
}

function createLanguageLinks(language: LanguageHeadState): HeadLinkDescriptor[] {
    return (language.alternates ?? []).map((alternate) => ({
        rel: 'alternate',
        href: alternate.href,
        hrefLang: alternate.hrefLang,
        media: alternate.media,
        type: alternate.type,
        title: alternate.title,
    }));
}

function createMetaGroups(metadata: PageMetadataState, social: SocialHeadState, document: DocumentHeadState): {
    name: HeadMetaAttributes;
    property: HeadMetaAttributes;
} {
    return {
        name: {
            description: metadata.description,
            ...(metadata.meta ?? {}),
            robots: document.robots ?? metadata.meta?.robots,
            googlebot: document.googlebot,
            keywords: normalizeKeywords(document.keywords),
            author: document.author,
            publisher: document.publisher,
            referrer: document.referrer,
            ...(document.meta ?? {}),
            ...Object.fromEntries(
                Object.entries(social.twitter ?? {}).map(([key, value]) => [
                    normalizeSocialKey('twitter', key),
                    value,
                ])
            ),
        },
        property: Object.fromEntries(
            Object.entries(social.openGraph ?? {}).map(([key, value]) => [
                normalizeOpenGraphKey(key),
                value,
            ])
        ),
    };
}

function createHeadLinks(
    links: HeadLinksState,
    document: DocumentHeadState,
    language: LanguageHeadState,
    pagination: PaginationHeadState
): HeadLinkDescriptor[] {
    return [
        ...createDocumentLinks(document),
        ...createPaginationLinks(pagination),
        ...createLanguageLinks(language),
        ...(links.canonical && !document.canonical ? [{ rel: 'canonical', href: links.canonical }] : []),
        ...(links.links ?? []),
    ];
}

function createAssetLinks(assets: AssetsHeadState): HeadLinkDescriptor[] {
    return [
        ...(assets.fonts ?? []).flatMap((font) => [
            ...(font.dnsPrefetch ?? []).map((href) => ({ rel: 'dns-prefetch', href })),
            ...(font.preconnect ?? []).map((href) => ({ rel: 'preconnect', href, crossOrigin: font.crossOrigin })),
            ...(font.preload ? [{
                rel: 'preload',
                href: font.href,
                as: font.as ?? 'font',
                type: font.type,
                media: font.media,
                crossOrigin: font.crossOrigin,
            }] : []),
            {
                rel: 'stylesheet',
                href: font.href,
                media: font.media,
                crossOrigin: font.crossOrigin,
            },
        ]),
    ];
}

function createPwaLinks(pwa: PwaHeadState): HeadLinkDescriptor[] {
    return [
        ...(pwa.manifest ? [{ rel: 'manifest', href: pwa.manifest }] : []),
        ...(pwa.favicon ? [{ rel: 'icon', href: pwa.favicon }] : []),
        ...(pwa.appleTouchIcon ? [{ rel: 'apple-touch-icon', href: pwa.appleTouchIcon }] : []),
        ...(pwa.icons ?? []),
    ];
}

function createPwaMeta(pwa: PwaHeadState): HeadMetaAttributes {
    return {
        'theme-color': pwa.themeColor,
        'msapplication-TileColor': pwa.backgroundColor,
        'color-scheme': pwa.colorScheme,
        'application-name': pwa.applicationName,
        'mobile-web-app-capable': pwa.mobileWebAppCapable === undefined ? undefined : String(pwa.mobileWebAppCapable),
        'apple-mobile-web-app-capable': pwa.appleMobileWebAppCapable === undefined ? undefined : String(pwa.appleMobileWebAppCapable),
        'apple-mobile-web-app-title': pwa.appleMobileWebAppTitle,
        'apple-mobile-web-app-status-bar-style': pwa.appleMobileWebAppStatusBarStyle,
    };
}

function createSchemaOrgBlocks(schemaOrg: SchemaOrgHeadState): SchemaOrgJson[] {
    return Array.isArray(schemaOrg.jsonLd)
        ? schemaOrg.jsonLd
        : schemaOrg.jsonLd
            ? [schemaOrg.jsonLd]
            : [];
}

function toReactLinkProps(link: HeadLinkDescriptor): React.LinkHTMLAttributes<HTMLLinkElement> {
    return Object.fromEntries(
        Object.entries(link).filter(([, value]) => Boolean(value))
    ) as React.LinkHTMLAttributes<HTMLLinkElement>;
}

function toReactScriptProps(script: HeadScriptAsset): React.ScriptHTMLAttributes<HTMLScriptElement> {
    const { inline: _inline, ...props } = script;
    return Object.fromEntries(
        Object.entries(props).filter(([, value]) => value !== undefined && value !== false)
    ) as React.ScriptHTMLAttributes<HTMLScriptElement>;
}

function toReactStyleLinkProps(style: HeadStyleAsset): React.LinkHTMLAttributes<HTMLLinkElement> {
    const { inline: _inline, ...props } = style;
    return Object.fromEntries(
        Object.entries(props).filter(([, value]) => value !== undefined && value !== false)
    ) as React.LinkHTMLAttributes<HTMLLinkElement>;
}

function HeadPortal({
    appName,
    metadata,
    social,
    links,
    pagination,
    language,
    document,
    assets,
    pwa,
    schemaOrg,
}: {
    appName: string;
    metadata: PageMetadataState;
    social: SocialHeadState;
    links: HeadLinksState;
    pagination: PaginationHeadState;
    language: LanguageHeadState;
    document: DocumentHeadState;
    assets: AssetsHeadState;
    pwa: PwaHeadState;
    schemaOrg: SchemaOrgHeadState;
}) {
    if (typeof globalThis.document === 'undefined') return null;

    const meta = createMetaGroups(metadata, social, document);
    const pwaMeta = createPwaMeta(pwa);
    const linkTags = [
        ...createHeadLinks(links, document, language, pagination),
        ...createAssetLinks(assets),
        ...createPwaLinks(pwa),
    ];
    const schemaOrgBlocks = createSchemaOrgBlocks(schemaOrg);

    return createPortal(
        <>
            {document.charset ? <meta charSet={document.charset} data-rfs-head="document" /> : null}
            {document.base?.href || document.base?.target ? (
                <base
                    href={document.base.href}
                    target={document.base.target}
                    data-rfs-head="document"
                />
            ) : null}
            <title data-rfs-head="title">{metadata.title ?? appName}</title>
            {document.viewport ? <meta name="viewport" content={document.viewport} data-rfs-head="document" /> : null}
            {Object.entries(document.httpEquiv ?? {}).map(([httpEquiv, content]) => (
                content ? <meta key={`http-equiv:${httpEquiv}`} httpEquiv={httpEquiv} content={content} data-rfs-head="document" /> : null
            ))}
            {Object.entries(meta.name).map(([name, content]) => (
                content ? <meta key={`name:${name}`} name={name} content={content} data-rfs-head="meta" /> : null
            ))}
            {Object.entries(meta.property).map(([property, content]) => (
                content ? <meta key={`property:${property}`} property={property} content={content} data-rfs-head="meta" /> : null
            ))}
            {Object.entries(pwaMeta).map(([name, content]) => (
                content ? <meta key={`pwa:${name}`} name={name} content={content} data-rfs-head="pwa" /> : null
            ))}
            {linkTags.map((link, index) => (
                <link
                    key={`${link.rel}:${link.href ?? index}`}
                    {...toReactLinkProps(link)}
                    data-rfs-head="link"
                />
            ))}
            {(assets.styles ?? []).map((style, index) => (
                <React.Fragment key={`style:${style.href ?? index}`}>
                    {style.href ? (
                        <link
                            rel="stylesheet"
                            href={style.href}
                            {...toReactStyleLinkProps(style)}
                            data-rfs-head="asset-style"
                        />
                    ) : null}
                    {style.inline ? (
                        <style
                            id={style.id}
                            nonce={style.nonce}
                            media={style.media}
                            title={style.title}
                            data-rfs-head="asset-style"
                        >
                            {style.inline}
                        </style>
                    ) : null}
                </React.Fragment>
            ))}
            {(assets.scripts ?? []).map((script, index) => (
                <React.Fragment key={`script:${script.src ?? index}`}>
                    {script.src ? (
                        <script
                            {...toReactScriptProps(script)}
                            data-rfs-head="asset-script"
                        />
                    ) : null}
                    {script.inline ? (
                        <script
                            type={script.type}
                            id={script.id}
                            nonce={script.nonce}
                            data-rfs-head="asset-script"
                        >
                            {script.inline}
                        </script>
                    ) : null}
                </React.Fragment>
            ))}
            {schemaOrgBlocks.map((block, index) => (
                <script
                    key={`schema-org:${index}`}
                    type="application/ld+json"
                    data-rfs-head="schema-org"
                >
                    {JSON.stringify(block)}
                </script>
            ))}
        </>,
        globalThis.document.head
    );
}

export function HeadProvider({ appName = DEFAULT_HEAD_APP_NAME, children }: HeadProviderProps) {
    const resolvedAppName = appName || DEFAULT_HEAD_APP_NAME;
    const defaultLangRef = React.useRef(typeof globalThis.document === 'undefined' ? '' : globalThis.document.documentElement.lang);
    const defaultDirRef = React.useRef(typeof globalThis.document === 'undefined' ? '' : globalThis.document.documentElement.dir);
    const [metadata, setPageMetadata] = useState<PageMetadataState>({});
    const [metadataEntries, setMetadataEntries] = useState<MetadataEntry[]>([]);
    const [social, setSocialHead] = useState<SocialHeadState>({});
    const [links, setHeadLinks] = useState<HeadLinksState>({});
    const [pagination, setPaginationHead] = useState<PaginationHeadState>({});
    const [language, setLanguageHead] = useState<LanguageHeadState>(DEFAULT_LANGUAGE_HEAD);
    const [document, setDocumentHead] = useState<DocumentHeadState>(DEFAULT_DOCUMENT_HEAD);
    const [assets, setAssetsHead] = useState<AssetsHeadState>({});
    const [pwa, setPwaHead] = useState<PwaHeadState>({});
    const [schemaOrg, setSchemaOrg] = useState<SchemaOrgHeadState>({});
    const clearPageMetadata = useCallback(() => setPageMetadata({}), []);
    const setPageMetadataEntry = useCallback((id: string, nextMetadata: PageMetadataState) => {
        setMetadataEntries((current) => {
            const nextEntries = current.filter((entry) => entry.id !== id);
            return [...nextEntries, { id, metadata: nextMetadata }];
        });
    }, []);
    const clearPageMetadataEntry = useCallback((id: string) => {
        setMetadataEntries((current) => current.filter((entry) => entry.id !== id));
    }, []);
    const clearSocialHead = useCallback(() => setSocialHead({}), []);
    const clearHeadLinks = useCallback(() => setHeadLinks({}), []);
    const clearPaginationHead = useCallback(() => setPaginationHead({}), []);
    const clearLanguageHead = useCallback(() => setLanguageHead(DEFAULT_LANGUAGE_HEAD), []);
    const clearDocumentHead = useCallback(() => setDocumentHead(DEFAULT_DOCUMENT_HEAD), []);
    const clearAssetsHead = useCallback(() => setAssetsHead({}), []);
    const clearPwaHead = useCallback(() => setPwaHead({}), []);
    const clearSchemaOrg = useCallback(() => setSchemaOrg({}), []);

    useEffect(() => {
        if (typeof globalThis.document === 'undefined') return;

        globalThis.document.documentElement.lang = language.lang ?? defaultLangRef.current;
        globalThis.document.documentElement.dir = language.dir ?? defaultDirRef.current;
    }, [language.lang, language.dir]);

    const activeMetadata = metadataEntries.length > 0 ? metadataEntries[metadataEntries.length - 1].metadata : metadata;

    // Set document.title imperatively so the browser tab updates even when index.html
    // already has a <title> element (createPortal appends a second one which browsers ignore).
    useEffect(() => {
        if (typeof globalThis.document === 'undefined') return;
        globalThis.document.title = activeMetadata.title ?? resolvedAppName;
    }, [activeMetadata.title, resolvedAppName]);

    const controller = useMemo<HeadController>(() => ({
        metadata: activeMetadata,
        social,
        links,
        pagination,
        language,
        document,
        assets,
        pwa,
        schemaOrg,
        setPageMetadata,
        clearPageMetadata,
        setPageMetadataEntry,
        clearPageMetadataEntry,
        setSocialHead,
        clearSocialHead,
        setHeadLinks,
        clearHeadLinks,
        setPaginationHead,
        clearPaginationHead,
        setLanguageHead,
        clearLanguageHead,
        setDocumentHead,
        clearDocumentHead,
        setAssetsHead,
        clearAssetsHead,
        setPwaHead,
        clearPwaHead,
        setSchemaOrg,
        clearSchemaOrg,
    }), [
        activeMetadata,
        social,
        links,
        pagination,
        language,
        document,
        assets,
        pwa,
        schemaOrg,
        clearPageMetadata,
        setPageMetadataEntry,
        clearPageMetadataEntry,
        clearSocialHead,
        clearHeadLinks,
        clearPaginationHead,
        clearLanguageHead,
        clearDocumentHead,
        clearAssetsHead,
        clearPwaHead,
        clearSchemaOrg,
    ]);

    return (
        <HeadContext.Provider value={controller}>
            {children}
            <HeadPortal
                appName={resolvedAppName}
                metadata={activeMetadata}
                social={social}
                links={links}
                pagination={pagination}
                language={language}
                document={document}
                assets={assets}
                pwa={pwa}
                schemaOrg={schemaOrg}
            />
        </HeadContext.Provider>
    );
}

function useHeadController(): HeadController | null {
    return useContext(HeadContext);
}

function stableKey(value: unknown): string {
    return JSON.stringify(value ?? {});
}

export function useHead(metadata?: PageMetadataState): HeadController | null {
    const controller = useHeadController();
    const idRef = React.useRef<string | null>(null);
    if (!idRef.current) {
        metadataEntryId += 1;
        idRef.current = `metadata-${metadataEntryId}`;
    }
    const metadataKey = stableKey(metadata);

    useEffect(() => {
        if (!controller || !metadata) return;
        const id = idRef.current!;
        controller.setPageMetadataEntry(id, metadata);
        return () => controller.clearPageMetadataEntry(id);
    }, [controller?.setPageMetadataEntry, controller?.clearPageMetadataEntry, metadataKey]);

    return controller;
}

export function useSocialHead(social?: SocialHeadState): HeadController | null {
    const controller = useHeadController();
    const socialKey = stableKey(social);

    useEffect(() => {
        if (!controller || !social) return;
        const previousSocial = controller.social;
        controller.setSocialHead(social);
        return () => controller.setSocialHead(previousSocial);
    }, [controller?.setSocialHead, socialKey]);

    return controller;
}

export function useHeadLinks(links?: HeadLinksState): HeadController | null {
    const controller = useHeadController();
    const linksKey = stableKey(links);

    useEffect(() => {
        if (!controller || !links) return;
        const previousLinks = controller.links;
        controller.setHeadLinks(links);
        return () => controller.setHeadLinks(previousLinks);
    }, [controller?.setHeadLinks, linksKey]);

    return controller;
}

export function usePaginationHead(pagination?: PaginationHeadState): HeadController | null {
    const controller = useHeadController();
    const paginationKey = stableKey(pagination);

    useEffect(() => {
        if (!controller || !pagination) return;
        const previousPagination = controller.pagination;
        controller.setPaginationHead(pagination);
        return () => controller.setPaginationHead(previousPagination);
    }, [controller?.setPaginationHead, paginationKey]);

    return controller;
}

export function useLanguageHead(language?: LanguageHeadState): HeadController | null {
    const controller = useHeadController();
    const languageKey = stableKey(language);

    useEffect(() => {
        if (!controller || !language) return;
        const previousLanguage = controller.language;
        controller.setLanguageHead(language);
        return () => controller.setLanguageHead(previousLanguage);
    }, [controller?.setLanguageHead, languageKey]);

    return controller;
}

export function useDocumentHead(document?: DocumentHeadState): HeadController | null {
    const controller = useHeadController();
    const documentKey = stableKey(document);

    useEffect(() => {
        if (!controller || !document) return;
        const previousDocumentHead = controller.document;
        controller.setDocumentHead(document);
        return () => controller.setDocumentHead(previousDocumentHead);
    }, [controller?.setDocumentHead, documentKey]);

    return controller;
}

export function useAssetsHead(assets?: AssetsHeadState): HeadController | null {
    const controller = useHeadController();
    const assetsKey = stableKey(assets);

    useEffect(() => {
        if (!controller || !assets) return;
        const previousAssets = controller.assets;
        controller.setAssetsHead(assets);
        return () => controller.setAssetsHead(previousAssets);
    }, [controller?.setAssetsHead, assetsKey]);

    return controller;
}

export function usePwaHead(pwa?: PwaHeadState): HeadController | null {
    const controller = useHeadController();
    const pwaKey = stableKey(pwa);

    useEffect(() => {
        if (!controller || !pwa) return;
        const previousPwa = controller.pwa;
        controller.setPwaHead(pwa);
        return () => controller.setPwaHead(previousPwa);
    }, [controller?.setPwaHead, pwaKey]);

    return controller;
}

export function useSchemaOrgHead(schemaOrg?: SchemaOrgHeadState): HeadController | null {
    const controller = useHeadController();
    const schemaOrgKey = stableKey(schemaOrg);

    useEffect(() => {
        if (!controller || !schemaOrg) return;
        const previousSchemaOrg = controller.schemaOrg;
        controller.setSchemaOrg(schemaOrg);
        return () => controller.setSchemaOrg(previousSchemaOrg);
    }, [controller?.setSchemaOrg, schemaOrgKey]);

    return controller;
}

export function Head(metadata: PageMetadataState) {
    useHead(metadata);
    return null;
}
