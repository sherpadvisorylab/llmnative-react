import { describe, expect, it } from 'vitest';

import { PromptUtils } from '../../../src/libs/promptUtils';

describe('PromptUtils', () => {
    it('estimates token counts using the documented chars-per-token heuristic', () => {
        expect(PromptUtils.countTokens('Hello world')).toBe(3);
    });

    it('returns model context windows and usage percentages for known models', () => {
        expect(PromptUtils.modelContextWindow('openai/gpt-4o')).toBe(128000);
        expect(PromptUtils.contextPercent(64000, 'openai/gpt-4o')).toBe(50);
    });

    it('estimates model pricing when pricing metadata is known', () => {
        expect(PromptUtils.estimateCost(500, 200, 'openai/gpt-4o')).toBeCloseTo(0.00325, 8);
        expect(Number.isNaN(PromptUtils.estimateCost(10, 10, 'unknown/model'))).toBe(true);
    });

    it('converts browser files into AI attachments', async () => {
        const file = new File(['hello world'], 'notes.txt', { type: 'text/plain' });
        const attachment = await PromptUtils.fileToAttachment(file);

        expect(attachment).toMatchObject({
            mimeType: 'text/plain',
            name: 'notes.txt',
        });
        expect(attachment.base64).toBeTruthy();
    });
});
