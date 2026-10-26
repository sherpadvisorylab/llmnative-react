/**
 * CR-109 — Markdown that is still arriving.
 *
 * A model streams Markdown a few characters at a time, so the text on screen is often cut in the
 * middle of a construct: a code fence not yet closed, a table with only its header, `**bold` without
 * its closing marks, a link without `)`. Rendered as is, the rest of the message turns into code, the
 * table shows as a line of pipes until its delimiter row arrives, and markers flash as text.
 *
 * `repairStreamingMarkdown` closes what the tail of the text left open, so each partial text renders
 * as close as possible to its final form. It only looks at the end of the text, never changes what is
 * already complete, and is meant for text that is still streaming: a finished message is rendered
 * as written.
 */

const FENCE = /^ {0,3}(`{3,}|~{3,})(.*)$/;
const PARTIAL_FENCE = /^ {0,3}(`{1,2}|~{1,2})$/;
const SETEXT_START = /^\s*[-=]{1,2}\s*$/;
const DELIMITER_CHARS = /^\s*\|?[\s:|-]*$/;
const COMPLETE_DELIMITER_CELL = /^\s*:?-+:?\s*$/;

/** Cells of a table row: `| a | b |` → `['a', 'b']` (a row being typed may miss its last pipe). */
function tableCells(row: string): string[] {
    let inner = row.trim();
    if (inner.startsWith('|')) inner = inner.slice(1);
    if (inner.endsWith('|') && !inner.endsWith('\\|')) inner = inner.slice(0, -1);
    return inner.split(/(?<!\\)\|/);
}

/** Completes a table whose header or delimiter row is still arriving. */
function repairTable(block: string[]): string[] | null {
    const header = block[0];
    if (!header.trimStart().startsWith('|')) return null;
    const cells = tableCells(header).filter((cell, i, all) => cell.trim() !== '' || i < all.length - 1);
    if (cells.length === 0) return [];
    const delimiter = `| ${cells.map(() => '---').join(' | ')} |`;
    const closedHeader = header.trimEnd().endsWith('|') ? header : `${header.trimEnd()} |`;
    if (block.length === 1) return [closedHeader, delimiter];
    const second = block[1];
    if (!DELIMITER_CHARS.test(second)) return null; // not a table: a paragraph that starts with a pipe
    const secondCells = tableCells(second);
    const complete = secondCells.length === cells.length && secondCells.every((cell) => COMPLETE_DELIMITER_CELL.test(cell));
    return complete ? block : [closedHeader, delimiter, ...block.slice(2)];
}

type Marker = { token: string; at: number };

/** Opens or closes the inline markers of one line; returns the line with what is left open closed. */
function repairInline(line: string): string {
    // An unclosed link destination: `[label](https://ex` → `[label](https://ex)`.
    let text = line;
    const linkStart = text.lastIndexOf('](');
    if (linkStart >= 0 && !text.slice(linkStart).includes(')')) text += ')';

    const stack: Marker[] = [];
    let code: Marker | null = null;
    const bullet = /^\s*[*+-]\s/.exec(text);
    let i = bullet ? bullet[0].length : 0;
    while (i < text.length) {
        const ch = text[i];
        if (ch === '\\') { i += 2; continue; }
        if (ch === '`') {
            let run = 1;
            while (text[i + run] === '`') run++;
            const token = '`'.repeat(run);
            if (!code) code = { token, at: i };
            else if (code.token === token) code = null;
            i += run;
            continue;
        }
        if (code) { i++; continue; }
        if (ch === '*' || ch === '_' || ch === '~') {
            let run = 1;
            while (text[i + run] === ch) run++;
            const prev = text[i - 1] ?? ' ';
            const next = text[i + run] ?? '';
            // `snake_case` and `2 * 3` are not emphasis.
            const intraword = ch === '_' && /[\p{L}\p{N}]/u.test(prev) && /[\p{L}\p{N}]/u.test(next);
            const spaced = /\s/.test(prev) && (next === '' ? false : /\s/.test(next));
            if (!intraword && !spaced && !(ch === '~' && run === 1)) {
                // `***` opens `**` then `*`, and closes them the other way round.
                const closingSingle = stack[stack.length - 1]?.token === ch;
                const tokens = ch === '~' ? ['~~'] : run >= 3 ? (closingSingle ? [ch, ch + ch] : [ch + ch, ch]) : [ch.repeat(run)];
                for (const token of tokens) {
                    const top = stack[stack.length - 1];
                    if (top && top.token === token) stack.pop();
                    else if (stack.some((m) => m.token === token)) {
                        // closes an outer marker: the inner ones were not emphasis after all
                        while (stack.length && stack[stack.length - 1].token !== token) stack.pop();
                        stack.pop();
                    } else stack.push({ token, at: i });
                }
            }
            i += run;
            continue;
        }
        i++;
    }

    if (code) {
        // `npm ` keeps its code span; a lone backtick at the end goes away.
        if (text.slice(code.at + code.token.length).trim() === '') return text.slice(0, code.at).trimEnd();
        text += code.token;
    }
    if (stack.length === 0) return text;
    const first = stack[0];
    const after = text.slice(first.at).replace(/[*_~\s]/g, '');
    if (after === '') return text.slice(0, first.at).trimEnd();
    for (let k = stack.length - 1; k >= 0; k--) {
        const marker = stack[k];
        if (text.slice(marker.at + marker.token.length).replace(/[*_~]/g, '').trim() === '') {
            text = text.slice(0, marker.at).trimEnd();
            continue;
        }
        text = text.trimEnd() + marker.token;
    }
    return text;
}

/** Closes the constructs the end of a streaming Markdown text left open (see the module comment). */
export function repairStreamingMarkdown(text: string): string {
    if (!text) return text;
    const lines = text.split('\n');

    // 1. A code fence still open: close it, after dropping a closing fence still being typed.
    let fence: { char: string; len: number } | null = null;
    let afterFences = 0;
    lines.forEach((line, index) => {
        const match = FENCE.exec(line);
        if (!fence) {
            if (match && !(match[1][0] === '`' && match[2].includes('`'))) fence = { char: match[1][0], len: match[1].length };
        } else if (match && match[1][0] === fence.char && match[1].length >= fence.len && match[2].trim() === '') {
            fence = null;
            afterFences = index + 1;
        }
    });
    if (fence) {
        const open = fence as { char: string; len: number };
        const body = PARTIAL_FENCE.test(lines[lines.length - 1]) && lines.length > 1 ? lines.slice(0, -1) : lines;
        return `${body.join('\n')}\n${open.char.repeat(open.len)}`;
    }

    // 2. The last block (after the last blank line outside fences) is the one still arriving.
    let start = afterFences;
    for (let i = lines.length - 1; i >= afterFences; i--) {
        if (lines[i].trim() === '') { start = i + 1; break; }
    }
    const head = lines.slice(0, start);
    let block = lines.slice(start);
    if (block.length === 0) return text;

    // A fence being opened on the last line (` or ``): not text yet.
    if (PARTIAL_FENCE.test(block[block.length - 1])) block = block.slice(0, -1);
    // `Title` + `-` or `=` under it: a setext heading or a list item in the making, not yet either.
    if (block.length >= 2 && SETEXT_START.test(block[block.length - 1])) block = block.slice(0, -1);
    if (block.length === 0) return head.join('\n').replace(/\n+$/, '');

    const last = block.length - 1;
    block[last] = repairInline(block[last]);

    const table = repairTable(block);
    if (table) block = table;

    return [...head, ...block].join('\n');
}
