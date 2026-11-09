/**
 * CR-123 — ChatActivity: the work of an agent in a chat.
 */
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { I18nProvider } from '../../../src/I18n';
import { it as itDict } from '../../../src/conf/i18n';
import ChatActivity, { type ChatActivityItem } from '../../../src/components/widgets/chat/ChatActivity';

function renderIn(ui: React.ReactElement, locale: 'en' | 'it' = 'en') {
    return render(<I18nProvider config={{ locale, translations: { it: itDict } }}>{ui}</I18nProvider>);
}

const items: ChatActivityItem[] = [
    { type: 'steps', icon: 'search', label: 'Explores the repository', count: 3, detail: ['git status', 'ls'], lines: ['git status --short', 'ls functions'] },
    { type: 'steps', icon: 'brain', label: 'Searches the memory', detail: ['Servizio vs Settore'], failed: 1, lines: ['memory search "Servizio vs Settore"'] },
    { type: 'text', text: 'I read the **CR**.' },
    { type: 'end', ok: true, text: 'success · 9 steps' },
];

describe('ChatActivity', () => {
    it('AC1: one row a group, with its label, count and details; its lines open and close with its button', () => {
        renderIn(<ChatActivity items={items} />);
        expect(screen.getByText('Explores the repository')).toBeInTheDocument();
        expect(screen.getByText('3 steps')).toBeInTheDocument();
        expect(screen.getByText('git status, ls')).toBeInTheDocument();
        expect(screen.getByText('1 failed')).toBeInTheDocument();
        expect(screen.queryByText(/git status --short/)).not.toBeInTheDocument();
        const [first] = screen.getAllByRole('button', { name: /Commands/ });
        expect(first).toHaveAttribute('aria-expanded', 'false');
        fireEvent.click(first!);
        expect(first).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByText(/git status --short/)).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /Hide/ }));
        expect(screen.queryByText(/git status --short/)).not.toBeInTheDocument();
    });

    it('AC2: the words of the agent as Markdown, and how it ended', () => {
        renderIn(<ChatActivity items={items} />);
        expect(screen.getByText('CR').tagName).toBe('STRONG');
        expect(screen.getByText('success · 9 steps')).toBeInTheDocument();
    });

    it('AC3: the files changed with their changes on request, and the whole log one click away', () => {
        const onShowChanges = vi.fn();
        renderIn(<ChatActivity items={items} files={['functions/src/a.js', 'test/a.test.mjs']} onShowChanges={onShowChanges} log={['⚙ Bash git status', 'raw line']} />);
        expect(screen.getByText('2 files changed')).toBeInTheDocument();
        expect(screen.getByText('functions/src/a.js')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /See the changes/ }));
        expect(onShowChanges).toHaveBeenCalledOnce();
        fireEvent.click(screen.getByRole('button', { name: /Whole log/ }));
        expect(screen.getByText(/raw line/)).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /Steps view/ }));
        expect(screen.getByText('Explores the repository')).toBeInTheDocument();
    });

    it('AC4: its texts from the dictionary', () => {
        renderIn(<ChatActivity items={[]} files={['a.js']} />, 'it');
        expect(screen.getByText('Ancora niente')).toBeInTheDocument();
        expect(screen.getByText('1 file modificati')).toBeInTheDocument();
    });
});
