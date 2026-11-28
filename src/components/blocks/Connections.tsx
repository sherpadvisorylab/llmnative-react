import React, { useState } from 'react';
import { interpolate, useI18n } from '../../I18n';
import Alert from '../ui/Alert';
import Badge from '../ui/Badge';
import { ActionButton, LoadingButton } from '../ui/Buttons';
import { Input } from '../ui/fields/Input';
import Modal, { ModalYesNo } from '../ui/Modal';
import Form from '../widgets/Form';
import ListCard from './ListCard';
import SortableList from './SortableList';

// CR-157 — the connections of an app as boxes, the same wherever they are kept: its AI providers (`AIConnections`), the
// subscriptions on a runner. A box per provider, grouped (subscriptions, paid by use), with how many connections it has;
// the box opens its modal, where `ConnectionList` shows those connections in the order they are used (the next one when
// one runs out of credit or is refused), to add, rename, order and revoke. How one is added (a key by the rules of the
// provider, an OAuth sign-in for a subscription) is the caller's: these blocks keep no data of a provider.

/** A box of `ConnectionBoard`: a provider and how many connections it has. */
export interface ConnectionBoxItem {
    id: string;
    label: string;
    description?: string;
    /** Default `bot`. */
    icon?: string;
    /** Listed with the subscriptions or with the providers paid by use (default). */
    group?: 'subscription' | 'usage';
    /** How many connections are configured: none says "To connect". */
    count: number;
    /** A state of the caller in place of the count (e.g. out of credit). */
    status?: React.ReactNode;
}

export interface ConnectionBoardProps {
    items: ConnectionBoxItem[];
    /** A box clicked: the caller opens its modal. */
    onOpen: (id: string) => void;
    /** The titles of the two groups; default those of the framework. */
    titles?: { subscription?: string; usage?: string };
    className?: string;
}

/** The connections as boxes, by group, each with its count. */
export function ConnectionBoard({ items, onOpen, titles, className }: ConnectionBoardProps) {
    const t = useI18n('connections');
    const badgeOf = (item: ConnectionBoxItem) => item.status ?? (item.count > 0
        ? <Badge variant="success">{item.count === 1 ? t.countOne : interpolate(t.countMany, { count: item.count })}</Badge>
        : <Badge variant="light">{t.none}</Badge>);
    const section = (group: 'subscription' | 'usage', title: string) => {
        const boxes = items.filter((item) => (item.group ?? 'usage') === group);
        if (!boxes.length) return null;
        return (
            <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                    {boxes.map((item) => (
                        <ListCard key={item.id} icon={item.icon ?? 'bot'} title={item.label} description={item.description} badge={badgeOf(item)} onClick={() => onOpen(item.id)} />
                    ))}
                </div>
            </div>
        );
    };
    return (
        <div className={className ?? 'space-y-4'}>
            {section('subscription', titles?.subscription ?? t.subscriptions)}
            {section('usage', titles?.usage ?? t.usage)}
        </div>
    );
}

/** A connection of `ConnectionList`: never its secret. */
export interface ConnectionListItem {
    id: string;
    label?: string;
    /** ISO date it was added. */
    at?: string;
    /** ISO time it has credit again, when it has none now. */
    exhaustedUntil?: string;
    /** A line under the name, in place of the date. */
    meta?: string;
    /** Default `key-round`. */
    icon?: string;
}

export interface ConnectionListProps {
    items: ConnectionListItem[];
    /** Above the list; default "Connections (n)". */
    title?: string;
    /** The new order (ids); absent, the order cannot change. */
    onReorder?: (ids: string[]) => void | Promise<void>;
    /** A new name; absent, no rename. */
    onRename?: (id: string, label: string) => Promise<void>;
    /** Revoked; absent, no revoke. */
    onRemove?: (id: string) => Promise<void>;
    /** The way to add one (a key, an OAuth sign-in), shown under the list; `done` closes it. Absent, no "Add". */
    renderAdd?: (done: () => void) => React.ReactNode;
    addLabel?: string;
    readOnly?: boolean;
    /** A modal of its own (rename, revoke) opens over the caller's (true) and closes: the caller dims its own. */
    onStack?: (open: boolean) => void;
    /** Without connections; default the framework's. */
    emptyText?: string;
    /** Under the list with two or more; default the framework's. */
    orderHint?: string;
    /** The name of a connection without one, with `{n}` its position; default "Connection {n}". */
    unnamed?: string;
}

const timeOf = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });

