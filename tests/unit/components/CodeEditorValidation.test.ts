import { describe, expect, it } from 'vitest';

import {
    CodeSyntaxError,
    getCodeValidationResult,
    validateCodeSyntax,
} from '../../../src/components/ui/fields/CodeEditor';

describe('codeEditorValidation', () => {
    it('accepts valid JSON', async () => {
        await expect(validateCodeSyntax('{"title":"Hello"}', 'json')).resolves.toBeUndefined();
    });

    it('rejects invalid JSON with syntax details', async () => {
        await expect(validateCodeSyntax('{"title": }', 'json')).rejects.toBeInstanceOf(CodeSyntaxError);
    });

    it('rejects invalid JavaScript', async () => {
        await expect(validateCodeSyntax('const answer = ;', 'js')).rejects.toBeInstanceOf(CodeSyntaxError);
    });

    it('rejects mismatched Liquid blocks', async () => {
        await expect(validateCodeSyntax('{% if customer %}Hello{% endfor %}', 'liquid')).rejects.toMatchObject({
            name: 'CodeSyntaxError',
            message: expect.stringMatching(/tag "endfor" not found/i),
        });
    });

    it('rejects malformed Liquid expressions with broken quotes', async () => {
        await expect(
            validateCodeSyntax('Ciao {{ user.name | default: "Utente dell"amore" }}!', 'liquid')
        ).rejects.toMatchObject({
            name: 'CodeSyntaxError',
            message: expect.stringMatching(/not closed|invalid liquid syntax/i),
        });
    });

    it('returns a structured validation result', async () => {
        const result = await getCodeValidationResult('const answer = ;', 'js');

        expect(result.valid).toBe(false);
        expect(result.error).toBeInstanceOf(CodeSyntaxError);
        expect(result.error?.line).toBeGreaterThan(0);
        expect(result.error?.column).toBeGreaterThan(0);
    });
});
