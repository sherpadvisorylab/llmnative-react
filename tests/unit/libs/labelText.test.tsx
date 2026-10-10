import { describe, it, expect } from 'vitest';
import React from 'react';
import { labelText } from '../../../src/libs/labelText';

describe('labelText', () => {
    it('returns a string label as it is', () => {
        expect(labelText('Title')).toBe('Title');
    });

    it('collects the text of a node, leaving out what has none', () => {
        const label = (
            <>
                Skill <span>of the <strong>agent</strong></span> <button type="button" aria-label="info" />
            </>
        );
        expect(labelText(label)).toBe('Skill of the agent');
    });

    it('is empty for no label or a label without text', () => {
        expect(labelText(undefined)).toBe('');
        expect(labelText(null)).toBe('');
        expect(labelText(<i />)).toBe('');
    });

    it('keeps numbers', () => {
        expect(labelText(['Step', 2])).toBe('Step 2');
    });
});