/** The connections of one provider, in the order they are used: add, rename, order, revoke. */
export function ConnectionList({ items, title, onReorder, onRename, onRemove, renderAdd, addLabel, readOnly = false, onStack, emptyText, orderHint, unnamed }: ConnectionListProps) {
    const t = useI18n('connections');
    const [adding, setAdding] = useState(false);
    const [renaming, setRenamingState] = useState<ConnectionListItem | null>(null);
    const [removing, setRemovingState] = useState<ConnectionListItem | null>(null);
    const [name, setName] = useState('');
    const [error, setError] = useState<string>();
    const setRenaming = (item: ConnectionListItem | null) => {
        setRenamingState(item);
        setName(item?.label ?? '');
        setError(undefined);
        onStack?.(item !== null);
    };
    const setRemoving = (item: ConnectionListItem | null) => {
        setRemovingState(item);
        onStack?.(item !== null);
    };
    const nameOf = (item: ConnectionListItem, index: number) => item.label || interpolate(unnamed ?? t.unnamed, { n: index + 1 });
    const heading = title ?? interpolate(t.title, { count: items.length });
    const canAdd = !readOnly && Boolean(renderAdd);

    return (
        <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h5 className="text-sm font-semibold">{heading}</h5>
                {canAdd && !adding && <ActionButton icon="plus" variant="outline-primary" label={addLabel ?? t.add} onClick={() => setAdding(true)} />}
            </div>
            <SortableList
                items={items}
                getKey={(item) => item.id}
                label={heading}
                numbered={items.length > 1}
                disabled={readOnly || !onReorder}
                emptyState={<p className="text-sm text-muted-foreground">{emptyText ?? t.empty}</p>}
                onReorder={readOnly || !onReorder ? undefined : (next) => void onReorder(next.map((item) => item.id))}
                renderItem={(item, index) => ({
                    icon: item.icon ?? 'key-round',
                    title: nameOf(item, index),
                    meta: item.meta ?? (item.at ? interpolate(t.addedOn, { date: new Date(item.at).toLocaleDateString(undefined, { dateStyle: 'medium' }) }) : undefined),
                    badge: item.exhaustedUntil
                        ? <Badge variant="warning">{interpolate(t.exhausted, { time: timeOf(item.exhaustedUntil) })}</Badge>
                        : <Badge variant="success">{t.ready}</Badge>,
                    trailing: readOnly || (!onRename && !onRemove) ? undefined : (
                        <div className="flex items-center gap-1">
                            {onRename && <ActionButton icon="pencil" variant="link" ariaLabel={interpolate(t.renameAria, { name: nameOf(item, index) })} onClick={() => setRenaming(item)} />}
                            {onRemove && <ActionButton icon="trash-2" variant="link" ariaLabel={interpolate(t.removeAria, { name: nameOf(item, index) })} onClick={() => setRemoving(item)} />}
                        </div>
                    ),
                })}
            />
            {items.length > 1 && <p className="text-xs text-muted-foreground">{orderHint ?? t.orderHint}</p>}
            {adding && renderAdd?.(() => setAdding(false))}
            {renaming && onRename && (
                <Modal
                    title={t.renameTitle}
                    position="right"
                    size="sm"
                    onClose={() => setRenaming(null)}
                    footer={(
                        <>
                            <ActionButton variant="link" label={t.cancel} onClick={() => setRenaming(null)} />
                            <LoadingButton
                                variant="primary"
                                label={t.save}
                                disabled={!name.trim() || name.trim() === (renaming.label ?? '')}
                                onClick={async () => {
                                    try {
                                        await onRename(renaming.id, name.trim());
                                        setRenaming(null);
                                    } catch (failure) {
                                        setError(failure instanceof Error ? failure.message : String(failure));
                                    }
                                }}
                            />
                        </>
                    )}
                >
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form appearance="empty" showNotice={false} defaultValues={{ label: renaming.label ?? '' }} onSubmit={() => false}>
                        <Input name="label" label={t.name} onChange={({ value }) => setName(String(value ?? ''))} />
                    </Form>
                </Modal>
            )}
            {removing && onRemove && (
                <ModalYesNo
                    title={t.remove}
                    danger
                    onClose={() => setRemoving(null)}
                    onYes={async () => {
                        await onRemove(removing.id);
                        setRemoving(null);
                        return true;
                    }}
                >
                    {interpolate(t.removeConfirm, { name: nameOf(removing, items.indexOf(removing)) })}
                </ModalYesNo>
            )}
        </section>
    );
}
