import { FirebaseDataProvider } from './data/firebase';
import { FirebaseStorageProvider } from './storage/firebase';
import { GoogleAuthProvider } from './auth/google/GoogleAuthProvider';
import { DropboxAuthProvider } from './auth/dropbox/DropboxAuthProvider';
import { GmailEmailProvider } from './email/google/GmailEmailProvider';
import { SupabaseDataProvider } from './data/supabase';
import { SupabaseStorageProvider } from './storage/supabase';
import { MockDataProvider } from './data/mock';
import type { DataProviderAdapter } from './data/DataProvider';
import type { StorageProviderAdapter } from './storage/StorageProvider';
import type { AuthProviderAdapter } from './auth/AuthProvider';
import type { EmailProviderAdapter } from './email/EmailProvider';
import type { DropboxConfig, FirebaseConfig, GoogleOAuth2, GoogleServiceAccount } from '../Config';

// ── Types ────────────────────────────────────────────────────────────────────

export type ServiceCategory = 'data' | 'storage' | 'auth' | 'email';

type AnyAdapter =
    | DataProviderAdapter
    | StorageProviderAdapter
    | AuthProviderAdapter
    | EmailProviderAdapter;

export interface DriverDescriptor<TConfig = unknown> {
    service: ServiceCategory;
    create: (config: TConfig) => AnyAdapter;
}

export type DriverManifest<TConfig> = Record<string, DriverDescriptor<TConfig>>;

// ── Provider config types ────────────────────────────────────────────────────

export type GoogleProviderConfig = GoogleOAuth2 & {
    serviceAccount?: GoogleServiceAccount;
    developerToken?: string;
};

export type SupabaseProviderConfig = {
    url: string;
    anonKey: string;
    bucket?: string;
};

export type MockProviderConfig = {
    data?: ConstructorParameters<typeof MockDataProvider>[0];
};

// ── Firebase manifest ────────────────────────────────────────────────────────

export const FIREBASE_MANIFEST: DriverManifest<FirebaseConfig> = {
    dbRealtime:  { service: 'data',    create: () => new FirebaseDataProvider() },
    firestorage: { service: 'storage', create: () => new FirebaseStorageProvider() },
};

// ── Google manifest ──────────────────────────────────────────────────────────

export const GOOGLE_MANIFEST: DriverManifest<GoogleProviderConfig> = {
    googleAuth: { service: 'auth',  create: () => new GoogleAuthProvider() },
    gmail:      { service: 'email', create: () => new GmailEmailProvider() },
};

export const DROPBOX_MANIFEST: DriverManifest<DropboxConfig> = {
    dropboxAuth: { service: 'auth', create: (cfg) => new DropboxAuthProvider(cfg) },
};

// ── Supabase manifest ────────────────────────────────────────────────────────

export const SUPABASE_MANIFEST: DriverManifest<SupabaseProviderConfig> = {
    supabaseDb:      { service: 'data',    create: (cfg) => new SupabaseDataProvider(cfg) },
    supabaseStorage: { service: 'storage', create: (cfg) => new SupabaseStorageProvider(cfg) },
};

// ── Mock manifest ────────────────────────────────────────────────────────────

export const MOCK_MANIFEST: DriverManifest<MockProviderConfig> = {
    mock: { service: 'data', create: (cfg) => new MockDataProvider(cfg?.data) },
};

// ── Central registry — adding a provider = one new entry here ────────────────

export const PROVIDER_MANIFESTS: Record<string, DriverManifest<any>> = {
    firebase: FIREBASE_MANIFEST,
    google:   GOOGLE_MANIFEST,
    dropbox:  DROPBOX_MANIFEST,
    supabase: SUPABASE_MANIFEST,
    mock:     MOCK_MANIFEST,
};

// ── Driver name unions (type-safe services config) ────────────────────────────

export type DataDriverName    = 'dbRealtime' | 'supabaseDb' | 'mock';
export type StorageDriverName = 'firestorage' | 'supabaseStorage';
export type AuthDriverName    = 'googleAuth' | 'dropboxAuth';
export type EmailDriverName   = 'gmail';

export type ServicesConfig = {
    data?:    DataDriverName;
    storage?: StorageDriverName;
    auth?:    AuthDriverName;
    email?:   EmailDriverName;
};
