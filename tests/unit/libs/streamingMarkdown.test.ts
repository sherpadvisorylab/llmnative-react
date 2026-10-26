import { describe, expect, it } from 'vitest';
import { repairStreamingMarkdown as repair } from '../../../src/libs/streamingMarkdown';

describe('CR-109 — repairStreamingMarkdown', () => {
    it('leaves complete Markdown as it is', () => {
        const text = '# Title\n\nSome **bold** and `code`.\n\n| a | b |\n| --- | --- |\n| 1 | 2 |\n\n```ts\nconst a = 1;\n```';
        expect(repair(text)).toBe(text);
        expect(repair('')).toBe('');
    });

    it('closes a code fence still open', () => {
        expect(repair('Text\n\n```ts\nconst a = 1;')).toBe('Text\n\n```ts\nconst a = 1;\n```');
        expect(repair('~~~\nx')).toBe('~~~\nx\n~~~');
        // a closing fence still being typed
        expect(repair('```\nx\n``')).toBe('```\nx\n```');
    });

    it('does not repair inside a fence', () => {
        expect(repair('```md\n**not bold')).toBe('```md\n**not bold\n```');
    });

    it('drops a fence being opened on the last line', () => {
        expect(repair('Text\n\n`')).toBe('Text');
        expect(repair('Text\n\n``')).toBe('Text');
    });

    it('completes a table whose header or delimiter row is arriving', () => {
        expect(repair('| Name | Role |')).toBe('| Name | Role |\n| --- | --- |');
        expect(repair('| Name | Ro')).toBe('| Name | Ro |\n| --- | --- |');
        expect(repair('| Name | Role |\n| --')).toBe('| Name | Role |\n| --- | --- |');
        expect(repair('| Name | Role |\n| --- | --- |\n| Ada | Eng')).toBe('| Name | Role |\n| --- | --- |\n| Ada | Eng');
        expect(repair('Intro\n\n|')).toBe('Intro\n');
    });

    it('keeps the alignment of a complete delimiter row', () => {
        const text = '| a | b |\n| :-- | --: |\n| 1';
        expect(repair(text)).toBe(text);
    });

    it('closes emphasis, strike and inline code left open', () => {
        expect(repair('Some **bold')).toBe('Some **bold**');
        expect(repair('Some *it')).toBe('Some *it*');
        expect(repair('Some ~~old')).toBe('Some ~~old~~');
        expect(repair('Run `npm i')).toBe('Run `npm i`');
        expect(repair('Some ***both')).toBe('Some ***both***');
        expect(repair('**a *b')).toBe('**a *b***');
    });

    it('drops a marker with nothing after it yet', () => {
        expect(repair('Some **')).toBe('Some');
        expect(repair('Some `')).toBe('Some');
        expect(repair('Done. *')).toBe('Done.');
    });

    it('does not take list bullets, snake_case or spaced stars for emphasis', () => {
        expect(repair('* item one')).toBe('* item one');
        expect(repair('- use snake_case names')).toBe('- use snake_case names');
        expect(repair('2 * 3 = 6')).toBe('2 * 3 = 6');
    });

    it('closes a link destination', () => {
        expect(repair('See [the docs](https://example.com/do')).toBe('See [the docs](https://example.com/do)');
    });

    it('holds back a setext underline that is still a single dash', () => {
        expect(repair('Title\n-')).toBe('Title');
        expect(repair('Title\n---')).toBe('Title\n---');
    });

    it('repairs only the last block', () => {
        expect(repair('Literal * star\n\nNow **bo')).toBe('Literal * star\n\nNow **bo**');
    });
});
