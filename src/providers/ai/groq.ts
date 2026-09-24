import { createOpenAICompatibleProviderDefinition } from './openaiCompatible';

/** `/models` also lists speech-to-text (whisper), text-to-speech (orpheus) and safety
 * classifiers (llama-guard, prompt-guard, gpt-oss-safeguard) — none of them is a chat model. */
const NON_CHAT_MODEL_PATTERN = /whisper|orpheus|tts|guard/i;

export const GROQ_PROVIDER_DEFINITION = createOpenAICompatibleProviderDefinition({
    id: 'groq',
    label: 'Groq',
    description: 'Very fast inference on open-weight models, with a free tier.',
    configKey: 'groqApiKey',
    defaultModel: 'openai/gpt-oss-120b',
    fallbackModels: ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'],
    baseUrl: 'https://api.groq.com/openai/v1',
    dashboardUrl: 'https://console.groq.com/keys',
    credentialsHint: 'Groq Console → API Keys → Create API Key.',
    mapModelEntry: (entry) => (
        typeof entry.id === 'string' && entry.active !== false && !NON_CHAT_MODEL_PATTERN.test(entry.id)
            ? entry.id
            : undefined
    ),
});
