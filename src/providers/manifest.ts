import { FirebaseDataProvider } from './data/firebase';
import { FirestoreDataProvider } from './data/firestore';
import { FirebaseStorageProvider } from './storage/firebase';
import { GoogleAuthProvider } from './auth/google/GoogleAuthProvider';
import { FirebaseAuthProvider } from './auth/firebase/FirebaseAuthProvider';
import { GoogleServiceAccountProvider } from './credentials/google/GoogleServiceAccountProvider';
import type { CredentialsAdapter } from './credentials/CredentialsProvider';
import { DropboxAuthProvider } from './auth/dropbox/DropboxAuthProvider';
import { GmailEmailProvider } from './email/google/GmailEmailProvider';
import { SupabaseDataProvider } from './data/supabase';
import { SupabaseStorageProvider } from './storage/supabase';
import { SupabaseAuthProvider } from './auth/supabase/SupabaseAuthProvider';
import { MockDataProvider } from './data/mock';
import type { AIProviderAdapter } from './ai/AIProvider';
import type { DataProviderAdapter } from './data/DataProvider';
import type { StorageProviderAdapter } from './storage/StorageProvider';
import type { AuthProviderAdapter } from './auth/AuthProvider';
import type { EmailProviderAdapter } from './email/EmailProvider';
import type { AIConfig, DropboxConfig, FirebaseConfig, GoogleOAuth2, GoogleServiceAccount, SupabaseConfig } from '../Config';
import { RuntimeAIProvider } from './ai/shared';
import { ANTHROPIC_PROVIDER_DEFINITION } from './ai/anthropic';
import { DEEPSEEK_PROVIDER_DEFINITION } from './ai/deepseek';
import { GEMINI_PROVIDER_DEFINITION } from './ai/gemini';
import { MISTRAL_PROVIDER_DEFINITION } from './ai/mistral';
import { OPENAI_PROVIDER_DEFINITION } from './ai/openai';
import { OPENCODE_PROVIDER_DEFINITION } from './ai/opencode';
import { OPENROUTER_PROVIDER_DEFINITION } from './ai/openrouter';

// ── Types ────────────────────────────────────────────────────────────────────

export type ServiceCategory = 'data' | 'storage' | 'auth' | 'email' | 'ai' | 'credentials';

type AnyAdapter =
    | DataProviderAdapter
    | StorageProviderAdapter
    | AuthProviderAdapter
    | EmailProviderAdapter
    | AIProviderAdapter
    | CredentialsAdapter;

export interface DriverDescriptor<TConfig = unknown> {
    service: ServiceCategory;
    create: (config: TConfig) => AnyAdapter;
    when?: (config: TConfig) => boolean;
}

export type DriverManifest<TConfig> = Record<string, DriverDescriptor<TConfig>>;

// ── Provider config types ────────────────────────────────────────────────────

export type GoogleProviderConfig = GoogleOAuth2 & {
    serviceAccount?: GoogleServiceAccount;
    developerToken?: string;
};

export type SupabaseProviderConfig = SupabaseConfig;

export type MockProviderConfig = {
    data?: ConstructorParameters<typeof MockDataProvider>[0];
};

// ── Firebase manifest ────────────────────────────────────────────────────────

export const FIREBASE_MANIFEST: DriverManifest<FirebaseConfig> = {
    dbRealtime:   { service: 'data',    create: () => new FirebaseDataProvider() },
    firestoreDb:  { service: 'data',    create: () => new FirestoreDataProvider() },
    firestorage:  { service: 'storage', create: () => new FirebaseStorageProvider() },
    firebaseAuth: { service: 'auth',    create: () => new FirebaseAuthProvider() },
};

// ── Google manifest ──────────────────────────────────────────────────────────

