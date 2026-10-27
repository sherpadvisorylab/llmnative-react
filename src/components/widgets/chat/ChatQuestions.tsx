import React from 'react';
import { cn } from '../../../libs/cn';
import { interpolate, useI18n, type I18nDict } from '../../../I18n';
import Icon from '../../ui/Icon';
import { fieldTextAreaBaseClass } from '../../ui/fields/Input';
import { useEditorHeight } from '../../../libs/editorHeight';

/** A choice of a question. */
export interface ChatQuestionOption {
    /** What the answer says; it is the value returned when chosen. */
    label: string;
    /** A line under the label. */
    description?: string;
}

/**
 * A question of the model, in the shape of the `question` tool of opencode and of MCP elicitation.
 */
export interface ChatQuestion {
    /** Returned with the answer, to match it to the question. */
    id?: string;
    /** Short title: the label of its tab. */
    header?: string;
    question: string;
    /** The choices. Without them the question takes a free-text answer. */
    options?: ChatQuestionOption[];
    /** More than one choice. */
    multiple?: boolean;
    /**
     * The choice the model recommends: its index (from 0) or its label. A label ending with
     * "(Recommended)" is recognised too.
     */
    recommended?: number | string;
    /** Offers "Other" with a free-text answer. Default: `allowOther` of the component. */
    custom?: boolean;
}

/** The answer to one question: the chosen labels and/or the free text. */
export interface ChatQuestionAnswer {
    id?: string;
    header?: string;
    values: string[];
}

/** How the choices are numbered: 1-2-3 or A-B-C. */
export type ChatQuestionsNumbering = 'numeric' | 'alpha';

/** Classes for the parts of a `ChatQuestions`, added to the defaults. */
export interface ChatQuestionsClassNames {
    root?: string;
    tabs?: string;
    tab?: string;
    panel?: string;
    question?: string;
    option?: string;
    /** Added to a chosen option. */
    optionSelected?: string;
    footer?: string;
    /** The answered state. */
    summary?: string;
}

export interface ChatQuestionsProps {
    questions: ChatQuestion[];
    /**
     * All the answers, in the order of the questions. May return a promise: the form waits for it and
     * shows the answered state when it resolves (it stays open when it rejects).
     */
    onSubmit?: (answers: ChatQuestionAnswer[]) => void | Promise<unknown>;
    /** Numbering of the choices. Default: as the labels are written ("A) …", "1. …"), else numeric. */
    numbering?: ChatQuestionsNumbering;
    /** "Other" with a free-text answer on every question (a question can override it with `custom`). Default `true`. */
    allowOther?: boolean;
    /** Answers already given: the component shows them, read-only, instead of the form. */
    answers?: ChatQuestionAnswer[];
    /** Shows the form without letting it change or be sent. */
    disabled?: boolean;
    /** Puts the focus on the first choice when it appears, so the number keys work at once. */
    autoFocus?: boolean;
    /** Text of the submit button. */
    submitLabel?: string;
    className?: string;
    classNames?: ChatQuestionsClassNames;
}

interface NormalOption {
    label: string;
    description?: string;
    recommended: boolean;
}

interface NormalQuestion {
    source: ChatQuestion;
    title: string;
    options: NormalOption[];
    numbering: ChatQuestionsNumbering;
    multiple: boolean;
    other: boolean;
}

const PREFIX = /^\s*(?:(\d{1,2})|([A-Za-z]))[.)]\s+(.+)$/s;
const RECOMMENDED_SUFFIX = /\s*[([]\s*(?:recommended|consigliat[ao]|empfohlen)\s*[)\]]\s*$/i;

function normalize(question: ChatQuestion, index: number, numbering: ChatQuestionsNumbering | undefined, allowOther: boolean, dict: I18nDict['chat']): NormalQuestion {
    const raw = question.options ?? [];
    const matches = raw.map((option) => PREFIX.exec(option.label));
    const prefixed = raw.length > 0 && matches.every(Boolean);
    const inferred: ChatQuestionsNumbering = prefixed && matches[0]?.[2] ? 'alpha' : 'numeric';
    const options = raw.map((option, i) => {
        let label = prefixed ? matches[i]![3].trim() : option.label;
        const suffix = RECOMMENDED_SUFFIX.exec(label);
        if (suffix) label = label.slice(0, suffix.index).trim();
        const recommended = typeof question.recommended === 'number'
            ? question.recommended === i
            : typeof question.recommended === 'string'
                ? question.recommended === label || question.recommended === option.label
                : Boolean(suffix);
        return { label, description: option.description, recommended };
    });
    return {
        source: question,
        title: question.header || interpolate(dict.questionTab, { index: index + 1 }),
        options,
        numbering: numbering ?? inferred,
        multiple: Boolean(question.multiple),
        other: options.length === 0 || (question.custom ?? allowOther),
    };
}

