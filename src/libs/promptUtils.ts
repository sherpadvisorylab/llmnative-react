import { type AIAttachment, parseAIModelRef } from '../providers/ai/AIProvider';

// Approximate context windows (tokens) per known model
const CONTEXT_WINDOWS: Record<string, number> = {
    // OpenAI
    'gpt-4o': 128_000,
    'gpt-4o-mini': 128_000,
    'gpt-4-turbo': 128_000,
    'gpt-4': 8_192,
    'gpt-3.5-turbo': 16_385,
    // Anthropic
    'claude-opus-4-8': 200_000,
    'claude-sonnet-4-6': 200_000,
    'claude-haiku-4-5': 200_000,
    'claude-3-5-sonnet-20241022': 200_000,
    'claude-3-5-haiku-20241022': 200_000,
    // Google
    'gemini-2.0-flash': 1_048_576,
    'gemini-1.5-pro': 2_097_152,
    'gemini-1.5-flash': 1_048_576,
    // DeepSeek
    'deepseek-chat': 64_000,
    'deepseek-coder': 128_000,
    // Mistral
    'mistral-large-latest': 131_072,
    'mistral-medium': 32_768,
    'mistral-small-latest': 131_072,
    'open-mistral-nemo': 128_000,
    // Meta / Llama
    'llama-3.1-70b-instruct': 131_072,
    'llama-3.1-8b-instruct': 131_072,
};

// Pricing table: [input $/1M, output $/1M]
const PRICING: Record<string, [number, number]> = {
    'gpt-4o': [2.5, 10],
    'gpt-4o-mini': [0.15, 0.6],
    'gpt-4-turbo': [10, 30],
    'gpt-4': [30, 60],
    'gpt-3.5-turbo': [0.5, 1.5],
    'claude-opus-4-8': [15, 75],
    'claude-sonnet-4-6': [3, 15],
    'claude-haiku-4-5': [0.8, 4],
    'claude-3-5-sonnet-20241022': [3, 15],
    'claude-3-5-haiku-20241022': [0.8, 4],
    'gemini-2.0-flash': [0.1, 0.4],
    'gemini-1.5-pro': [1.25, 5],
    'gemini-1.5-flash': [0.075, 0.3],
    'deepseek-chat': [0.14, 0.28],
    'mistral-large-latest': [2, 6],
    'mistral-medium': [2.7, 8.1],
    'mistral-small-latest': [0.1, 0.3],
};

const resolveModelId = (modelRef: string): string => {
    const parsed = parseAIModelRef(modelRef);
    return parsed?.model ?? modelRef;
};

const readFileAsDataUrl = (file: File): Promise<string> => (
    new Promise((resolve, reject) => {
        if (typeof FileReader === 'undefined') {
            reject(new Error('FileReader is not available in this environment.'));
            return;
        }

        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ''));
        reader.onerror = () => reject(reader.error ?? new Error(`Failed to read file "${file.name}".`));
        reader.readAsDataURL(file);
    })
);

export const PromptUtils = {
    /**
     * Rough token count: ~4 chars per token (heuristic, no tiktoken needed).
     */
    countTokens(text: string): number {
        return Math.ceil(text.length / 4);
    },

    /**
     * Returns the known context window for the model, or null if unknown.
     */
    modelContextWindow(modelRef: string): number | null {
        const modelId = resolveModelId(modelRef);
        return CONTEXT_WINDOWS[modelId] ?? null;
    },

    /**
     * Percentage of the model's context window used by `tokens`.
     * Returns 0 if the model context window is unknown.
     */
    contextPercent(tokens: number, modelRef: string): number {
        const ctx = PromptUtils.modelContextWindow(modelRef);
        if (!ctx || ctx <= 0) return 0;
        return Math.min(100, (tokens / ctx) * 100);
    },

    /**
     * Estimated cost in USD. Returns NaN if pricing is unavailable for the model.
     */
    estimateCost(tokensIn: number, tokensOut: number, modelRef: string): number {
        const modelId = resolveModelId(modelRef);
        const pricing = PRICING[modelId];
        if (!pricing) return NaN;
        return (tokensIn * pricing[0] + tokensOut * pricing[1]) / 1_000_000;
    },

    /**
     * Convert a browser File into the transport-ready attachment shape used by AI providers.
     */
    async fileToAttachment(file: File): Promise<AIAttachment> {
        const dataUrl = await readFileAsDataUrl(file);
        const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : '';
        return {
            mimeType: file.type || 'application/octet-stream',
            base64,
            name: file.name,
        };
    },
};
