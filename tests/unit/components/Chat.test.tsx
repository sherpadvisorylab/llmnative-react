/**
 * CR-109 — ChatMarkdown, ChatReasoning, ChatQuestions.
 */
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { I18nProvider } from '../../../src/I18n';
import { it as itDict } from '../../../src/conf/i18n';
import ChatMarkdown from '../../../src/components/widgets/chat/ChatMarkdown';
import ChatReasoning from '../../../src/components/widgets/chat/ChatReasoning';
import ChatQuestions, { type ChatQuestion } from '../../../src/components/widgets/chat/ChatQuestions';

function renderIn(ui: React.ReactElement, locale: 'en' | 'it' = 'en') {
    return render(<I18nProvider config={{ locale, translations: { it: itDict } }}>{ui}</I18nProvider>);
}

describe('ChatMarkdown', () => {
    it('renders GFM: headings, lists, tables, blockquotes, task lists and strikethrough', () => {
        const { container } = renderIn(
            <ChatMarkdown content={'## Plan\n\n- one\n- [x] done\n\n> note\n\n| Name | Role |\n| --- | --- |\n| Ada | Eng |\n\n~~old~~'} />,
        );
        expect(screen.getByRole('heading', { level: 2, name: 'Plan' })).toBeInTheDocument();
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Role' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: 'Ada' })).toBeInTheDocument();
        expect(container.querySelector('blockquote')).toHaveTextContent('note');
        expect(container.querySelector('del')).toHaveTextContent('old');
        expect(container.querySelector('input[type="checkbox"]')).toBeChecked();
    });

    it('puts a table in its own horizontal scroll box', () => {
        renderIn(<ChatMarkdown content={'| a | b |\n| --- | --- |\n| 1 | 2 |'} />);
        expect(screen.getByRole('table').parentElement).toHaveClass('overflow-x-auto');
    });

    it('renders a table whose rows are still arriving when streaming', () => {
        const { rerender } = renderIn(<ChatMarkdown streaming content={'| Name | Role |'} />);
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.queryByText('| Name | Role |')).not.toBeInTheDocument();
        rerender(<I18nProvider config={{ locale: 'en' }}><ChatMarkdown streaming content={'| Name | Role |\n| --- | --- |\n| Ada | En'} /></I18nProvider>);
        expect(screen.getByRole('cell', { name: 'En' })).toBeInTheDocument();
    });

    it('keeps an unclosed code fence and emphasis in place while streaming, and shows text as written when done', () => {
        const { container, rerender } = renderIn(<ChatMarkdown streaming content={'Intro\n\n```ts\nconst a = 1;'} />);
        expect(container.querySelector('pre code')).toHaveTextContent('const a = 1;');
        expect(container).toHaveTextContent('Intro');
        rerender(<I18nProvider config={{ locale: 'en' }}><ChatMarkdown streaming content={'Some **bold'} /></I18nProvider>);
        expect(container.querySelector('strong')).toHaveTextContent('bold');
        rerender(<I18nProvider config={{ locale: 'en' }}><ChatMarkdown content={'2 * 3 and a lone *'} /></I18nProvider>);
        expect(container).toHaveTextContent('2 * 3 and a lone *');
    });

    it('renders code with its language, highlighting and a copy button', async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
        const { container } = renderIn(<ChatMarkdown content={'```js\nconst a = 1;\n```'} />);
        expect(screen.getByText('js')).toBeInTheDocument();
        await waitFor(() => expect(container.querySelector('pre code .token.keyword')).toHaveTextContent('const'));
        fireEvent.click(screen.getByRole('button', { name: 'Copy code' }));
        expect(writeText).toHaveBeenCalledWith('const a = 1;');
        await screen.findByRole('button', { name: 'Copied' });
    });

    it('opens addresses in a new tab, drops javascript: links and raw HTML', () => {
        const { container } = renderIn(
            <ChatMarkdown content={'[docs](https://example.com) [bad](javascript:alert(1)) <script>alert(1)</script><b>x</b>'} />,
        );
        const docs = screen.getByRole('link', { name: 'docs' });
        expect(docs).toHaveAttribute('target', '_blank');
        expect(docs).toHaveAttribute('rel', 'noopener noreferrer');
        expect(container.querySelector('script')).toBeNull();
        expect(container.querySelector('b')).toBeNull();
        const bad = Array.from(container.querySelectorAll('a')).find((a) => a.textContent === 'bad');
        expect(bad?.getAttribute('href') ?? '').not.toContain('javascript');
    });

    it('hands links to routes of the app to onLinkClick', () => {
        const onLinkClick = vi.fn();
        renderIn(<ChatMarkdown content={'[page](/projects/crm)'} onLinkClick={onLinkClick} />);
        fireEvent.click(screen.getByRole('link', { name: 'page' }));
        expect(onLinkClick).toHaveBeenCalledWith('/projects/crm', expect.anything());
    });
});

