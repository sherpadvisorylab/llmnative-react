import React from 'react';

/**
 * The plain text of a label that may be a React node (`FieldLabel`): the strings and numbers it
 * contains, in order, with whitespace collapsed. Used where a label must be text, such as the
 * "required" message of a form or an `aria-label`.
 *
 * ```ts
 * labelText(<>Skill <InfoButton /></>) // "Skill"
 * ```
 */
export function labelText(node: React.ReactNode): string {
    const parts: string[] = [];
    const visit = (value: React.ReactNode): void => {
        if (value === null || value === undefined || typeof value === 'boolean') return;
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint') {
            parts.push(String(value));
            return;
        }
        if (Array.isArray(value)) {
            value.forEach(visit);
            return;
        }
        if (React.isValidElement<{ children?: React.ReactNode }>(value)) visit(value.props.children);
    };
    visit(node);
    return parts.join(' ').replace(/\s+/g, ' ').trim();
}
