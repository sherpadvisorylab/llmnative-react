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

    it('classifies text-like mimetypes as text attachments', () => {
        expect(PromptUtils.isTextAttachment('text/plain')).toBe(true);
        expect(PromptUtils.isTextAttachment('text/csv')).toBe(true);
        expect(PromptUtils.isTextAttachment('application/json')).toBe(true);
        expect(PromptUtils.isTextAttachment('application/xml')).toBe(true);
    });

    it('does not classify images or binary documents as text attachments', () => {
        expect(PromptUtils.isTextAttachment('image/png')).toBe(false);
        expect(PromptUtils.isTextAttachment('application/pdf')).toBe(false);
        expect(PromptUtils.isTextAttachment('application/octet-stream')).toBe(false);
    });

    it('decodes base64 back to UTF-8 text, including multi-byte characters', () => {
        expect(PromptUtils.decodeBase64Text('SGVsbG8gV29ybGQ=')).toBe('Hello World');
        // "café" — the é is a 2-byte UTF-8 sequence; atob() alone would corrupt it.
        expect(PromptUtils.decodeBase64Text('Y2Fmw6k=')).toBe('café');
    });

    it('returns an empty string for invalid base64 input instead of throwing', () => {
        expect(PromptUtils.decodeBase64Text('not-valid-base64!!!')).toBe('');
    });
});
