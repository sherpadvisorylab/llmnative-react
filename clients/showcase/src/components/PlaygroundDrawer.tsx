import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Icon, MockDataProvider, DataProvider, useMotionEffect, useMotionState } from '@ash/react';
import type { PropDef, PlaygroundConfig } from '../types/playground';

const BASE_INPUT = 'w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring';

// Curated icon names that work across lucide and phosphor providers
const PLAYGROUND_ICONS = [
    'activity', 'alert-circle', 'archive', 'arrow-down', 'arrow-left', 'arrow-right', 'arrow-up',
    'bell', 'bell-off', 'bookmark', 'calendar', 'camera', 'check', 'check-circle',
    'chevron-down', 'chevron-left', 'chevron-right', 'chevron-up', 'clipboard', 'clock',
    'close', 'cloud', 'code', 'copy', 'database', 'download', 'edit', 'eye', 'eye-off',
    'file', 'filter', 'flag', 'folder', 'globe', 'grid', 'heart', 'home', 'image',
    'info', 'key', 'layers', 'link', 'list', 'lock', 'mail', 'map', 'menu',
    'minus', 'moon', 'more-horizontal', 'more-vertical', 'package', 'phone', 'play',
    'plus', 'power', 'refresh', 'save', 'search', 'send', 'settings', 'share',
    'shield', 'star', 'sun', 'tag', 'terminal', 'trash', 'trending-up', 'upload',
    'user', 'users', 'video', 'warning', 'wifi', 'x-circle', 'zoom-in', 'zoom-out',
];

// ── WithMock helper (local, same as in GridPage) ──────────────────────────────

function WithMock({ seed, children }: { seed: Record<string, Record<string, any>>; children: React.ReactNode }) {
    const provider = useMemo(() => new MockDataProvider(seed), [JSON.stringify(seed)]);
    return (
        <DataProvider registry={{ default: provider }} defaultKey="default">
            {children}
        </DataProvider>
    );
}

// ── Individual prop control ───────────────────────────────────────────────────

// ── Icon picker control ───────────────────────────────────────────────────────