export const GOOGLE_MANIFEST: DriverManifest<GoogleProviderConfig> = {
    googleAuth:           { service: 'auth',        create: () => new GoogleAuthProvider() },
    gmail:                { service: 'email',       create: () => new GmailEmailProvider() },
    googleServiceAccount: { service: 'credentials', create: (cfg) => new GoogleServiceAccountProvider(cfg.serviceAccount!), when: (cfg) => !!cfg.serviceAccount },
};

export const DROPBOX_MANIFEST: DriverManifest<DropboxConfig> = {
    dropboxAuth: { service: 'auth', create: (cfg) => new DropboxAuthProvider(cfg) },
};

// ── Supabase manifest ────────────────────────────────────────────────────────

export const SUPABASE_MANIFEST: DriverManifest<SupabaseProviderConfig> = {
    supabaseDb:      { service: 'data',    create: (cfg) => new SupabaseDataProvider(cfg) },
    supabaseStorage: { service: 'storage', create: (cfg) => new SupabaseStorageProvider(cfg) },
    supabaseAuth:    { service: 'auth',    create: (cfg) => new SupabaseAuthProvider(cfg) },
};

// ── Mock manifest ────────────────────────────────────────────────────────────

export const MOCK_MANIFEST: DriverManifest<MockProviderConfig> = {
    mock: { service: 'data', create: (cfg) => new MockDataProvider(cfg?.data) },
};

// ── AI manifest ──────────────────────────────────────────────────────────────

const toAIDriver = (def: typeof OPENAI_PROVIDER_DEFINITION, configKey: keyof AIConfig): DriverDescriptor<AIConfig> => ({
    service: 'ai',
    create: (cfg) => new RuntimeAIProvider(def, (cfg?.[configKey] as string) || ''),
});

export const AI_MANIFEST: DriverManifest<AIConfig> = {
    openai:     toAIDriver(OPENAI_PROVIDER_DEFINITION, 'openaiApiKey'),
    openrouter: toAIDriver(OPENROUTER_PROVIDER_DEFINITION, 'openRouterApiKey'),
    opencode:   toAIDriver(OPENCODE_PROVIDER_DEFINITION, 'openCodeApiKey'),
    deepseek:   toAIDriver(DEEPSEEK_PROVIDER_DEFINITION, 'deepSeekApiKey'),
    gemini:     toAIDriver(GEMINI_PROVIDER_DEFINITION, 'geminiApiKey'),
    anthropic:  toAIDriver(ANTHROPIC_PROVIDER_DEFINITION, 'anthropicApiKey'),
    mistral:    toAIDriver(MISTRAL_PROVIDER_DEFINITION, 'mistralApiKey'),
};

// ── Central registry — adding a provider = one new entry here ────────────────

export const PROVIDER_MANIFESTS: Record<string, DriverManifest<any>> = {
    firebase: FIREBASE_MANIFEST,
    google:   GOOGLE_MANIFEST,
    dropbox:  DROPBOX_MANIFEST,
    supabase: SUPABASE_MANIFEST,
    mock:     MOCK_MANIFEST,
    ai:       AI_MANIFEST,
};

// ── Driver name unions (type-safe services config) ────────────────────────────

export type DataDriverName    = 'dbRealtime' | 'firestoreDb' | 'supabaseDb' | 'mock';
export type StorageDriverName = 'firestorage' | 'supabaseStorage';
export type AuthDriverName        = 'googleAuth' | 'firebaseAuth' | 'dropboxAuth' | 'supabaseAuth';
export type EmailDriverName       = 'gmail';
export type AIDriverName          = 'openai' | 'openrouter' | 'opencode' | 'openai-compatible' | 'deepseek' | 'gemini' | 'anthropic' | 'mistral';
export type CredentialsDriverName = 'googleServiceAccount';

export type ServicesConfig = {
    data?:        DataDriverName | string;
    storage?:     StorageDriverName | string;
    auth?:        AuthDriverName | string;
    email?:       EmailDriverName | string;
    ai?:          AIDriverName | string;
    credentials?: CredentialsDriverName | string;
};
