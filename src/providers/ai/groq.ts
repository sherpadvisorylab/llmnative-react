import type { DiscoveredAIModel } from './shared';
import { createOpenAICompatibleProviderDefinition } from './openaiCompatible';

/** `/models` lists more than chat models: speech-to-text (`whisper-*`), text-to-speech
 * (`playai-tts*`), the Orpheus TTS family (`*-orpheus-*`) and safety classifiers
 * (`*guard*`, which also covers `gpt-oss-safeguard-*` and `llama-prompt-guard-*`).
 * Discovery keeps only the chat/instruct models the completion endpoint accepts. */
const GROQ_NON_CHAT_MODEL = /whisper|tts|orpheus|guard/i;

export const isGroqChatModel = (id: string): boolean => !GROQ_NON_CHAT_MODEL.test(id);

/** `/models` also reports `active: false` on models that are no longer served. */
const mapGroqModelEntry = (entry: Record<string, unknown>): string | DiscoveredAIModel | undefined => {
    if (typeof entry.id !== 'string') return undefined;
    if (entry.active === false) return undefined;
    return isGroqChatModel(entry.id) ? entry.id : undefined;
};

export const GROQ_PROVIDER_DEFINITION = createOpenAICompatibleProviderDefinition({
    id: 'groq',
    label: 'Groq',
    description: 'Fast inference on open-weight models (GPT-OSS, Qwen, Llama…).',
    configKey: 'groqApiKey',
    defaultModel: 'llama-3.3-70b-versatile',
    fallbackModels: [
        'llama-3.3-70b-versatile',
        'openai/gpt-oss-120b',
        'openai/gpt-oss-20b',
        'meta-llama/llama-4-scout-17b-16e-instruct',
        'qwen/qwen3-32b',
    ],
    baseUrl: 'https://api.groq.com/openai/v1',
    dashboardUrl: 'https://console.groq.com/keys',
    credentialsHint: 'Groq console → API Keys → Create API Key.',
    mapModelEntry: mapGroqModelEntry,
});
