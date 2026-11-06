/**
 * CR-122: how much a model reasons, sent in the wire format of each provider on the models that take it,
 * and nothing elsewhere (an older model rejects what it does not know).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../src/providers/proxy', () => ({
    proxyFetch: undefined,
    isProxyEnabled: vi.fn(() => false),
}));

vi.mock('../../../src/libs/fetch', () => ({
    fetchJson: vi.fn(),
}));

import { ANTHROPIC_PROVIDER_DEFINITION } from '../../../src/providers/ai/anthropic';
import { OPENAI_PROVIDER_DEFINITION } from '../../../src/providers/ai/openai';
import { OPENROUTER_PROVIDER_DEFINITION } from '../../../src/providers/ai/openrouter';
import { OPENCODE_PROVIDER_DEFINITION } from '../../../src/providers/ai/opencode';
import { anthropicReasoning, openAIReasoning } from '../../../src/providers/ai/shared';
import * as fetchLib from '../../../src/libs/fetch';

const fetchJson = () => vi.mocked(fetchLib.fetchJson);
const sentBody = () => fetchJson().mock.calls[0][1]?.body as Record<string, unknown>;

beforeEach(() => vi.clearAllMocks());

describe('the reasoning level of a request', () => {
    it('is the effort of a Claude model that takes it, adaptive thinking where it is not on by default', () => {
        expect(anthropicReasoning('claude-opus-5-5', 'medium')).toEqual({ output_config: { effort: 'medium' } });
        expect(anthropicReasoning('claude-fable-5-1', 'max')).toEqual({ output_config: { effort: 'max' } });
        expect(anthropicReasoning('claude-haiku-5-5', 'low')).toEqual({ output_config: { effort: 'low' } });
        expect(anthropicReasoning('claude-opus-4-8', 'high')).toEqual({ output_config: { effort: 'high' }, thinking: { type: 'adaptive' } });
        expect(anthropicReasoning('claude-sonnet-4-6', 'low')).toEqual({ output_config: { effort: 'low' }, thinking: { type: 'adaptive' } });
        // Older models reject it: nothing.
        expect(anthropicReasoning('claude-haiku-4-5', 'high')).toEqual({});
        expect(anthropicReasoning('claude-sonnet-4-5-20250929', 'high')).toEqual({});
        expect(anthropicReasoning('claude-opus-5-5', undefined)).toEqual({});
    });

    it('is reasoning_effort on a reasoning model of OpenAI only, reasoning.effort on OpenRouter', () => {
        expect(openAIReasoning('gpt-5.5', 'medium')).toEqual({ reasoning_effort: 'medium' });
        expect(openAIReasoning('o4-mini', 'max')).toEqual({ reasoning_effort: 'high' });
        expect(openAIReasoning('opencode/gpt-5.5-codex', 'low')).toEqual({ reasoning_effort: 'low' });
        expect(openAIReasoning('gpt-4o', 'high')).toEqual({});
        expect(openAIReasoning('deepseek-v4.1-flash', 'high')).toEqual({});
        expect(openAIReasoning('anthropic/claude-opus-5.5', 'max', 'openrouter')).toEqual({ reasoning: { effort: 'high' } });
    });

    it('reaches the body of each provider, and only when asked', async () => {
        fetchJson().mockResolvedValue({ content: [{ type: 'text', text: 'ok' }], stop_reason: 'end_turn' });
        await ANTHROPIC_PROVIDER_DEFINITION.complete('sk', { prompt: 'hi', model: 'claude-opus-5-5', reasoning: 'high' });
        expect(sentBody()).toMatchObject({ model: 'claude-opus-5-5', output_config: { effort: 'high' } });

        vi.clearAllMocks();
        fetchJson().mockResolvedValue({ content: [{ type: 'text', text: 'ok' }], stop_reason: 'end_turn' });
        await ANTHROPIC_PROVIDER_DEFINITION.complete('sk', { prompt: 'hi', model: 'claude-opus-5-5' });
        expect(sentBody()).not.toHaveProperty('output_config');

        for (const [definition, model, expected] of [
            [OPENAI_PROVIDER_DEFINITION, 'gpt-5.5', { reasoning_effort: 'low' }],
            [OPENCODE_PROVIDER_DEFINITION, 'gpt-5.5', { reasoning_effort: 'low' }],
            [OPENROUTER_PROVIDER_DEFINITION, 'deepseek/deepseek-v4.1', { reasoning: { effort: 'low' } }],
        ] as const) {
            vi.clearAllMocks();
            fetchJson().mockResolvedValue({ choices: [{ message: { content: 'ok' } }] });
            await definition.complete('sk', { prompt: 'hi', model, reasoning: 'low' });
            expect(sentBody()).toMatchObject(expected);
        }
    });
});
