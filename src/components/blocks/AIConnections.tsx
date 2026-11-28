import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { interpolate, useI18n } from '../../I18n';
import { AI_PROVIDER_DESCRIPTORS, OPENAI_COMPATIBLE_PROVIDER_DESCRIPTOR } from '../../providers/ai';
import type { AIDataRegion, AIModelDescriptor } from '../../providers/ai/AIProvider';
import {
    isModelInRegion,
    type AIConnectionsSnapshot,
    type AIConnectionStore,
    type AIConnector,
    type AIProviderConnectionView,
    type AIRegionRule,
} from '../../providers/ai/connections';
import type { ProviderCredentialField, ProviderDescriptor } from '../../providers/ProviderDescriptor';
import Alert from '../ui/Alert';
import Badge from '../ui/Badge';
import { ActionButton, LoadingButton } from '../ui/Buttons';
import Card from '../ui/Card';
import { Input, Password, TextArea } from '../ui/fields/Input';
import Modal, { ModalYesNo } from '../ui/Modal';
import Table from '../ui/Table';
import Form from '../widgets/Form';
import { useFormController } from '../widgets/form-controller';
import { ConnectionBoard, ConnectionList, type ConnectionBoxItem, type ConnectionListItem } from './Connections';

// CR-134 — the page where an app connects its AI providers: the providers the framework knows (their fields,
// their check, their models), the accounts of each, the order the agents try them, the data region of each
// model, and the connectors of the app (a subscription on a runner). The app keeps the secrets behind its
// `AIConnectionStore`: the page sends them once and never reads them back.

export interface AIConnectionsProps {
    store: AIConnectionStore;
    /** The providers offered; default: every provider of the framework and the OpenAI-compatible endpoint. */
    providers?: ProviderDescriptor[];
    /** Only these providers (by id). */
    allow?: string[];
    /** Not these providers (by id). */
    hide?: string[];
    /** Shown, not changed: what the app fixes in its code. */
    readOnly?: boolean;
    /** The providers listed with the subscriptions (a fixed price): default `opencode-go`. */
    subscriptions?: string[];
    /** The connectors of the app, next to the providers (e.g. a subscription on a runner). */
    connectors?: AIConnector[];
    /** The data region the app prefers: models outside it are marked, or refused with `require`. */
    region?: AIRegionRule;
    /** The order of the providers (when the store keeps one): which ids enter it; default all of the order. */
    orderProviders?: string[];
    /** More of a provider's modal: what the app sets on a connected provider (e.g. the model its chats start with). */
    renderProvider?: (providerId: string) => React.ReactNode;
    /** Above the lists; default the text of `aiConnections.intro`. */
    intro?: React.ReactNode;
    className?: string;
}

const DEFAULT_SUBSCRIPTIONS = ['opencode-go'];

const timeOf = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/** The snapshot of the store, kept fresh: live when it can, loaded again after each change otherwise. */
function useConnections(store: AIConnectionStore) {
    const [snapshot, setSnapshot] = useState<AIConnectionsSnapshot>();
    const [error, setError] = useState<string>();
    const reload = useCallback(async () => {
        try {
            setSnapshot(await store.load());
            setError(undefined);
        } catch (failure) {
            setError(failure instanceof Error ? failure.message : String(failure));
        }
    }, [store]);
    useEffect(() => {
        void reload();
        return store.subscribe?.((next) => setSnapshot(next));
    }, [store, reload]);
    return { snapshot, error, reload };
}

/** The name of a data region, in the language of the page. */
export function useRegionLabel() {
    const t = useI18n('aiConnections');
    return (region: AIDataRegion | undefined) => (
        region === 'eu' ? t.regionEu
            : region === 'us' ? t.regionUs
            : region === 'global' ? t.regionGlobal
            : !region || region === 'unknown' ? t.regionUnknown
            : region
    );
}

/**
 * The data region of a model as a badge (CR-134): green when it is the region the app prefers, a warning (or
 * "not allowed" with `require`) when it is not. Also for the model pickers of an app.
 */
