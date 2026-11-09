import React from 'react';
import { cn } from '../../../libs/cn';
import { interpolate, useI18n } from '../../../I18n';
import Icon from '../../ui/Icon';
import ChatMarkdown from './ChatMarkdown';

/** One group of steps of an agent: what it did, how many times, what it touched; the lines under it on request. */
export interface ChatActivitySteps {
    type: 'steps';
    /** Icon name of the icon provider. Default `terminal`. */
    icon?: string;
    /** What the agent did, in a few words ("Reads files", "Runs the tests"). */
    label: string;
    /** How many steps the group has: shown from 2 on. */
    count?: number;
    /** Short details next to the label: the queries, the files, the commands. The first four, the rest on hover. */
    detail?: readonly string[];
    /** How many steps of the group failed: a warning badge. */
    failed?: number;
    /** The lines under the group (its commands, their errors), shown in a block opened by its button. */
    lines?: readonly string[];
}

/** An item of the work of an agent: a group of steps, its own words (Markdown), or how it ended. */
export type ChatActivityItem =
    | ChatActivitySteps
    | { type: 'text'; text: string }
    | { type: 'end'; ok: boolean; text: string };

/** Classes for the parts of a `ChatActivity`, added to the defaults. */
export interface ChatActivityClassNames {
    root?: string;
    step?: string;
    text?: string;
    files?: string;
    log?: string;
}

export interface ChatActivityProps {
    items: readonly ChatActivityItem[];
    /** The files the agent changed: listed at the end. */
    files?: readonly string[];
    /** Opens the changes of the files (a diff, a page of the repository): its button next to the list. */
    onShowChanges?: () => void;
    /** The whole raw log: with it, a switch to read it and back. */
    log?: readonly string[];
    className?: string;
    classNames?: ChatActivityClassNames;
}

/** One group of steps, its lines opened by its own button. */
function StepRow({ item, className }: { item: ChatActivitySteps; className?: string }) {
    const dict = useI18n('chat');
    const [open, setOpen] = React.useState(false);
    const linesId = React.useId();
    const detail = item.detail ?? [];
    const lines = item.lines ?? [];
    return (
        <li className={cn('min-w-0 space-y-1', className)}>
            <div className="flex min-w-0 items-center gap-2 text-sm">
                <Icon name={item.icon ?? 'terminal'} size={14} className="shrink-0 text-muted-foreground" />
                <span className="shrink-0 font-medium">{item.label}</span>
                {(item.count ?? 1) > 1 && <span className="shrink-0 rounded-full bg-muted px-2 text-xs text-muted-foreground">{interpolate(dict.activityCount, { count: item.count ?? 1 })}</span>}
                {(item.failed ?? 0) > 0 && <span className="shrink-0 rounded-full bg-warning/15 px-2 text-xs text-warning">{interpolate(dict.activityFailed, { count: item.failed ?? 0 })}</span>}
                {detail.length > 0 && (
                    <span className="min-w-0 truncate text-xs text-muted-foreground" title={detail.join(', ')}>
                        {detail.slice(0, 4).join(', ')}{detail.length > 4 ? '…' : ''}
                    </span>
                )}
                {lines.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setOpen((value) => !value)}
                        aria-expanded={open}
                        aria-controls={linesId}
                        className="ms-auto inline-flex shrink-0 items-center gap-1 rounded-md text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        {open ? dict.activityHide : dict.activityCommands}
                        <Icon name="chevron-down" size={12} className={cn('transition-transform', open && 'rotate-180')} />
                    </button>
                )}
            </div>
            {lines.length > 0 && (
                <pre id={linesId} hidden={!open} className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-md border border-border bg-muted p-2 font-mono text-xs leading-relaxed text-muted-foreground">
                    {open ? lines.join('\n') : null}
                </pre>
            )}
        </li>
    );
}

/**
 * CR-123 — The work of an agent in a chat, as AI assistants show it: what it did, grouped (an icon, a label, how many
 * steps, the queries or the files), its commands on request, its own words in between, how it ended, the files it
 * changed with their changes on request; the whole raw log one click away. The consumer maps its own log to the items.
 */
export default function ChatActivity({ items, files = [], onShowChanges, log, className, classNames }: ChatActivityProps) {
    const dict = useI18n('chat');
    const [raw, setRaw] = React.useState(false);

    if (raw && log) {
        return (
            <div className={cn('rf-chat-activity min-w-0 space-y-2', className, classNames?.root)}>
                <button type="button" onClick={() => setRaw(false)} className="inline-flex items-center gap-1 text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Icon name="list" size={12} />{dict.activitySteps}
                </button>
                <pre className={cn('max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-md border border-border bg-muted p-3 font-mono text-xs leading-relaxed', classNames?.log)}>
                    {log.join('\n') || dict.activityEmpty}
                </pre>
            </div>
        );
    }

    return (
        <div className={cn('rf-chat-activity min-w-0 space-y-3', className, classNames?.root)}>
            {!items.length && <p className="text-xs text-muted-foreground">{dict.activityEmpty}</p>}
            {items.length > 0 && (
                <ul className="space-y-2">
                    {items.map((item, index) => {
                        if (item.type === 'steps') return <StepRow key={index} item={item} className={classNames?.step} />;
                        if (item.type === 'text') {
                            return (
                                <li key={index} className={cn('rounded-md bg-card px-3 py-2', classNames?.text)}>
                                    <ChatMarkdown content={item.text} className="text-sm" />
                                </li>
                            );
                        }
                        return (
                            <li key={index} className="flex items-center gap-2 text-xs">
                                <Icon name={item.ok ? 'circle-check' : 'circle-x'} size={14} className={item.ok ? 'text-success' : 'text-danger'} />
                                <span className="text-muted-foreground">{item.text}</span>
                            </li>
                        );
                    })}
                </ul>
            )}
            {files.length > 0 && (
                <div className={cn('rounded-md border border-border px-3 py-2', classNames?.files)}>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold">{interpolate(dict.activityFiles, { count: files.length })}</span>
                        {onShowChanges && (
                            <button type="button" onClick={onShowChanges} className="ms-auto inline-flex items-center gap-1 text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                <Icon name="git-compare" size={12} />{dict.activityChanges}
                            </button>
                        )}
                    </div>
                    <ul className="mt-1 space-y-0.5">
                        {files.map((file) => <li key={file} className="truncate font-mono text-xs text-muted-foreground" title={file}>{file}</li>)}
                    </ul>
                </div>
            )}
            {log && (
                <button type="button" onClick={() => setRaw(true)} className="inline-flex items-center gap-1 text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Icon name="terminal" size={12} />{dict.activityLog}
                </button>
            )}
        </div>
    );
}
