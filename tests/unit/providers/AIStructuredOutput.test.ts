/**
 * CR-132: structured answers the project decides (native where the provider has a mode, instructed in the
 * prompt elsewhere, validated, one correction, then AIOutputError), the tokens used, and where each model
 * processes the data.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

vi.mock('../../../src/libs/fetch', () => ({
    fetchJson: vi.fn(),
}));

import { ANTHROPIC_PROVIDER_DEFINITION } from '../../../src/providers/ai/anthropic';
import { GEMINI_PROVIDER_DEFINITION, toGeminiSchema } from '../../../src/providers/ai/gemini';
import { OPENAI_PROVIDER_DEFINITION } from '../../../src/providers/ai/openai';
import { GROQ_PROVIDER_DEFINITION } from '../../../src/providers/ai/groq';
import { RuntimeAIProvider, type AIProviderDefinition } from '../../../src/providers/ai/shared';
import { AIOutputError, createAIProvider } from '../../../src/providers/ai';
import { extractJson, validateJsonSchema, type JsonSchema } from '../../../src/libs/jsonSchema';
import * as fetchLib from '../../../src/libs/fetch';

const fetchJson = () => vi.mocked(fetchLib.fetchJson);
const sentBody = (call = 0) => fetchJson().mock.calls[call][1]?.body as Record<string, any>;

const SCHEMA: JsonSchema = {
    type: 'object',
    required: ['tipo', 'servizi'],
    properties: {
        tipo: { type: 'string', enum: ['privato', 'azienda'] },
        servizi: { type: 'array', items: { type: 'string' } },
        confidenza: { type: 'number', minimum: 0, maximum: 1 },
        nota: { type: ['string', 'null'] },
    },
};

beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
});

describe('validateJsonSchema', () => {
    it('accepts a value that follows the schema', () => {
        expect(validateJsonSchema(SCHEMA, { tipo: 'azienda', servizi: ['a'], confidenza: 0.9, nota: null })).toEqual([]);
    });

    it('says what is wrong, with the path', () => {
        expect(validateJsonSchema(SCHEMA, { tipo: 'ente', servizi: [1], confidenza: 2 })).toEqual([
            'tipo: must be one of "privato", "azienda"',
            'servizi[0]: expected string, got integer',
            'confidenza: must be <= 1',
        ]);
        expect(validateJsonSchema(SCHEMA, { servizi: [] })).toEqual(['tipo: required']);
        expect(validateJsonSchema(SCHEMA, [])).toEqual(['(root): expected object, got array']);
        expect(validateJsonSchema({ type: 'object', properties: {}, additionalProperties: false }, { x: 1 })).toEqual(['x: not allowed']);
        expect(validateJsonSchema({ type: 'number' }, 3)).toEqual([]);
    });
});

describe('extractJson', () => {
    it('reads the JSON of an answer: whole, fenced or inside the text', () => {
        expect(extractJson('{"a":1}')).toEqual({ a: 1 });
        expect(extractJson('Ecco:\n```json\n{"a":[1,2]}\n```')).toEqual({ a: [1, 2] });
        expect(extractJson('Risposta: {"a":"x}y", "b":{"c":2}} fine')).toEqual({ a: 'x}y', b: { c: 2 } });
        expect(extractJson('nessun json')).toBeUndefined();
    });
});

/** A definition whose answers are given in turn, recording what it was asked. */
function scripted(answers: Array<string | null>, structuredOutput?: 'native'): { definition: AIProviderDefinition; asked: any[] } {
    const asked: any[] = [];
    let index = 0;
    return {
        asked,
        definition: {
            id: 'openai',
            label: 'Test',
            defaultModel: 'm',
            fallbackModels: ['m'],
            ...(structuredOutput ? { structuredOutput } : {}),
            discoverModels: async () => [],
            complete: async (_key, request) => {
                asked.push(request);
                const text = answers[index++];
                return text === null ? null : { type: 'text', text, usage: { inputTokens: 10, outputTokens: 5 } };
            },
        },
    };
}

