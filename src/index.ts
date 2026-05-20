import './globals.css';
export { default as App } from './App';
export { useMenu } from './App';
export type { AppProps, AppProvidersConfig } from './App';
export type {
    ServicesConfig,
    SupabaseProviderConfig,
    GoogleProviderConfig,
    MockProviderConfig,
    DataDriverName,
    StorageDriverName,
    AuthDriverName,
    EmailDriverName,
} from './providers/manifest';
export {
    Head,
    HeadProvider,
    DEFAULT_DOCUMENT_HEAD,
    DEFAULT_HEAD_APP_NAME,
    DEFAULT_LANGUAGE_HEAD,
    useAssetsHead,
    useDocumentHead,
    useHead,
    useHeadLinks,
    useLanguageHead,
    usePaginationHead,
    usePwaHead,
    useSchemaOrgHead,
    useSocialHead,
} from './Head';
export type {
    HeadController,
    AssetsHeadState,
    DocumentBaseHead,
    DocumentHeadState,
    DocumentHttpEquivMeta,
    HeadFontAsset,
    HeadLinkDescriptor,
    HeadLinksState,
    HeadMetaAttributes,
    HeadProviderProps,
    HeadScriptAsset,
    HeadStyleAsset,
    LanguageAlternateLink,
    LanguageHeadState,
    OpenGraphHeadState,
    PageMetadataState,
    PaginationHeadState,
    PwaIconLink,
    PwaHeadState,
    SchemaOrgHeadState,
    SchemaOrgJson,
    SocialHeadState,
    TwitterHeadState,
} from './Head';
export { useTheme, useThemeController, BUILT_IN_THEMES, BUILT_IN_THEME_IDS } from './Theme';
export type {
    AppThemeProviderConfig,
    BuiltInThemeId,
    CardTheme,
    ColorScale,
    GalleryTheme,
    MenuTheme,
    ModalTheme,
    TableTheme,
    Theme,
    ThemeConfig,
    ThemeController,
    ThemeMode,
    ThemeDefinition,
    ThemePresetConfig,
} from './Theme';
export { AuthButton, useAccessToken, getAccessToken } from './auth';
export { useGlobalVars, getGlobalVars, setGlobalVars, removeGlobalVars} from './Global';

// Providers
export type { DataProviderAdapter, RecordProps, RecordArray, DatabaseOptions, DBConfig, ReadOptions, WhereClause, OrderClause, Condition } from './providers/data/DataProvider';
export type { OrderConfig, OrderDirection } from './libs/order';
export { Order } from './libs/order';
export type { TableHeaderProp, TableReorderMeta, TableSelectionState } from './components/ui/Table';
export type { GallerySelectionState } from './components/ui/Gallery';
export type {
    GridActionConfig,
    GridActionButtonProps,
    GridActionRenderContext,
    GridActions,
    GridColumn,
    GridColumnTransform,
    GridFooterContext,
    GridHeaderContext,
    GridProps,
    GridSource,
    GridSortable,
} from './components/widgets/Grid';
export type { ProviderConfigurable, ProviderConfigurationState } from './providers/ProviderConfiguration';
export { getProviderConfigurationState } from './providers/ProviderConfiguration';
export type { MotionEffect, MotionReference, MotionRegistry, MotionStyle, MotionTransition, ReducedMotionMode, ResolvedMotionEffect } from './motion';
export { createMotionTransition, resolveMotionEffect, useEnterMotion, useMotionEffect, useMotionState, usePressMotion } from './motion';
export { FirebaseDataProvider } from './providers/data/firebase';
export { SupabaseDataProvider } from './providers/data/supabase';
export { MockDataProvider } from './providers/data/mock';
export { useDataProvider, DataProvider } from './providers/data/DataProviderContext';
export type { StorageProviderAdapter } from './providers/storage/StorageProvider';
export { FirebaseStorageProvider } from './providers/storage/firebase';
export { SupabaseStorageProvider } from './providers/storage/supabase';
export { useStorageProvider, StorageProvider } from './providers/storage/StorageProviderContext';
export type { AuthProviderAdapter, AuthIntent, AuthSignInOptions, UserProfile } from './providers/auth/AuthProvider';
export { useAuthProvider, AuthProvider } from './providers/auth/AuthProviderContext';
export { GoogleAuthProvider } from './providers/auth/google/GoogleAuthProvider';
export { DropboxAuthProvider } from './providers/auth/dropbox/DropboxAuthProvider';
export type { EmailProviderAdapter, EmailSendParams } from './providers/email/EmailProvider';
export type { IconProviderAdapter, IconComponentProps } from './providers/icon/IconProvider';
export { LucideIconProvider } from './providers/icon/LucideIconProvider';
export { PhosphorIconProvider } from './providers/icon/PhosphorIconProvider';
export type { PhosphorWeight } from './providers/icon/PhosphorIconProvider';
export { IconProvider, useIconProvider, useIconController } from './providers/icon/IconProviderContext';
export type { AppIconProviderConfig, IconController } from './providers/icon/IconProviderContext';
export { useEmailProvider, EmailProvider } from './providers/email/EmailProviderContext';
export { GmailEmailProvider } from './providers/email/google/GmailEmailProvider';
export type { AIFetchConfig } from './providers/ai';
export { getAIProviderConfigurationState } from './providers/ai';
export { googleGetAccessToken } from './providers/auth/google/GoogleAuth';
export { sendEmail } from './providers/email/google/email';
export { getKeywordIdeas } from './providers/seo/google/keyword';
export { getGoogleTrendsData, getGoogleTrendsRelated } from './providers/seo/google/trend';

export { default as db } from './providers/data/firebase';
export { default as storage } from './providers/storage/firebase';
export { dropBox, useDropBoxConnect, DropBoxConnectButton } from './providers/storage/dropbox';
export { AI } from './providers/ai';
export { default as scrape } from './providers/scrape';
export * from './components';
export * from './libs';
export * from './pages';
