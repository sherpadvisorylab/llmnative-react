import React, { useId, useState } from 'react';
import { useI18n } from '../../I18n';
import { cn } from '../../libs/cn';
import { ActionButton, LoadingButton } from '../ui/Buttons';
import Icon from '../ui/Icon';
import Modal from '../ui/Modal';

// CR-142 — the "danger zone" of a record, the way GitHub, Vercel or Stripe keep their destructive actions: at the
// bottom of its page, apart from the rest, each action with what it does; what cannot be undone asks to type a key.

/** How an action of the `DangerZone` is confirmed. */
export interface DangerZoneConfirm {
    /** Title of the confirmation. Default: the title of the action. */
    title?: React.ReactNode;
    /** What happens, said in the confirmation. Default: the description of the action. */
    message?: React.ReactNode;
    /**
     * A key the person types (or pastes: a button copies it) before the action runs, for what cannot be undone:
     * the name of the record, its id. Without it the confirmation is a yes or no.
     */
    key?: string;
    /** Label of the red button of the confirmation. Default: the label of the action. */
    confirmLabel?: string;
}

/** One action of the `DangerZone`. */
export interface DangerZoneAction {
    /** A stable key for the list. Default: its position. */
    id?: string;
    title: React.ReactNode;
    description?: React.ReactNode;
    /** Label of its button. */
    label: string;
    icon?: string;
    /** `danger` (default) for what removes or blocks; `secondary` for what only undoes (unblock, enable). */
    variant?: 'danger' | 'secondary';
    /** `false` runs at once; `true` asks yes or no; an object says how (with `key`, the key to type). Default `true`. */
    confirm?: boolean | DangerZoneConfirm;
    /** Runs the action; `false` keeps the confirmation open (the action failed and says why on its own). */
    onConfirm: () => Promise<boolean | void> | boolean | void;
    disabled?: boolean;
}

export interface DangerZoneProps {
    /** Title of the zone. Default: "Danger zone" in the language of the app. */
    title?: React.ReactNode;
    description?: React.ReactNode;
    actions: DangerZoneAction[];
    className?: string;
    wrapperClassName?: string;
}

/** Copies a text; resolves `false` when the browser cannot. */
async function copia(text: string): Promise<boolean> {
    try {
        if (!navigator.clipboard) return false;
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
}

/** The confirmation of an action: yes or no, or the key to type. */
function Conferma({ action, onClose }: { action: DangerZoneAction; onClose: () => void }) {
    const dict = useI18n('dangerZone');
    const opzioni: DangerZoneConfirm = typeof action.confirm === 'object' ? action.confirm : {};
    const chiave = opzioni.key;
    const [scritto, setScritto] = useState('');
    const [copiata, setCopiata] = useState(false);
    const idCampo = useId();
    const pronta = !chiave || scritto.trim() === chiave;
    const danger = (action.variant ?? 'danger') === 'danger';
    return (
        <Modal
            title={opzioni.title ?? action.title}
            onClose={onClose}
            allowFullscreen={false}
            footer={<>
                <ActionButton label={dict.cancel} variant="secondary" onClick={onClose} />
                <LoadingButton
                    label={opzioni.confirmLabel ?? action.label}
                    variant={danger ? 'danger' : 'primary'}
                    disabled={!pronta}
                    onClick={async (event) => {
                        event.preventDefault();
                        if (!pronta) return;
                        const esito = await action.onConfirm();
                        if (esito !== false) onClose();
                    }}
                />
            </>}
        >
            <div className="flex flex-col gap-3 text-sm">
                {(opzioni.message ?? action.description) && <p>{opzioni.message ?? action.description}</p>}
                {chiave && <>
                    <label htmlFor={idCampo} className="font-medium">{dict.typeToConfirm}</label>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 select-all break-all rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm">{chiave}</code>
                        <ActionButton
                            icon={copiata ? 'check' : 'copy'}
                            label={copiata ? dict.copied : dict.copy}
                            variant="secondary"
                            onClick={async () => setCopiata(await copia(chiave))}
                        />
                    </div>
                    <input
                        id={idCampo}
                        className="form-control w-full"
                        autoComplete="off"
                        spellCheck={false}
                        value={scritto}
                        onChange={(event) => setScritto(event.target.value)}
                        aria-invalid={scritto !== '' && !pronta}
                    />
                </>}
            </div>
        </Modal>
    );
}

/**
 * The danger zone of a record: its destructive actions at the bottom, apart, each with what it does and its own
 * confirmation (none, yes or no, or a key to type for what cannot be undone).
 */
export function DangerZone({ title, description, actions, className, wrapperClassName }: DangerZoneProps) {
    const dict = useI18n('dangerZone');
    const [aperta, setAperta] = useState<DangerZoneAction | null>(null);
    if (actions.length === 0) return null;
    return (
        <section className={cn('mt-6 flex flex-col gap-3', wrapperClassName)} aria-label={typeof title === 'string' ? title : dict.title}>
            <div className="flex flex-col gap-0.5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-destructive">
                    <Icon name="triangle-alert" size={16} />
                    {title ?? dict.title}
                </h3>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            <ul className={cn('divide-y divide-destructive/20 rounded-lg border border-destructive/30', className)}>
                {actions.map((action, index) => (
                    <li key={action.id ?? index} className="flex flex-wrap items-center justify-between gap-3 p-4">
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{action.title}</p>
                            {action.description && <p className="text-sm text-muted-foreground">{action.description}</p>}
                        </div>
                        <ActionButton
                            label={action.label}
                            icon={action.icon}
                            variant={(action.variant ?? 'danger') === 'danger' ? 'outline-danger' : 'secondary'}
                            disabled={action.disabled}
                            onClick={async () => {
                                if (action.confirm === false) await action.onConfirm();
                                else setAperta(action);
                            }}
                        />
                    </li>
                ))}
            </ul>
            {aperta && <Conferma action={aperta} onClose={() => setAperta(null)} />}
        </section>
    );
}

export default DangerZone;