describe('a structured answer through the adapter', () => {
    it('native: the schema goes to the provider, the data comes back validated with the tokens', async () => {
        const { definition, asked } = scripted(['{"tipo":"azienda","servizi":["x"]}'], 'native');
        const result = await new RuntimeAIProvider(definition, 'k').complete({ prompt: 'Classifica', output: { schema: SCHEMA } });
        expect(result).toEqual({ type: 'text', text: '{"tipo":"azienda","servizi":["x"]}', data: { tipo: 'azienda', servizi: ['x'] }, usage: { inputTokens: 10, outputTokens: 5 } });
        expect(asked[0].output).toEqual({ schema: SCHEMA });
        expect(asked[0].prompt).toBe('Classifica');
    });

    it('instructed: the schema goes in the prompt, the JSON is read out of the text', async () => {
        const { definition, asked } = scripted(['Certo! ```json\n{"tipo":"privato","servizi":[]}\n```']);
        const result = await new RuntimeAIProvider(definition, 'k').complete({ prompt: 'Classifica', output: { schema: SCHEMA } });
        expect(result).toMatchObject({ data: { tipo: 'privato', servizi: [] } });
        expect(asked[0].output).toBeUndefined();
        expect(asked[0].prompt).toContain('Classifica');
        expect(asked[0].prompt).toContain(JSON.stringify(SCHEMA));
    });

    it('one correction with the errors, the tokens of both calls', async () => {
        const { definition, asked } = scripted(['{"tipo":"ente","servizi":[]}', '{"tipo":"azienda","servizi":[]}'], 'native');
        const result = await new RuntimeAIProvider(definition, 'k').complete({ prompt: 'Classifica', output: { schema: SCHEMA } });
        expect(result).toMatchObject({ data: { tipo: 'azienda' }, usage: { inputTokens: 20, outputTokens: 10 } });
        expect(asked[1].prompt).toContain('tipo: must be one of');
        expect(asked[1].prompt).toContain('{"tipo":"ente","servizi":[]}');
    });

    it('then AIOutputError, never data that does not follow the schema', async () => {
        const { definition } = scripted(['non so', null]);
        const error = await new RuntimeAIProvider(definition, 'k').complete({ prompt: 'x', output: { schema: SCHEMA } }).catch((e) => e);
        expect(error).toBeInstanceOf(AIOutputError);
        expect(error.code).toBe('invalid-output');
        expect(error.errors).toEqual(['no answer']);
    });

    it('not together with tools', async () => {
        const { definition } = scripted(['{}']);
        await expect(new RuntimeAIProvider(definition, 'k').complete({ prompt: 'x', output: { schema: SCHEMA }, tools: [{ name: 't', description: 'd', inputSchema: {} }] }))
            .rejects.toThrow(/cannot be asked together with tools/);
    });

    it('the key may come fresh from a source before each call', async () => {
        const seen: string[] = [];
        const { definition } = scripted(['a', 'b']);
        const original = definition.complete;
        definition.complete = (key, request) => { seen.push(key); return original(key, request); };
        let n = 0;
        const provider = createAIProvider(definition, async () => `token-${++n}`);
        await provider.complete({ prompt: 'x' });
        await provider.complete({ prompt: 'y' });
        expect(seen).toEqual(['token-1', 'token-2']);
    });
});