export function AIModelRegionBadge({ model, region }: { model: Pick<AIModelDescriptor, 'dataRegion'>; region?: AIRegionRule }) {
    const t = useI18n('aiConnections');
    const label = useRegionLabel();
    const name = label(model.dataRegion);
    if (!region) return <Badge variant="light">{name}</Badge>;
    if (isModelInRegion(model, region)) return <Badge variant="success">{name}</Badge>;
    const preferred = label(region.preferred);
    return (
        <Badge variant={region.mode === 'require' ? 'danger' : 'warning'}>
            {`${name} · ${interpolate(region.mode === 'require' ? t.notAllowed : t.outsideRegion, { region: preferred })}`}
        </Badge>
    );
}

export default function AIConnections({
    store,
    providers,
    allow,
    hide,
    readOnly = false,
    subscriptions = DEFAULT_SUBSCRIPTIONS,
    connectors = [],
    region,
    orderProviders,
    renderProvider,
    intro,
    className,
}: AIConnectionsProps) {
    const t = useI18n('aiConnections');
    const { snapshot, error, reload } = useConnections(store);
    const [open, setOpen] = useState<ProviderDescriptor>();
    const [openConnector, setOpenConnector] = useState<AIConnector>();

    const descriptors = useMemo(() => (providers ?? [...AI_PROVIDER_DESCRIPTORS, OPENAI_COMPATIBLE_PROVIDER_DESCRIPTOR])
        .filter((descriptor) => (!allow || allow.includes(descriptor.id)) && !hide?.includes(descriptor.id)), [providers, allow, hide]);
    const connected = new Map((snapshot?.providers ?? []).map((provider) => [provider.id, provider]));
    const isSubscription = (id: string) => subscriptions.includes(id);

    // CR-157: a box per provider and connector, with how many connections it has; out of credit when all its keys are.
    const exhaustedNow = snapshot?.exhausted ?? [];
    const countOf = (id: string) => (connected.has(id) ? Math.max(1, connected.get(id)?.accounts?.length ?? 0) : 0);
    const statusOf = (id: string) => {
        const out = exhaustedNow.filter((entry) => entry.provider === id);
        return countOf(id) > 0 && out.length >= countOf(id)
            ? <Badge variant="warning">{interpolate(t.exhausted, { time: timeOf(out.map((entry) => entry.until).sort()[0]) })}</Badge>
            : undefined;
    };
    const boxes: ConnectionBoxItem[] = [
        ...descriptors.map((descriptor): ConnectionBoxItem => ({
            id: descriptor.id,
            label: descriptor.label,
            description: descriptor.description,
            group: isSubscription(descriptor.id) ? 'subscription' : 'usage',
            count: countOf(descriptor.id),
            status: statusOf(descriptor.id),
        })),
        ...connectors.map((connector): ConnectionBoxItem => ({
            id: connector.id,
            label: connector.label,
            description: connector.description,
            icon: connector.icon ?? 'terminal',
            group: connector.group ?? 'subscription',
            count: connector.connected ? connector.count ?? 1 : 0,
        })),
    ];
    const openBox = (id: string) => {
        const connector = connectors.find((item) => item.id === id);
        if (connector) setOpenConnector(connector);
        else setOpen(descriptors.find((descriptor) => descriptor.id === id));
    };

    return (
        <div className={className ?? 'space-y-4'}>
            {intro ?? <p className="text-sm text-muted-foreground">{t.intro}</p>}
            {readOnly && <Alert variant="info">{t.readOnly}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <ConnectionBoard items={boxes} onOpen={openBox} titles={{ subscription: t.subscriptions, usage: t.usage }} />
            {snapshot?.order && store.setOrder && (
                <ProviderOrder
                    store={store}
                    snapshot={snapshot}
                    readOnly={readOnly}
                    include={orderProviders}
                    labelOf={(id) => connectors.find((connector) => connector.id === id)?.label
                        ?? connected.get(id)?.label
                        ?? descriptors.find((descriptor) => descriptor.id === id)?.label
                        ?? AI_PROVIDER_DESCRIPTORS.find((descriptor) => descriptor.id === id)?.label
                        ?? id}
                    isSubscription={(id) => isSubscription(id) || connectors.some((connector) => connector.id === id && (connector.group ?? 'subscription') === 'subscription')}
                    onChange={reload}
                />
            )}
            {open && (
                <ProviderModal
                    key={open.id}
                    store={store}
                    descriptor={open}
                    current={connected.get(open.id)}
                    exhausted={snapshot?.exhausted ?? []}
                    readOnly={readOnly}
                    region={region}
                    extra={connected.has(open.id) ? renderProvider?.(open.id) : undefined}
                    onChange={reload}
                    onClose={() => setOpen(undefined)}
                />
            )}
            {openConnector && (
                <ConnectorModal
                    key={openConnector.id}
                    connector={connectors.find((connector) => connector.id === openConnector.id) ?? openConnector}
                    readOnly={readOnly}
                    onChange={reload}
                    onClose={() => setOpenConnector(undefined)}
                />
            )}
        </div>
    );
}

/** The order the agents try the providers in: automatic until a person drags one. */
function ProviderOrder({ store, snapshot, readOnly, include, labelOf, isSubscription, onChange }: {
    store: AIConnectionStore;
    snapshot: AIConnectionsSnapshot;
    readOnly: boolean;
    include?: string[];
    labelOf: (id: string) => string;
    isSubscription: (id: string) => boolean;
    onChange: () => Promise<void>;
}) {
    const t = useI18n('aiConnections');
    const order = snapshot.order!;
    const list = order.list.filter((id) => !include || include.includes(id));
    if (!list.length) return null;
    const accountsOf = (id: string) => Math.max(1, snapshot.providers.find((provider) => provider.id === id)?.accounts?.length ?? 0);
    const exhausted = snapshot.exhausted ?? [];
    const name = (id: string) => (accountsOf(id) > 1 ? `${labelOf(id)} · ${interpolate(t.accounts, { count: accountsOf(id) })}` : labelOf(id));
    const save = async (next: string[] | null) => {
        await store.setOrder!(next);
        await onChange();
    };
    return (
        <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.order}</h4>
                {order.manual && !readOnly
                    ? <ActionButton icon="rotate-ccw" variant="link" className="h-auto p-0 text-xs" label={t.orderReset} onClick={() => void save(null)} />
                    : <Badge variant="light">{order.manual ? t.order : t.orderAuto}</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{order.manual ? t.orderManualHint : t.orderAutoHint}</p>
            <Table
                columns={[{ key: 'position', label: '#' }, { key: 'name', label: t.orderProvider }, { key: 'kind', label: t.orderKind }, { key: 'state', label: t.orderState }]}
                records={list.map((id, index) => ({ _key: id, position: index + 1, name: name(id), kind: id, state: id }))}
                recordId="_key"
                onReorder={readOnly ? undefined : (records) => void save(records.map((record) => String(record._key)))}
                renderCell={(record, key) => {
                    const id = String(record._key);
                    if (key === 'kind') return <Badge variant={isSubscription(id) ? 'info' : 'light'}>{isSubscription(id) ? t.subscription : t.byUse}</Badge>;
                    if (key === 'state') {
                        // Out of credit only when all its accounts are: until the first comes back.
                        const out = exhausted.filter((entry) => entry.provider === id);
                        if (out.length >= accountsOf(id)) return <Badge variant="warning">{interpolate(t.exhausted, { time: timeOf(out.map((entry) => entry.until).sort()[0]) })}</Badge>;
                        if (out.length) return <Badge variant="light">{interpolate(t.available, { available: accountsOf(id) - out.length, total: accountsOf(id) })}</Badge>;
                        return <span className="text-xs text-muted-foreground">{t.ready}</span>;
                    }
                    return String(record[key] ?? '');
                }}
            />
        </div>
    );
}

/** A field of a provider or a connector: secrets as passwords (empty: keep the saved one), the rest as text. */
function CredentialInput({ field, saved }: { field: ProviderCredentialField; saved: boolean }) {
    const t = useI18n('aiConnections');
    if (field.type === 'password') {
        return <Password name={field.key} label={field.label} placeholder={saved ? t.savedSecret : field.placeholder} feedback={saved ? t.keepSecret : undefined} required={!saved} />;
    }
    if (field.type === 'textarea') return <TextArea name={field.key} label={field.label} placeholder={field.placeholder} required />;
    return <Input name={field.key} label={field.label} placeholder={field.placeholder} required />;
}

/** The models of a connected provider, with where they process the data and their price. */
function ProviderModels({ store, provider, region }: { store: AIConnectionStore; provider: string; region?: AIRegionRule }) {
    const t = useI18n('aiConnections');
    const [models, setModels] = useState<AIModelDescriptor[]>();
    useEffect(() => {
        let active = true;
        store.models?.(provider).then((list) => { if (active) setModels(list); }, () => { if (active) setModels([]); });
        return () => { active = false; };
    }, [store, provider]);
    if (!store.models) return null;
    return (
        <section className="space-y-2">
            <h5 className="text-sm font-semibold">{interpolate(t.models, { count: models?.length ?? 0 })}</h5>
            {!models ? <p className="text-xs text-muted-foreground">{t.modelsLoading}</p>
                : models.length === 0 ? <p className="text-xs text-muted-foreground">{t.modelsNone}</p>
                : (
                    <ul className="max-h-80 divide-y divide-border overflow-y-auto rounded-md border border-border text-sm">
                        {models.map((model) => (
                            <li key={model.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                                <span className="font-mono text-xs">{model.model}</span>
                                <span className="flex flex-wrap items-center gap-1">
                                    {model.pricing && <span className="text-xs text-muted-foreground">{interpolate(t.price, { input: model.pricing.input, output: model.pricing.output })}</span>}
                                    <AIModelRegionBadge model={model} region={region} />
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            {models && models.length > 0 && (
                <p className="text-xs text-muted-foreground">{models[0].structuredOutput === 'native' ? t.structuredNative : t.structuredPrompted}</p>
            )}
        </section>
    );
}

/** The single key of a provider connected without accounts, as one connection of the list. */
const SINGLE_KEY = '__key';

/**
 * CR-157: the keys of a connected provider as `ConnectionList`, also with one: in the order they are tried, added
 * (when the store can), renamed (when it can), ordered, revoked; revoking the last one disconnects the provider.
 */
function ProviderAccounts({ store, provider, current, exhausted, readOnly, descriptor, onChange, onDisconnected }: {
    store: AIConnectionStore;
    provider: string;
    current: AIProviderConnectionView;
    exhausted: AIConnectionsSnapshot['exhausted'];
    readOnly: boolean;
    descriptor: ProviderDescriptor;
    onChange: () => Promise<void>;
    onDisconnected: () => void;
}) {
    const t = useI18n('aiConnections');
    const accounts = current.accounts?.length ? current.accounts : undefined;
    const items: ConnectionListItem[] = (accounts ?? [{ id: SINGLE_KEY, at: current.at }]).map((account) => ({
        id: account.id,
        label: 'label' in account ? account.label : undefined,
        at: account.at,
        exhaustedUntil: exhausted?.find((entry) => entry.provider === provider && (entry.account === account.id || (!accounts && !entry.account)))?.until,
    }));
    return (
        <ConnectionList
            items={items}
            title={interpolate(t.accounts, { count: items.length })}
            readOnly={readOnly}
            addLabel={t.addAccount}
            unnamed={t.accountUnnamed}
            orderHint={t.accountsOrderHint}
            onReorder={accounts && accounts.length > 1 && store.orderAccounts ? async (ids) => { await store.orderAccounts!(provider, ids); await onChange(); } : undefined}
            onRename={accounts && store.renameAccount ? async (id, label) => { await store.renameAccount!(provider, id, label); await onChange(); } : undefined}
            onRemove={async (id) => {
                // The last one: the provider is disconnected.
                if (items.length === 1) {
                    await store.disconnect(provider);
                    await onChange();
                    onDisconnected();
                    return;
                }
                await store.removeAccount?.(provider, id);
                await onChange();
            }}
            renderAdd={store.addAccount ? (done) => <AddAccount store={store} descriptor={descriptor} onDone={async (added) => { done(); if (added) await onChange(); }} /> : undefined}
        />
    );
}

/** One more key of a connected provider, checked by the store with the provider before it keeps it. */
function AddAccount({ store, descriptor, onDone }: { store: AIConnectionStore; descriptor: ProviderDescriptor; onDone: (added: boolean) => void }) {
    const t = useI18n('aiConnections');
    const common = useI18n('common');
    const form = useFormController();
    const [error, setError] = useState<string>();
    const secretFields = descriptor.credentialFields.filter((field) => field.type === 'password');
    return (
        <Card headerClassName="px-4 py-3" bodyClassName="space-y-3" header={<span className="text-sm font-medium">{t.addAccount}</span>}>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form
                appearance="empty"
                controller={form}
                showNotice={false}
                defaultValues={{ label: '', ...Object.fromEntries(secretFields.map((field) => [field.key, ''])) }}
                onSave={async ({ record }) => {
                    setError(undefined);
                    const fields = Object.fromEntries(Object.entries(record ?? {}).map(([key, value]) => [key, String(value ?? '').trim()]));
                    const result = await store.addAccount!(descriptor.id, fields);
                    if (!result.ok) {
                        setError(interpolate(t.rejected, { error: result.error ?? '' }));
                        return undefined;
                    }
                    onDone(true);
                    return undefined;
                }}
            >
                <div className="grid gap-3 sm:grid-cols-2">
                    <Input name="label" label={t.accountLabel} />
                    {secretFields.map((field) => <CredentialInput key={field.key} field={field} saved={false} />)}
                </div>
            </Form>
            <div className="flex flex-wrap justify-end gap-2">
                <ActionButton variant="link" label={common.cancel} onClick={() => onDone(false)} />
                <LoadingButton icon="plus" variant="primary" label={t.addAccountSave} onClick={(event) => form.save(event)} />
            </div>
        </Card>
    );
}

/** Connects one provider: its fields, checked by the store with the provider; its accounts, models and extras once connected. */
function ProviderModal({ store, descriptor, current, exhausted, readOnly, region, extra, onChange, onClose }: {
    store: AIConnectionStore;
    descriptor: ProviderDescriptor;
    current?: AIProviderConnectionView;
    exhausted: NonNullable<AIConnectionsSnapshot['exhausted']>;
    readOnly: boolean;
    region?: AIRegionRule;
    extra?: React.ReactNode;
    onChange: () => Promise<void>;
    onClose: () => void;
}) {
    const t = useI18n('aiConnections');
    const common = useI18n('common');
    const form = useFormController();
    const [error, setError] = useState<string>();
    const [confirmRemove, setConfirmRemove] = useState(false);
    // Connected, with a store that keeps several keys: its keys are the list above (CR-157); the form stays for what is
    // not a key.
    const fields = current && store.addAccount
        ? descriptor.credentialFields.filter((field) => field.type !== 'password')
        : descriptor.credentialFields;
    const editing = !readOnly && (!current || fields.length > 0);

    return (
        <Modal
            title={descriptor.label}
            position="right"
            size="lg"
            onClose={onClose}
            footer={(
                <>
                    {current && !readOnly && (
                        <div className="me-auto">
                            <ActionButton icon="trash-2" label={t.disconnect} variant="outline-danger" onClick={() => setConfirmRemove(true)} />
                        </div>
                    )}
                    {editing && <LoadingButton variant="primary" label={current ? t.saveChanges : t.connect} onClick={(event) => form.save(event)} />}
                    <ActionButton variant="link" label={editing ? common.cancel : common.close} onClick={onClose} />
                </>
            )}
        >
            <div className="space-y-5">
                <p className="text-sm text-muted-foreground">{descriptor.description}</p>
                {current && (
                    <ProviderAccounts store={store} provider={descriptor.id} current={current} exhausted={exhausted} readOnly={readOnly} descriptor={descriptor} onChange={onChange} onDisconnected={onClose} />
                )}
                {extra}
                {error && <Alert variant="danger">{error}</Alert>}
                {editing && (
                    <Form
                        appearance="empty"
                        controller={form}
                        // The outcome is the provider's check, shown above: not a generic "saved".
                        showNotice={false}
                        defaultValues={Object.fromEntries(fields.map((field) => [field.key, field.type === 'password' ? '' : current?.fields?.[field.key] ?? '']))}
                        onSave={async ({ record }) => {
                            setError(undefined);
                            const values = Object.fromEntries(fields.map((field) => [field.key, String(record?.[field.key] ?? '').trim()]));
                            const result = await store.connect(descriptor.id, values);
                            if (!result.ok) {
                                setError(interpolate(t.rejected, { error: result.error ?? '' }));
                                return undefined;
                            }
                            await onChange();
                            onClose();
                            return undefined;
                        }}
                    >
                        {fields.map((field) => <CredentialInput key={field.key} field={field} saved={Boolean(current) && field.type === 'password'} />)}
                    </Form>
                )}
                {current && <ProviderModels store={store} provider={descriptor.id} region={region} />}
                {(descriptor.credentialsHint || descriptor.credentialsUrl) && !readOnly && (
                    <div className="space-y-1 text-sm text-muted-foreground">
                        {descriptor.credentialsHint && <p>{descriptor.credentialsHint}</p>}
                        {descriptor.credentialsUrl && (
                            <ActionButton
                                variant="link"
                                icon="external-link"
                                className="h-auto p-0"
                                label={t.whereToFind}
                                onClick={() => window.open(descriptor.credentialsUrl, '_blank', 'noopener,noreferrer')}
                            />
                        )}
                    </div>
                )}
            </div>
            {confirmRemove && (
                <ModalYesNo
                    title={t.disconnect}
                    danger
                    onClose={() => setConfirmRemove(false)}
                    onYes={async () => {
                        await store.disconnect(descriptor.id);
                        await onChange();
                        onClose();
                        return true;
                    }}
                >
                    {interpolate(t.disconnectConfirm, { provider: descriptor.label })}
                </ModalYesNo>
            )}
        </Modal>
    );
}

/** A connector of the app: its own content, or the form of its fields (e.g. where its runner is). */
function ConnectorModal({ connector, readOnly, onChange, onClose }: {
    connector: AIConnector;
    readOnly: boolean;
    onChange: () => Promise<void>;
    onClose: () => void;
}) {
    const t = useI18n('aiConnections');
    const common = useI18n('common');
    const form = useFormController();
    const [error, setError] = useState<string>();
    const [confirmRemove, setConfirmRemove] = useState(false);
    const custom = connector.render?.({ close: onClose }) as React.ReactNode;
    const fields = connector.fields ?? [];
    const editing = !custom && !readOnly && Boolean(connector.connect) && fields.length > 0;
    return (
        <Modal
            title={connector.label}
            position="right"
            size="lg"
            onClose={onClose}
            footer={(
                <>
                    {connector.connected && connector.disconnect && !readOnly && !custom && (
                        <div className="me-auto">
                            <ActionButton icon="trash-2" label={t.disconnect} variant="outline-danger" onClick={() => setConfirmRemove(true)} />
                        </div>
                    )}
                    {editing && <LoadingButton variant="primary" label={connector.connected ? t.saveChanges : t.connect} onClick={(event) => form.save(event)} />}
                    <ActionButton variant="link" label={editing ? common.cancel : common.close} onClick={onClose} />
                </>
            )}
        >
            {custom ?? (
                <div className="space-y-5">
                    {connector.description && <p className="text-sm text-muted-foreground">{connector.description}</p>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    {editing && (
                        <Form
                            appearance="empty"
                            controller={form}
                            showNotice={false}
                            defaultValues={Object.fromEntries(fields.map((field) => [field.key, field.type === 'password' ? '' : connector.values?.[field.key] ?? '']))}
                            onSave={async ({ record }) => {
                                setError(undefined);
                                const values = Object.fromEntries(fields.map((field) => [field.key, String(record?.[field.key] ?? '').trim()]));
                                const result = await connector.connect!(values);
                                if (!result.ok) {
                                    setError(interpolate(t.rejected, { error: result.error ?? '' }));
                                    return undefined;
                                }
                                await onChange();
                                onClose();
                                return undefined;
                            }}
                        >
                            {fields.map((field) => <CredentialInput key={field.key} field={field} saved={connector.connected && field.type === 'password'} />)}
                        </Form>
                    )}
                </div>
            )}
            {confirmRemove && (
                <ModalYesNo
                    title={t.disconnect}
                    danger
                    onClose={() => setConfirmRemove(false)}
                    onYes={async () => {
                        await connector.disconnect!();
                        await onChange();
                        onClose();
                        return true;
                    }}
                >
                    {interpolate(t.disconnectConfirm, { provider: connector.label })}
                </ModalYesNo>
            )}
        </Modal>
    );
}