describe('ChatReasoning', () => {
    it('is closed by default behind a summary with the duration', () => {
        renderIn(<ChatReasoning content="Thinking about **it**" duration={12} />);
        const trigger = screen.getByRole('button', { name: 'Reasoned for 12 s' });
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByText('it')).not.toBeInTheDocument();
        fireEvent.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByText('it').tagName).toBe('STRONG');
    });

    it('is open while streaming and closes when it ends', () => {
        const { rerender } = renderIn(<ChatReasoning content="Step one" streaming />);
        expect(screen.getByRole('button', { name: 'Reasoning…' })).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByText('Step one')).toBeInTheDocument();
        rerender(<I18nProvider config={{ locale: 'en' }}><ChatReasoning content="Step one" /></I18nProvider>);
        expect(screen.getByRole('button', { name: 'Reasoning' })).toHaveAttribute('aria-expanded', 'false');
    });

    it('says the duration in the active language, minutes included', () => {
        renderIn(<ChatReasoning content="x" duration={75} />, 'it');
        expect(screen.getByRole('button', { name: 'Ha ragionato per 1 min 15 s' })).toBeInTheDocument();
    });

    it('can be controlled', () => {
        const onOpenChange = vi.fn();
        renderIn(<ChatReasoning content="x" open={false} onOpenChange={onOpenChange} />);
        fireEvent.click(screen.getByRole('button', { name: 'Reasoning' }));
        expect(onOpenChange).toHaveBeenCalledWith(true);
        expect(screen.getByRole('button', { name: 'Reasoning' })).toHaveAttribute('aria-expanded', 'false');
    });
});

const QUESTIONS: ChatQuestion[] = [
    {
        id: 'db',
        header: 'Database',
        question: 'Which database?',
        options: [{ label: 'Postgres', description: 'Relational' }, { label: 'SQLite' }],
        recommended: 0,
    },
    {
        id: 'features',
        header: 'Features',
        question: 'Which features?',
        options: [{ label: 'Auth' }, { label: 'Search' }, { label: 'Export' }],
        multiple: true,
    },
];