const markerOf = (index: number, numbering: ChatQuestionsNumbering) =>
    numbering === 'alpha' ? String.fromCharCode(65 + index) : String(index + 1);

/** Index of the choice a key picks, or -1. */
function choiceOfKey(key: string, numbering: ChatQuestionsNumbering): number {
    if (/^[1-9]$/.test(key)) return Number(key) - 1;
    if (numbering === 'alpha' && /^[a-z]$/i.test(key)) return key.toUpperCase().charCodeAt(0) - 65;
    return -1;
}

function answerOf(question: ChatQuestion, values: string[]): ChatQuestionAnswer {
    return {
        ...(question.id !== undefined ? { id: question.id } : {}),
        ...(question.header !== undefined ? { header: question.header } : {}),
        values,
    };
}

const OPTION = 'flex w-full items-start gap-2.5 rounded-md border px-2.5 py-2 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60';
/** Free-text answer: two lines to start, grows with the text up to this height, then scrolls. */
const TEXT_MIN_HEIGHT = 58;
const TEXT_MAX_HEIGHT = 160;
const BUTTON = 'inline-flex h-8 items-center justify-center gap-1 rounded-md px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50';

/**
 * CR-109 — Questions of the model the user answers with a click: one tab per question, numbered
 * choices (the recommended one stands out), single or multiple choice, "Other" with free text, a
 * review and one submit for all the answers. Keyboard: number (or letter) keys choose, arrows move
 * between tabs and choices, Enter continues. With `answers` it shows a set already answered.
 *
 * CR-110 — The free text ("Other", or a question without options) is a textarea that grows with
 * the text (two lines, then up to a height and it scrolls; resizable vertically): Enter adds a
 * line, Ctrl/Cmd+Enter continues or sends.
 */
