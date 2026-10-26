/**
 * CR-097 — guard against new hard-coded visible texts.
 *
 * Scans the components whose visible texts go through `useI18n` and fails when one of them gets a
 * new literal that a user would read: a JSX text node, a string literal in JSX (`{'...'}` or in a
 * `? :` / `&&` branch) or a literal `title` / `aria-label` / `ariaLabel` / `placeholder` / `alt` /
 * `label`. A literal that is not a sentence (a URL, a unit, a brand) goes in the allowlist below.
 * Line-based on purpose: fast, deterministic, no TypeScript compiler needed.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(__dirname, '../../src/components');

/** File (relative to src/components) → literals allowed there because they are not translatable text. */
const GUARDED: Record<string, string[]> = {
    'blocks/Notifications.tsx': [],
    'ErrorBoundary.tsx': ['URL', 'DEV'],
    'blocks/ThemeSwitcher.tsx': ['rem'],
    'ui/fields/ImageField.tsx': ['https://example.com/image.jpg'],
    'ui/fields/RichText.tsx': ['https://example.com/image.jpg', 'https://...'],
    'ui/fields/Upload.tsx': ['preview-'],
    'widgets/TabDynamic.tsx': [],
    'ui/TabDynamic.tsx': [],
    'widgets/grid-core/GridCore.tsx': [],
    'widgets/Chatbot.tsx': ['KB'],
    'blocks/Breadcrumbs.tsx': [],
    'blocks/SideNav.tsx': [],
    // CR-109
    'widgets/chat/ChatMarkdown.tsx': [],
    'widgets/chat/ChatReasoning.tsx': [],
    'widgets/chat/ChatQuestions.tsx': [],
};

/** A literal is text a user reads when it has a word of two letters or more. */
const isText = (value: string) => /\p{L}{2,}/u.test(value);

const WORDS = "[\\p{L} ,.'’!?…-]";

const PATTERNS: { kind: string; re: RegExp; template?: boolean }[] = [
    // >Some text<   (text node on one line)
    { kind: 'jsx text', re: />\s*([^<>{}\n`]*\p{L}{2,}[^<>{}\n`]*?)\s*</gu },
    // {count} words</span>   (text after an expression, before a closing tag)
    { kind: 'jsx text', re: /\}([^<>{}\n`=;]*\p{L}{2,}[^<>{}\n`=;]*?)\s*<\//gu },
    // Some text <span> / Some text{' '}   (words at the start of a line, before a tag or an expression)
    { kind: 'jsx text', re: new RegExp(`^\\s*(\\p{Lu}${WORDS}*\\s${WORDS}*\\p{L})\\s*(?:<|\\{)`, 'gu') },
    // {"Some text"} / {'Some text'}
    { kind: 'jsx string', re: /\{\s*(["'])((?:(?!\1).)*\p{L}{2,}(?:(?!\1).)*)\1\s*\}/gu },
    // cond ? 'Text' : 'Other' / cond && 'Text'   (capitalised literals only)
    { kind: 'jsx branch', re: /(?:(?<![?.])\?(?![?.])|&&)\s*(["'])(\p{Lu}[^"'\n]*\p{Ll}[^"'\n]*)\1/gu },
    { kind: 'jsx branch', re: /(?<![?.])\?(?![?.])[^:\n]*:\s*(["'])(\p{Lu}[^"'\n]*\p{Ll}[^"'\n]*)\1/gu },
    // title="..." aria-label="..." ariaLabel="..." placeholder="..." alt="..." label="..."
    { kind: 'attribute', re: /\b(?:title|aria-label|ariaLabel|placeholder|alt|label)=(["'])([^"'\n]*)\1/g },
    // title={`Crop — ${name}`}   (template literal with words)
    { kind: 'attribute', re: /\b(?:title|aria-label|ariaLabel|placeholder|alt|label)=\{`([^`\n]*)`\}/g, template: true },
    // { title: 'Columns' } in trigger objects
    { kind: 'trigger title', re: /\btrigger=\{\{[^}]*\btitle:\s*(["'])([^"'\n]*)\1/g },
];

/** Removes comments and keeps line numbers. */
function stripComments(source: string): string {
    return source
        .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
        .replace(/(^|[^:"'`])\/\/.*$/gm, (_m, p1: string) => p1);
}

/** A line that is only words inside JSX, e.g. a text node on its own line. */
const BARE_TEXT_LINE = new RegExp(`^\\s*(\\p{Lu}${WORDS}*\\p{Ll}[.!?…]?)\\s*$`, 'u');

export function findHardcodedTexts(source: string, allow: string[]): string[] {
    const hits: string[] = [];
    const lines = stripComments(source).split('\n');
    lines.forEach((line, index) => {
        const found = new Set<string>();
        for (const { kind, re, template } of PATTERNS) {
            re.lastIndex = 0;
            for (const match of line.matchAll(re)) {
                let value = (match[match.length - 1] ?? '').trim();
                // template literal: keep the words outside ${...}
                if (template) value = value.replace(/\$\{[^}]*\}/g, '').trim();
                if (!value || !isText(value) || allow.includes(value)) continue;
                // arrow functions, comparisons and generics, not a tag
                if (kind === 'jsx text' && (/=>|>=|&&|[;=|]/.test(value) || /\(\w+:/.test(value))) continue;
                found.add(`line ${index + 1} ${kind}: ${value}`);
            }
        }
        const bare = line.match(BARE_TEXT_LINE);
        if (bare && !allow.includes(bare[1].trim())) found.add(`line ${index + 1} jsx text: ${bare[1].trim()}`);
        hits.push(...found);
    });
    return hits;
}

describe('CR-097 — no hard-coded visible texts in translated components', () => {
    for (const [file, allow] of Object.entries(GUARDED)) {
        it(`${file} reads its visible texts from the dictionary`, () => {
            const source = readFileSync(resolve(ROOT, file), 'utf8');
            expect(findHardcodedTexts(source, allow)).toEqual([]);
        });
    }

    it('catches hard-coded text nodes, attributes and branch literals', () => {
        const sample = [
            '<p>No notifications</p>',
            '<button title="Add tab" />',
            "{copied ? 'Copied!' : 'Copy debug info'}",
            '    Try again',
            '<span>{count} words</span>',
            '<span>{dict.title}</span>',
            '<nav aria-label={dict.label} />',
            "const g = item.group ?? 'General';",
        ].join('\n');
        expect(findHardcodedTexts(sample, [])).toEqual([
            'line 1 jsx text: No notifications',
            'line 2 attribute: Add tab',
            'line 3 jsx branch: Copied!',
            'line 3 jsx branch: Copy debug info',
            'line 4 jsx text: Try again',
            'line 5 jsx text: words',
        ]);
    });
});