function IconPickerControl({ value, onChange }: { value: boolean | string; onChange: (v: boolean | string) => void }) {
    const hasIcon = value !== false;
    const selectValue = value === true ? '__auto__' : (typeof value === 'string' ? value : '__auto__');

    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    className="rounded border-border accent-primary w-4 h-4"
                    checked={hasIcon}
                    onChange={(e) => onChange(e.target.checked ? true : false)}
                />
                <span className="text-xs text-muted-foreground">{hasIcon ? 'enabled' : 'disabled (false)'}</span>
            </label>
            {hasIcon && (
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <select
                            className={`${BASE_INPUT} appearance-none pr-7`}
                            value={selectValue}
                            onChange={(e) => {
                                const v = e.target.value;
                                onChange(v === '__auto__' ? true : v);
                            }}
                        >
                            <option value="__auto__">Auto (default for type)</option>
                            {PLAYGROUND_ICONS.map((name) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                        <Icon name="chevron-down" size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <div className="w-6 shrink-0 flex items-center justify-center text-foreground">
                        {typeof value === 'string' && value
                            ? <Icon name={value} size={18} />
                            : <span className="text-xs text-muted-foreground italic">auto</span>
                        }
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Individual prop control ───────────────────────────────────────────────────

function PropControl({ def, value, onChange }: { def: PropDef; value: any; onChange: (v: any) => void }) {
    const inputClass = def.readOnly
        ? `${BASE_INPUT} bg-muted text-muted-foreground cursor-not-allowed`
        : BASE_INPUT;

    return (
        <div className="flex items-start gap-3">
            <div className="w-44 shrink-0 pt-1.5">
                <span className="font-mono text-xs text-foreground">{def.name}</span>
                {def.required && <span className="ml-1 text-destructive text-xs">*</span>}
            </div>
            <div className="min-w-0 flex-1">
                {def.control === 'boolean' && (
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="rounded border-border accent-primary w-4 h-4"
                            checked={!!value}
                            disabled={def.readOnly}
                            onChange={(e) => onChange(e.target.checked)}
                        />
                        <span className="text-xs text-muted-foreground">{value ? 'true' : 'false'}</span>
                    </label>
                )}
                {def.control === 'text' && (
                    <input
                        type="text"
                        className={inputClass}
                        value={value ?? ''}
                        readOnly={def.readOnly}
                        onChange={(e) => onChange(e.target.value)}
                    />
                )}
                {def.control === 'number' && (
                    <input
                        type="number"
                        className={inputClass}
                        value={value ?? 0}
                        min={def.min}
                        max={def.max}
                        step={def.step ?? 1}
                        readOnly={def.readOnly}
                        onChange={(e) => onChange(Number(e.target.value))}
                    />
                )}
                {def.control === 'range' && (
                    <div className="flex items-center gap-2">
                        <input
                            type="range"
                            className="flex-1 accent-primary"
                            value={value ?? def.min ?? 0}
                            min={def.min ?? 0}
                            max={def.max ?? 100}
                            step={def.step ?? 1}
                            disabled={def.readOnly}
                            onChange={(e) => onChange(Number(e.target.value))}
                        />
                        <span className="text-xs text-muted-foreground w-8 text-right">{value}</span>
                    </div>
                )}
                {def.control === 'select' && (
                    <div className="relative">
                        <select
                            className={`${inputClass} appearance-none pr-7`}
                            value={value ?? ''}
                            disabled={def.readOnly}
                            onChange={(e) => onChange(e.target.value)}
                        >
                            {def.options?.map((o) => (
                                <option key={o} value={o}>{o || '(none)'}</option>
                            ))}
                        </select>
                        <Icon name="chevron-down" size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                )}
                {def.control === 'textarea' && (
                    <textarea
                        className={`${inputClass} resize-y`}
                        rows={3}
                        value={value ?? ''}
                        readOnly={def.readOnly}
                        onChange={(e) => onChange(e.target.value)}
                    />
                )}
                {def.control === 'json' && (
                    <textarea
                        className={`${inputClass} font-mono text-xs resize-y`}
                        rows={4}
                        value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                        readOnly={def.readOnly}
                        onChange={(e) => {
                            try { onChange(JSON.parse(e.target.value)); } catch { onChange(e.target.value); }
                        }}
                    />
                )}
                {def.control === 'icon' && (
                    <IconPickerControl value={value} onChange={onChange} />
                )}
                {def.help && (
                    <p className="mt-1.5 text-xs text-muted-foreground">{def.help}</p>
                )}
            </div>
        </div>
    );
}

// ── MockDbEditor (inline, collapsible) ────────────────────────────────────────

function MockDbEditor({ seed, onApply }: { seed: Record<string, any>; onApply: (s: Record<string, any>) => void }) {
    const [open, setOpen] = useState(false);
    const [json, setJson] = useState(() => JSON.stringify(seed, null, 2));
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setJson(JSON.stringify(seed, null, 2));
    }, [JSON.stringify(seed)]);

    const apply = () => {
        try {
            onApply(JSON.parse(json));
            setError(null);
        } catch {
            setError('Invalid JSON - check syntax and try again.');
        }
    };

    return (
        <div className="border-t">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
                <span className="flex items-center gap-2">
                    <Icon name="database" size={14} />
                    Mock database
                </span>
                <Icon name={open ? 'chevron-up' : 'chevron-down'} size={14} className="text-muted-foreground" />
            </button>
            {open && (
                <div className="px-4 pb-4 space-y-2">
                    <p className="text-xs text-muted-foreground">Edit the seed data used by the component. Changes are applied when the editor loses focus.</p>
                    <textarea
                        className="w-full h-52 rounded-md border border-border bg-muted font-mono text-xs px-3 py-2 text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                        value={json}
                        onChange={(e) => { setJson(e.target.value); setError(null); }}
                        onBlur={apply}
                        spellCheck={false}
                    />
                    {error && <p className="text-xs text-destructive">{error}</p>}
                </div>
            )}
        </div>
    );
}

// ── Accordion ────────────────────────────────────────────────────────────────

function Accordion({ icon, label, defaultOpen = false, children }: {
    icon: string;
    label: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(defaultOpen);
    const chevronMotion = useMotionEffect('press');
    const contentStyle = useMotionState(open, 'fadeUp', 'fadeUp');

    return (
        <div className="flex min-h-0 flex-col border-t">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
                <span className="flex items-center gap-2">
                    <Icon name={icon} size={14} />
                    {label}
                </span>
                <Icon
                    name="chevron-down"
                    size={14}
                    className="text-muted-foreground"
                    style={{
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: chevronMotion.transitionValue,
                    }}
                />
            </button>
            <div className={open ? "min-h-0 flex-1 overflow-hidden" : "hidden"} style={contentStyle}>
                {children}
            </div>
        </div>
    );
}

// ── PlaygroundDrawer ──────────────────────────────────────────────────────────

interface PlaygroundDrawerProps {
    title: string;
    config: PlaygroundConfig;
    open: boolean;
    onClose: () => void;
}

export default function PlaygroundDrawer({ title, config, open, onClose }: PlaygroundDrawerProps) {
    const [props, setProps] = useState<Record<string, any>>(config.defaultProps);
    const [mockSeed, setMockSeed] = useState<Record<string, Record<string, any>>>(config.mockSeed ?? {});
    const [formValues, setFormValues] = useState<Record<string, any> | null>(null);

    // reset when config changes (different page)
    useEffect(() => {
        setProps(config.defaultProps);
        setMockSeed(config.mockSeed ?? {});
        setFormValues(null);
    }, [config]);

    const updateProp = (name: string, value: any) => {
        setProps((prev) => ({ ...prev, [name]: value }));
    };

    const controlledProps = config.props.filter((p) => p.control !== undefined);
    const visibleProps = (subset: PropDef[]) => subset.filter((p) => !p.hidden?.(props));
    const propGroups = controlledProps.reduce<Array<{ name: string; props: PropDef[] }>>((groups, prop) => {
        const name = prop.group || 'Props';
        const existing = groups.find((group) => group.name === name);
        if (existing) {
            existing.props.push(prop);
        } else {
            groups.push({ name, props: [prop] });
        }
        return groups;
    }, []);
    const hasPropGroups = propGroups.length > 1 || propGroups.some((group) => group.name !== 'Props');
    const hasMock = config.mockSeed !== undefined;

    const header = (
        <div className="flex items-center gap-2 min-w-0">
            <Icon name="play" size={15} className="text-primary shrink-0" />
            <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold leading-none">Playground</h3>
                <div className="mt-1 truncate text-sm text-muted-foreground">{title}</div>
            </div>
        </div>
    );

    if (!open) return null;

    const rendered = config.render(props, setFormValues);
    const preview = hasMock
        ? <WithMock seed={mockSeed}>{rendered}</WithMock>
        : rendered;

    const SIZES = ['md', 'lg', 'xl', 'fullscreen'] as const;
    const size = SIZES.includes(config.size as any) ? config.size! : 'md';
    const splitLayout = config.layout === 'split';

    return (
        <Modal
            position="right"
            size={size}
            header={header}
            onClose={onClose}
            closeOnBackdrop
            buttonFullscreen={false}
            headerClass="h-14 !py-0 px-4"
            bodyClass="min-h-0 flex-1 overflow-hidden p-4"
            footer={false}
        >
            <div className={splitLayout ? "grid h-full min-h-0 -m-4 lg:grid-cols-[minmax(20rem,26rem)_1fr]" : "flex flex-col h-full -m-4"}>

                {/* Controls section — scrollable */}
                {controlledProps.length > 0 && (
                    <div className={splitLayout ? "min-h-0 overflow-y-auto border-b px-4 pb-3 pt-4 space-y-3 lg:border-b-0 lg:border-r" : "px-4 pt-4 pb-3 border-b space-y-3 overflow-y-auto flex-1 min-h-0"}>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Props</p>
                        {hasPropGroups
                            ? propGroups.map((group, index) => {
                                const visible = visibleProps(group.props);
                                if (visible.length === 0) return null;
                                return (
                                    <Accordion key={group.name} icon="settings" label={group.name} defaultOpen={index === 0}>
                                        <div className="space-y-3 px-1 py-3">
                                            {visible.map((p) => (
                                                <PropControl key={p.name} def={p} value={props[p.name]} onChange={(v) => updateProp(p.name, v)} />
                                            ))}
                                        </div>
                                    </Accordion>
                                );
                            })
                            : visibleProps(controlledProps).map((p) => (
                                <PropControl key={p.name} def={p} value={props[p.name]} onChange={(v) => updateProp(p.name, v)} />
                            ))}
                    </div>
                )}

                {/* Fixed bottom area — always visible */}
                <div className={splitLayout ? "flex min-h-0 flex-col overflow-hidden" : "shrink-0"}>
                    {/* Preview accordion — open by default */}
                    <Accordion icon="eye" label="Preview" defaultOpen>
                            <div className={splitLayout ? "h-full min-h-0 overflow-auto px-5 pb-5 pt-3" : "min-h-72 overflow-auto px-4 pb-4 pt-2 pr-8"}>
                                <div className="min-w-0">
                                    {preview}
                                </div>
                            </div>
                    </Accordion>

                    {/* Form record JSON accordion — only for form-field components */}
                    {config.showFormRecord && (
                        <Accordion icon="code" label="Form record (JSON)" defaultOpen>
                            <div className="px-4 pb-4">
                                <pre className="w-full rounded-md border border-border bg-muted font-mono text-xs px-3 py-2 text-foreground overflow-x-auto whitespace-pre-wrap break-all">
                                    {formValues !== null ? JSON.stringify(formValues, null, 2) : '— interact with the preview to see the record —'}
                                </pre>
                            </div>
                        </Accordion>
                    )}

                    {/* Mock DB editor */}
                    {hasMock && (
                        <MockDbEditor seed={mockSeed} onApply={setMockSeed} />
                    )}
                </div>
            </div>
        </Modal>
    );
}