export default function ChatQuestions({
    questions,
    onSubmit,
    numbering,
    allowOther = true,
    answers,
    disabled = false,
    autoFocus = false,
    submitLabel,
    className,
    classNames,
}: ChatQuestionsProps) {
    const dict = useI18n('chat');
    const uid = React.useId();
    const rootRef = React.useRef<HTMLDivElement>(null);
    const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
    const focusNext = React.useRef<'tab' | 'panel' | 'other' | null>(autoFocus ? 'panel' : null);
    const mounted = React.useRef(true);
    React.useEffect(() => () => { mounted.current = false; }, []);

    const normal = React.useMemo(
        () => (questions ?? []).map((question, index) => normalize(question, index, numbering, allowOther, dict)),
        [questions, numbering, allowOther, dict],
    );
    const count = normal.length;
    const hasReview = count > 1;

    const [tab, setTab] = React.useState(0);
    const [selected, setSelected] = React.useState<string[][]>([]);
    const [otherOn, setOtherOn] = React.useState<boolean[]>([]);
    const [otherText, setOtherText] = React.useState<string[]>([]);
    const [busy, setBusy] = React.useState(false);
    const [submitted, setSubmitted] = React.useState<ChatQuestionAnswer[] | null>(null);
    const [typing, setTyping] = React.useState(false);
    const textRef = React.useRef<HTMLTextAreaElement | null>(null);
    const textHeight = useEditorHeight({ minHeight: TEXT_MIN_HEIGHT, maxHeight: TEXT_MAX_HEIGHT });

    const valuesOf = (q: number): string[] => {
        const nq = normal[q];
        if (!nq) return [];
        const chosen = nq.options.filter((option) => (selected[q] ?? []).includes(option.label)).map((option) => option.label);
        const text = (otherText[q] ?? '').trim();
        const withOther = (otherOn[q] || nq.options.length === 0) && text ? [text] : [];
        return [...chosen, ...withOther];
    };
    const answered = (q: number) => valuesOf(q).length > 0;
    const allAnswered = normal.every((_nq, q) => answered(q));
    const locked = disabled || busy;

    // Focus follows the keyboard: the new tab, the choices of the new panel, or the "Other" field.
    React.useEffect(() => {
        const target = focusNext.current;
        if (!target) return;
        focusNext.current = null;
        const root = rootRef.current;
        if (!root) return;
        if (target === 'tab') { tabRefs.current[tab]?.focus(); return; }
        const panel = root.querySelector<HTMLElement>('[role="tabpanel"]');
        if (target === 'other') { panel?.querySelector<HTMLTextAreaElement>('textarea')?.focus(); return; }
        const choice = panel?.querySelector<HTMLElement>('[data-rf-option][aria-checked="true"]')
            ?? panel?.querySelector<HTMLElement>('[data-rf-option]')
            ?? panel?.querySelector<HTMLElement>('textarea')
            ?? root.querySelector<HTMLElement>('[data-rf-submit]');
        choice?.focus();
    });

    // Auto-grow of the free text — the same logic as TextArea and Chatbot (TextArea is bound to a Form).
    const currentText = otherText[tab] ?? '';
    const textShown = Boolean(normal[tab]?.other && (otherOn[tab] || normal[tab]?.options.length === 0));
    React.useEffect(() => {
        const el = textRef.current;
        if (!el) return;
        el.style.height = 'auto';
        const nextHeight = Math.max(el.scrollHeight, textHeight.resolvedMinHeight);
        const max = textHeight.resolvedMaxHeight;
        el.style.height = `${max ? Math.min(nextHeight, max) : nextHeight}px`;
        el.style.overflowY = max && nextHeight > max ? 'auto' : 'hidden';
    }, [currentText, textShown, tab, textHeight.resolvedMinHeight, textHeight.resolvedMaxHeight]);

    const go = (next: number, focus: 'tab' | 'panel' = 'panel') => {
        const last = hasReview ? count : count - 1;
        const clamped = Math.max(0, Math.min(last, next));
        focusNext.current = focus;
        setTab(clamped);
    };

    const update = <T,>(list: T[], q: number, value: T, fill: T): T[] => {
        const next = normal.map((_nq, i) => list[i] ?? fill);
        next[q] = value;
        return next;
    };

    const pick = (q: number, index: number) => {
        const nq = normal[q];
        if (!nq || locked) return;
        if (index === nq.options.length && nq.other) {
            const on = nq.multiple ? !otherOn[q] : true;
            setOtherOn((list) => update(list, q, on, false));
            if (!nq.multiple) setSelected((list) => update(list, q, [], []));
            if (on) focusNext.current = 'other';
            return;
        }
        const option = nq.options[index];
        if (!option) return;
        if (nq.multiple) {
            const current = selected[q] ?? [];
            const next = current.includes(option.label) ? current.filter((label) => label !== option.label) : [...current, option.label];
            setSelected((list) => update(list, q, next, []));
            return;
        }
        setSelected((list) => update(list, q, [option.label], []));
        setOtherOn((list) => update(list, q, false, false));
        if (hasReview) go(q + 1);
    };

    const submit = async () => {
        if (!allAnswered || locked) return;
        const result = normal.map((nq, q) => answerOf(nq.source, valuesOf(q)));
        setBusy(true);
        try {
            await onSubmit?.(result);
            if (mounted.current) setSubmitted(result);
        } catch {
            // The caller reports its own error; the answers stay here for another try.
        } finally {
            if (mounted.current) setBusy(false);
        }
    };

    /** Enter: on to the next question once this one is answered, or send from the last step. */
    const confirm = () => {
        if (tab < count) {
            if (!answered(tab)) return;
            if (hasReview) go(tab + 1);
            else void submit();
            return;
        }
        void submit();
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (locked) return;
        const target = event.target as HTMLElement;
        if (target.tagName === 'TEXTAREA') {
            // Enter adds a line; Ctrl/Cmd+Enter continues (not while an IME is composing).
            if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && !event.nativeEvent.isComposing) {
                event.preventDefault();
                confirm();
            }
            return;
        }
        if (target.tagName === 'INPUT') {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                confirm();
            }
            return;
        }
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        const rtl = Boolean(rootRef.current?.closest('[dir="rtl"]'));
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            if (!hasReview) return;
            event.preventDefault();
            const forward = (event.key === 'ArrowRight') !== rtl;
            go(tab + (forward ? 1 : -1), target.getAttribute('role') === 'tab' ? 'tab' : 'panel');
            return;
        }
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            const choices = Array.from(rootRef.current?.querySelectorAll<HTMLElement>('[role="tabpanel"] [data-rf-option]') ?? []);
            if (choices.length === 0) return;
            event.preventDefault();
            const at = choices.indexOf(target);
            const step = event.key === 'ArrowDown' ? 1 : -1;
            const next = at < 0 ? 0 : (at + step + choices.length) % choices.length;
            choices[next]?.focus();
            return;
        }
        const nq = normal[tab];
        if (nq) {
            const index = choiceOfKey(event.key, nq.numbering);
            const last = nq.options.length + (nq.other && nq.options.length > 0 ? 1 : 0);
            if (index >= 0 && index < last) {
                event.preventDefault();
                pick(tab, index);
                return;
            }
        }
        if (event.key !== 'Enter') return;
        if (target.hasAttribute('data-rf-option') && nq) {
            // Space toggles a choice; Enter continues. On a single choice Enter picks it, and
            // continues once it is the chosen one.
            event.preventDefault();
            if (!nq.multiple && target.getAttribute('aria-checked') !== 'true') target.click();
            else confirm();
            return;
        }
        if (target.tagName !== 'BUTTON') {
            event.preventDefault();
            confirm();
        }
    };

    if (count === 0) return null;

    const shown = answers ?? submitted;
    if (shown) {
        return (
            <div role="group" aria-label={dict.answered} className={cn('rf-chat-questions rounded-lg border border-border bg-card p-3 text-card-foreground', className, classNames?.root, classNames?.summary)}>
                <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Icon name="check" size={14} />
                    <span>{dict.answered}</span>
                </div>
                <dl className="space-y-2">
                    {normal.map((nq, q) => {
                        const answer = nq.source.id !== undefined ? shown.find((item) => item.id === nq.source.id) ?? shown[q] : shown[q];
                        const values = answer?.values ?? [];
                        return (
                            <div key={nq.source.id ?? q} className="min-w-0">
                                <dt className="text-xs text-muted-foreground">{nq.source.header || nq.source.question}</dt>
                                <dd className={cn('text-sm', values.length === 0 && 'italic text-muted-foreground')}>{values.length ? values.join(', ') : dict.noAnswer}</dd>
                            </div>
                        );
                    })}
                </dl>
            </div>
        );
    }

    const nq = normal[tab];
    const questionId = `${uid}-question`;
    const panelId = `${uid}-panel`;
    const choiceRole = nq?.multiple ? 'checkbox' : 'radio';
    const lastMarker = nq ? nq.options.length + (nq.other && nq.options.length > 0 ? 1 : 0) - 1 : -1;

    return (
        <div
            ref={rootRef}
            role="group"
            aria-label={dict.questions}
            aria-busy={busy || undefined}
            onKeyDown={onKeyDown}
            className={cn('rf-chat-questions min-w-0 rounded-lg border border-border bg-card text-card-foreground', className, classNames?.root)}
        >
            {hasReview && (
                <div role="tablist" aria-label={dict.questions} className={cn('flex gap-1 overflow-x-auto border-b border-border px-2 pt-2', classNames?.tabs)}>
                    {[...normal.map((item) => item.title), dict.review].map((title, i) => {
                        const active = tab === i;
                        return (
                            <button
                                key={i}
                                ref={(el) => { tabRefs.current[i] = el; }}
                                type="button"
                                role="tab"
                                id={`${uid}-tab-${i}`}
                                aria-selected={active}
                                aria-controls={panelId}
                                tabIndex={active ? 0 : -1}
                                onClick={() => go(i, 'tab')}
                                className={cn(
                                    '-mb-px inline-flex shrink-0 items-center gap-1 border-b-2 px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                    active ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground',
                                    classNames?.tab,
                                )}
                            >
                                {i < count && answered(i) && <Icon name="check" size={12} className="text-success" />}
                                <span className="max-w-[10rem] truncate">{title}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            <div
                role="tabpanel"
                id={panelId}
                aria-labelledby={hasReview ? `${uid}-tab-${tab}` : questionId}
                className={cn('p-3', classNames?.panel)}
            >
                {nq ? (
                    <>
                        <p id={questionId} className={cn('text-sm font-medium', classNames?.question)}>{nq.source.question}</p>
                        {nq.options.length > 0 && (
                            <p className="mt-0.5 text-xs text-muted-foreground">{nq.multiple ? dict.chooseMany : dict.chooseOne}</p>
                        )}
                        <div role={nq.multiple ? 'group' : 'radiogroup'} aria-labelledby={questionId} className="mt-2 flex flex-col gap-1.5">
                            {nq.options.map((option, i) => {
                                const checked = (selected[tab] ?? []).includes(option.label);
                                return (
                                    <button
                                        key={`${i}-${option.label}`}
                                        type="button"
                                        role={choiceRole}
                                        aria-checked={checked}
                                        data-rf-option=""
                                        disabled={disabled}
                                        onClick={() => pick(tab, i)}
                                        className={cn(
                                            OPTION,
                                            checked ? 'border-primary bg-primary/10' : option.recommended ? 'border-primary/40 hover:bg-accent' : 'border-border hover:bg-accent',
                                            classNames?.option,
                                            checked && classNames?.optionSelected,
                                        )}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                'flex size-5 shrink-0 items-center justify-center rounded text-[11px] font-semibold',
                                                checked ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                                            )}
                                        >
                                            {markerOf(i, nq.numbering)}
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm">{option.label}</span>
                                            {option.description && <span className="block text-xs text-muted-foreground">{option.description}</span>}
                                        </span>
                                        {option.recommended && (
                                            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{dict.recommended}</span>
                                        )}
                                    </button>
                                );
                            })}
                            {nq.other && nq.options.length > 0 && (
                                <button
                                    type="button"
                                    role={choiceRole}
                                    aria-checked={Boolean(otherOn[tab])}
                                    data-rf-option=""
                                    disabled={disabled}
                                    onClick={() => pick(tab, nq.options.length)}
                                    className={cn(
                                        OPTION,
                                        otherOn[tab] ? 'border-primary bg-primary/10' : 'border-border hover:bg-accent',
                                        classNames?.option,
                                        otherOn[tab] && classNames?.optionSelected,
                                    )}
                                >
                                    <span
                                        aria-hidden="true"
                                        className={cn(
                                            'flex size-5 shrink-0 items-center justify-center rounded text-[11px] font-semibold',
                                            otherOn[tab] ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                                        )}
                                    >
                                        {markerOf(nq.options.length, nq.numbering)}
                                    </span>
                                    <span className="min-w-0 flex-1 text-sm">{dict.other}</span>
                                </button>
                            )}
                            {textShown && (
                                <textarea
                                    ref={textRef}
                                    rows={2}
                                    value={currentText}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setOtherText((list) => update(list, tab, value, ''));
                                    }}
                                    disabled={disabled}
                                    aria-label={nq.options.length === 0 ? nq.source.question : dict.other}
                                    placeholder={dict.otherPlaceholder}
                                    aria-keyshortcuts="Control+Enter Meta+Enter"
                                    onFocus={() => setTyping(true)}
                                    onBlur={() => setTyping(false)}
                                    className={cn(fieldTextAreaBaseClass, 'min-h-0 resize-y shadow-none focus-visible:ring-2')}
                                />
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-xs text-muted-foreground">{dict.reviewHint}</p>
                        <ul className="mt-2 space-y-1">
                            {normal.map((item, q) => {
                                const values = valuesOf(q);
                                return (
                                    <li key={item.source.id ?? q}>
                                        <button
                                            type="button"
                                            onClick={() => go(q)}
                                            className="w-full rounded-md px-2 py-1.5 text-start transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        >
                                            <span className="block text-xs text-muted-foreground">{item.title}</span>
                                            <span className={cn('block text-sm', values.length === 0 && 'italic text-destructive')}>
                                                {values.length ? values.join(', ') : dict.noAnswer}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                )}
            </div>

            <div className={cn('flex flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-2', classNames?.footer)}>
                <span className="text-[11px] text-muted-foreground">
                    {nq && textShown && (typing || lastMarker < 0)
                        ? dict.textKeyboardHint
                        : nq && lastMarker >= 0 ? interpolate(dict.keyboardHint, { first: markerOf(0, nq.numbering), last: markerOf(lastMarker, nq.numbering) }) : null}
                </span>
                <div className="ms-auto flex items-center gap-2">
                    {hasReview && tab > 0 && (
                        <button type="button" onClick={() => go(tab - 1)} disabled={locked} className={cn(BUTTON, 'border border-border hover:bg-accent')}>
                            {dict.back}
                        </button>
                    )}
                    {hasReview && tab < count ? (
                        <button type="button" onClick={() => go(tab + 1)} disabled={locked || !answered(tab)} className={cn(BUTTON, 'border border-border hover:bg-accent')}>
                            {dict.next}
                        </button>
                    ) : (
                        <button
                            type="button"
                            data-rf-submit=""
                            onClick={() => void submit()}
                            disabled={locked || !allAnswered}
                            className={cn(BUTTON, 'bg-primary text-primary-foreground hover:bg-primary/90')}
                        >
                            {busy && <Icon name="loader-2" size={12} className="animate-spin" />}
                            {submitLabel ?? dict.submit}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