describe('ChatQuestions', () => {
    it('shows one tab per question plus the review, numbered choices and the recommended one', () => {
        renderIn(<ChatQuestions questions={QUESTIONS} />);
        const tabs = screen.getAllByRole('tab');
        expect(tabs.map((tab) => tab.textContent)).toEqual(['Database', 'Features', 'Review']);
        expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
        const group = screen.getByRole('radiogroup', { name: 'Which database?' });
        const radios = within(group).getAllByRole('radio');
        expect(radios).toHaveLength(3); // two options + Other
        expect(radios[0]).toHaveTextContent('1PostgresRelationalRecommended');
        expect(radios[2]).toHaveTextContent('3Other');
        expect(screen.getByText('Keys 1–3 choose, Enter continues')).toBeInTheDocument();
    });

    it('picks by click, by number key, multiple, and submits all answers from the review', async () => {
        const onSubmit = vi.fn();
        renderIn(<ChatQuestions questions={QUESTIONS} onSubmit={onSubmit} />);
        // single choice: a click picks and moves on
        fireEvent.click(screen.getByRole('radio', { name: /SQLite/ }));
        expect(screen.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true');
        // multiple: number keys toggle
        const group = screen.getByRole('group', { name: 'Which features?' });
        fireEvent.keyDown(group, { key: '1' });
        fireEvent.keyDown(group, { key: '3' });
        fireEvent.keyDown(group, { key: '3' });
        fireEvent.keyDown(group, { key: '2' });
        expect(screen.getByRole('checkbox', { name: /Auth/ })).toHaveAttribute('aria-checked', 'true');
        expect(screen.getByRole('checkbox', { name: /Export/ })).toHaveAttribute('aria-checked', 'false');
        // Enter moves to the review
        fireEvent.keyDown(group, { key: 'Enter' });
        expect(screen.getByRole('tab', { name: 'Review' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByText('Auth, Search')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
        await waitFor(() => expect(onSubmit).toHaveBeenCalledWith([
            { id: 'db', header: 'Database', values: ['SQLite'] },
            { id: 'features', header: 'Features', values: ['Auth', 'Search'] },
        ]));
        // then it shows what was answered
        expect(await screen.findByRole('group', { name: 'Answered' })).toHaveTextContent('SQLite');
    });

    it('moves between tabs with the arrows and keeps Submit off until everything is answered', () => {
        renderIn(<ChatQuestions questions={QUESTIONS} />);
        const first = screen.getAllByRole('tab')[0];
        first.focus();
        fireEvent.keyDown(first, { key: 'ArrowRight' });
        expect(screen.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true');
        expect(screen.getAllByRole('tab')[1]).toHaveFocus();
        fireEvent.keyDown(screen.getAllByRole('tab')[1], { key: 'ArrowRight' });
        expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
        expect(screen.getAllByText('No answer')).toHaveLength(2);
        fireEvent.keyDown(screen.getAllByRole('tab')[2], { key: 'ArrowLeft' });
        expect(screen.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('Enter on a focused choice continues instead of toggling it', () => {
        renderIn(<ChatQuestions questions={QUESTIONS} />);
        fireEvent.click(screen.getByRole('radio', { name: /Postgres/ }));
        const auth = screen.getByRole('checkbox', { name: /Auth/ });
        fireEvent.click(auth);
        auth.focus();
        fireEvent.keyDown(auth, { key: 'Enter' });
        expect(screen.getByRole('tab', { name: 'Review' })).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByText('Auth')).toBeInTheDocument();
    });

    it('Enter on a single choice picks it, and Enter again sends', () => {
        const onSubmit = vi.fn();
        renderIn(<ChatQuestions questions={[QUESTIONS[0]]} onSubmit={onSubmit} />);
        const sqlite = screen.getByRole('radio', { name: /SQLite/ });
        sqlite.focus();
        fireEvent.keyDown(sqlite, { key: 'Enter' });
        expect(sqlite).toHaveAttribute('aria-checked', 'true');
        expect(onSubmit).not.toHaveBeenCalled();
        fireEvent.keyDown(sqlite, { key: 'Enter' });
        expect(onSubmit).toHaveBeenCalledWith([{ id: 'db', header: 'Database', values: ['SQLite'] }]);
    });

    it('moves the focus between choices with the up and down arrows', () => {
        renderIn(<ChatQuestions questions={[QUESTIONS[0]]} autoFocus />);
        const radios = screen.getAllByRole('radio');
        expect(radios[0]).toHaveFocus();
        fireEvent.keyDown(radios[0], { key: 'ArrowDown' });
        expect(radios[1]).toHaveFocus();
        fireEvent.keyDown(radios[1], { key: 'ArrowUp' });
        expect(radios[0]).toHaveFocus();
    });

    it('takes a free-text "Other" answer and sends it with Enter', async () => {
        const onSubmit = vi.fn();
        renderIn(<ChatQuestions questions={[QUESTIONS[0]]} onSubmit={onSubmit} />);
        expect(screen.queryAllByRole('tab')).toHaveLength(0);
        fireEvent.keyDown(screen.getByRole('radiogroup'), { key: '3' });
        const input = screen.getByRole('textbox', { name: 'Other' });
        await waitFor(() => expect(input).toHaveFocus());
        fireEvent.change(input, { target: { value: 'MariaDB' } });
        fireEvent.keyDown(input, { key: 'Enter' });
        await waitFor(() => expect(onSubmit).toHaveBeenCalledWith([{ id: 'db', header: 'Database', values: ['MariaDB'] }]));
    });

    it('takes a free-text answer when a question has no options', () => {
        const onSubmit = vi.fn();
        renderIn(<ChatQuestions questions={[{ question: 'Project name?' }]} onSubmit={onSubmit} />);
        fireEvent.change(screen.getByRole('textbox', { name: 'Project name?' }), { target: { value: 'crm' } });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
        expect(onSubmit).toHaveBeenCalledWith([{ values: ['crm'] }]);
    });

    it('numbers A-B-C as the model wrote them, and picks with letters', () => {
        const onSubmit = vi.fn();
        renderIn(
            <ChatQuestions
                onSubmit={onSubmit}
                questions={[{ question: 'Pick', options: [{ label: 'A) Fast' }, { label: 'B) Safe (Recommended)' }] }]}
            />,
        );
        const radios = screen.getAllByRole('radio');
        expect(radios[0]).toHaveTextContent('AFast');
        expect(radios[1]).toHaveTextContent('BSafeRecommended');
        expect(radios[2]).toHaveTextContent('COther');
        fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'b' });
        expect(radios[1]).toHaveAttribute('aria-checked', 'true');
        fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'Enter' });
        expect(onSubmit).toHaveBeenCalledWith([{ values: ['Safe'] }]);
    });

    it('can number with letters on request and hide "Other"', () => {
        renderIn(<ChatQuestions numbering="alpha" allowOther={false} questions={[{ question: 'Pick', options: [{ label: 'One' }, { label: 'Two' }] }]} />);
        expect(screen.getAllByRole('radio').map((radio) => radio.textContent)).toEqual(['AOne', 'BTwo']);
    });

    it('shows a set already answered, read-only', () => {
        renderIn(
            <ChatQuestions
                questions={QUESTIONS}
                answers={[{ id: 'features', values: ['Auth'] }, { id: 'db', values: ['Postgres'] }]}
            />,
            'it',
        );
        const answered = screen.getByRole('group', { name: 'Risposte date' });
        expect(within(answered).getByText('Postgres')).toBeInTheDocument();
        expect(within(answered).getByText('Auth')).toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('does not change or send when disabled', () => {
        const onSubmit = vi.fn();
        renderIn(<ChatQuestions questions={[QUESTIONS[0]]} disabled onSubmit={onSubmit} />);
        const radios = screen.getAllByRole('radio');
        expect(radios[0]).toBeDisabled();
        fireEvent.keyDown(screen.getByRole('radiogroup'), { key: '1' });
        expect(radios[0]).toHaveAttribute('aria-checked', 'false');
        expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    it('keeps the form when onSubmit rejects', async () => {
        const onSubmit = vi.fn().mockRejectedValue(new Error('offline'));
        renderIn(<ChatQuestions questions={[QUESTIONS[0]]} onSubmit={onSubmit} />);
        fireEvent.click(screen.getAllByRole('radio')[0]);
        await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Submit' })); });
        expect(onSubmit).toHaveBeenCalled();
        expect(screen.getByRole('radiogroup')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
    });

    it('speaks the active language', () => {
        renderIn(<ChatQuestions questions={QUESTIONS} />, 'it');
        expect(screen.getByRole('tab', { name: 'Riepilogo' })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: /Altro/ })).toBeInTheDocument();
        expect(screen.getByText('Consigliata')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Avanti' })).toBeDisabled();
    });
});