describe('the native modes of the providers', () => {
    it('Gemini: responseSchema in its OpenAPI form, the tokens with the thinking, no thought in the text', async () => {
        fetchJson().mockResolvedValue({
            candidates: [{ content: { parts: [{ text: 'thinking…', thought: true }, { text: '{"tipo":"privato","servizi":[]}' }] } }],
            usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 20, thoughtsTokenCount: 30 },
        });
        const result = await GEMINI_PROVIDER_DEFINITION.complete('k', { prompt: 'p', model: 'gemini-x', output: { schema: SCHEMA }, maxOutputTokens: 512 });
        expect(sentBody().generationConfig).toEqual({ maxOutputTokens: 512, responseMimeType: 'application/json', responseSchema: toGeminiSchema(SCHEMA) });
        expect(toGeminiSchema(SCHEMA)).toEqual({
            type: 'OBJECT',
            required: ['tipo', 'servizi'],
            properties: {
                tipo: { type: 'STRING', enum: ['privato', 'azienda'] },
                servizi: { type: 'ARRAY', items: { type: 'STRING' } },
                confidenza: { type: 'NUMBER', minimum: 0, maximum: 1 },
                nota: { type: 'STRING', nullable: true },
            },
        });
        expect(result).toEqual({ type: 'text', text: '{"tipo":"privato","servizi":[]}', usage: { inputTokens: 100, outputTokens: 50 } });
    });

    it('Anthropic: a forced answer tool, its input as the answer', async () => {
        fetchJson().mockResolvedValue({ content: [{ type: 'tool_use', id: 't1', name: 'answer', input: { tipo: 'azienda', servizi: [] } }], usage: { input_tokens: 7, output_tokens: 3 } });
        const result = await ANTHROPIC_PROVIDER_DEFINITION.complete('k', { prompt: 'p', model: 'claude-haiku-5-5', output: { schema: SCHEMA }, maxOutputTokens: 800 });
        expect(sentBody()).toMatchObject({ max_tokens: 800, tool_choice: { type: 'tool', name: 'answer' }, tools: [{ name: 'answer', input_schema: SCHEMA }] });
        expect(result).toEqual({ type: 'text', text: '{"tipo":"azienda","servizi":[]}', usage: { inputTokens: 7, outputTokens: 3 } });
    });

    it('Anthropic: a model that thinks gets the schema in the prompt instead', async () => {
        fetchJson().mockResolvedValue({ content: [{ type: 'text', text: '{"tipo":"azienda","servizi":[]}' }] });
        await ANTHROPIC_PROVIDER_DEFINITION.complete('k', { prompt: 'p', model: 'claude-opus-4-8', reasoning: 'high', output: { schema: SCHEMA } });
        expect(sentBody()).not.toHaveProperty('tool_choice');
        expect(JSON.stringify(sentBody().messages)).toContain('JSON Schema');
    });

    it('OpenAI: response_format json_schema and max_completion_tokens; another compatible endpoint is instructed', async () => {
        fetchJson().mockResolvedValue({ choices: [{ message: { content: '{"tipo":"privato","servizi":[]}' } }], usage: { prompt_tokens: 4, completion_tokens: 2 } });
        const result = await OPENAI_PROVIDER_DEFINITION.complete('k', { prompt: 'p', model: 'gpt-5', output: { schema: SCHEMA, name: 'lead classification' }, maxOutputTokens: 300 });
        expect(sentBody()).toMatchObject({ max_completion_tokens: 300, response_format: { type: 'json_schema', json_schema: { name: 'lead_classification', schema: SCHEMA, strict: false } } });
        expect(result).toMatchObject({ usage: { inputTokens: 4, outputTokens: 2 } });
        expect(GROQ_PROVIDER_DEFINITION.structuredOutput).toBeUndefined();
    });
});

describe('where a model processes the data', () => {
    it('is unknown unless the provider declares it, and says how the model gives a structured answer', async () => {
        const { definition } = scripted([]);
        const capabilities = await new RuntimeAIProvider({ ...definition, fallbackModels: ['m1'] }, 'k').getCapabilities(true);
        expect(capabilities.models[0]).toMatchObject({ model: 'm1', dataRegion: 'unknown', structuredOutput: 'prompted' });
        expect(capabilities).toMatchObject({ dataRegion: 'unknown', structuredOutput: 'prompted' });
        const eu = await new RuntimeAIProvider({ ...definition, fallbackModels: ['m2'], dataRegion: 'eu', structuredOutput: 'native', cacheKey: 'eu-test' }, 'k').getCapabilities(true);
        expect(eu.models[0]).toMatchObject({ dataRegion: 'eu', structuredOutput: 'native' });
    });
});

describe('the server entry', () => {
    it('imports no React, also through the AI adapters', () => {
        const root = resolve(__dirname, '../../../src/providers/ai/server.ts');
        const resolveFile = (from: string, spec: string) => {
            const base = resolve(dirname(from), spec);
            return [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`].find((file) => existsSync(file) && statSync(file).isFile());
        };
        const seen = new Set<string>();
        const queue = [root];
        const offenders: string[] = [];
        while (queue.length) {
            const file = queue.shift()!;
            if (seen.has(file)) continue;
            seen.add(file);
            const source = readFileSync(file, 'utf8');
            for (const match of source.matchAll(/^\s*(?:import|export)\s+(?!type\b)[^;]*?from\s+['"]([^'"]+)['"]/gm)) {
                const spec = match[1];
                if (spec === 'react' || spec.startsWith('react/') || spec === 'react-dom') offenders.push(file);
                else if (spec.startsWith('.')) {
                    const next = resolveFile(file, spec);
                    if (next) queue.push(next);
                }
            }
        }
        expect(offenders).toEqual([]);
        expect(seen.size).toBeGreaterThan(10);
    });
});
