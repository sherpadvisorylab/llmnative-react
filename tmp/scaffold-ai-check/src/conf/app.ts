import type { AIConfig, AppProvidersConfig } from '@llmnative/react';
import { mockData } from '../data/mockData';

const env = import.meta.env;
const selectedProvider = env.VITE_PROVIDER ?? 'mock';
const selectedAIProvider = env.VITE_AI_PROVIDER ?? 'openai';

const dataDriver =
  selectedProvider === 'firebase' ? 'dbRealtime'
    : selectedProvider === 'supabase' ? 'supabaseDb'
      : 'mock';

const storageDriver =
  selectedProvider === 'firebase' ? 'firestorage'
    : selectedProvider === 'supabase' ? 'supabaseStorage'
      : undefined;

const aiDriver = selectedAIProvider !== 'none'
  ? selectedAIProvider
  : undefined;

export const appConfig = {
  provider:     selectedProvider,
  aiProvider:   selectedAIProvider,
  iconProvider: env.VITE_ICON_PROVIDER ?? 'lucide',
  theme:        env.VITE_THEME        ?? 'flat',
};

export const aiConfig: AIConfig = {
  openaiApiKey:    env.VITE_OPENAI_API_KEY ?? '',
  geminiApiKey:    env.VITE_GEMINI_API_KEY ?? '',
  anthropicApiKey: env.VITE_ANTHROPIC_API_KEY ?? '',
  mistralApiKey:   env.VITE_MISTRAL_API_KEY ?? '',
};

export const providers: AppProvidersConfig = {
  mock: {
    data: mockData,
  },
  firebase: {
    apiKey:            env.VITE_FIREBASE_APIKEY ?? '',
    authDomain:        env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
    databaseURL:       env.VITE_FIREBASE_DATABASE_URL ?? '',
    projectId:         env.VITE_FIREBASE_PROJECT_ID ?? '',
    storageBucket:     env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId:             env.VITE_FIREBASE_APP_ID ?? '',
    measurementId:     env.VITE_FIREBASE_MEASUREMENT_ID ?? '',
  },
  supabase: {
    url:     env.VITE_SUPABASE_URL ?? '',
    anonKey: env.VITE_SUPABASE_ANON_KEY ?? '',
  },
  google: {
    clientId: env.VITE_GOOGLE_CLIENT_ID ?? '',
    scope:    env.VITE_GOOGLE_SCOPE ?? '',
  },
  services: {
    data: dataDriver,
    ...(storageDriver ? { storage: storageDriver } : {}),
    auth: 'googleAuth',
    ...(aiDriver ? { ai: aiDriver } : {}),
  },
};
    