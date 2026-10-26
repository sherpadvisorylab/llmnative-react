import React from 'react';
import { cn } from '../../../libs/cn';
import { interpolate, useI18n, type I18nDict } from '../../../I18n';
import Icon from '../../ui/Icon';
import ChatMarkdown from './ChatMarkdown';

/** Classes for the parts of a `ChatReasoning`, added to the defaults. */
export interface ChatReasoningClassNames {
    root?: string;
    /** The summary line that opens and closes the block. */
    trigger?: string;
    content?: string;
}

export interface ChatReasoningProps {
    /** The reasoning of the model, as Markdown. */
    content: string;
    /** The reasoning is still arriving: the block is open (unless the user closed it) and its end is repaired. */
    streaming?: boolean;
    /** How long the model reasoned, in seconds: the summary says "Reasoned for 12 s". */
    duration?: number;
    /** Open when it is not streaming. Default `false`. */
    defaultOpen?: boolean;
    /** Controlled open state; with it, the block opens and closes only through `onOpenChange`. */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Replaces the summary text. */
    label?: React.ReactNode;
    /** Icon of the summary line. Default `brain`. */
    icon?: string;
    className?: string;
    classNames?: ChatReasoningClassNames;
}

/** `12` → "12 s", `75` → "1 min 15 s", in the words of the dictionary. */
export function formatReasoningDuration(seconds: number, dict: I18nDict['chat']): string {
    const total = Math.max(1, Math.round(seconds));
    if (total < 60) return interpolate(dict.durationSeconds, { seconds: total });
    return interpolate(dict.durationMinutes, { minutes: Math.floor(total / 60), seconds: total % 60 });
}

/**
 * CR-109 — The reasoning of the model, in a block of its own: closed by default behind a summary line
 * ("Reasoning", "Reasoned for 12 s"), open while it streams, its Markdown in a muted tone.
 */
export default function ChatReasoning({
    content,
    streaming = false,
    duration,
    defaultOpen = false,
    open,
    onOpenChange,
    label,
    icon = 'brain',
    className,
    classNames,
}: ChatReasoningProps) {
    const dict = useI18n('chat');
    const contentId = React.useId();
    // What the user chose with the summary line; until then, open while it streams.
    const [chosen, setChosen] = React.useState<boolean | null>(null);
    const isOpen = open ?? chosen ?? (streaming || defaultOpen);

    const toggle = () => {
        const next = !isOpen;
        if (open === undefined) setChosen(next);
        onOpenChange?.(next);
    };

    const summary = label
        ?? (streaming
            ? dict.reasoningStreaming
            : duration !== undefined && duration !== null
                ? interpolate(dict.reasoningFor, { duration: formatReasoningDuration(duration, dict) })
                : dict.reasoning);

    return (
        <div className={cn('rf-chat-reasoning my-2 min-w-0', className, classNames?.root)}>
            <button
                type="button"
                onClick={toggle}
                aria-expanded={isOpen}
                aria-controls={contentId}
                className={cn(
                    'inline-flex max-w-full items-center gap-1.5 rounded-md py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    classNames?.trigger,
                )}
            >
                <Icon name={icon} size={14} className={streaming ? 'animate-pulse' : undefined} />
                <span className="truncate">{summary}</span>
                <Icon name="chevron-down" size={14} className={cn('shrink-0 transition-transform',!isOpen && '-rotate-90 rtl:rotate-90')} />
            </button>
            <div
                id={contentId}
                role="region"
                aria-label={typeof summary === 'string' ? summary : dict.reasoning}
                hidden={!isOpen}
                className={cn('mt-1 border-s-2 border-border ps-3', classNames?.content)}
            >
                {isOpen && <ChatMarkdown content={content} streaming={streaming} tone="muted" className="text-xs" />}
            </div>
        </div>
    );
}
