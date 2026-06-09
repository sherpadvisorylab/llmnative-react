import React from 'react';
import PresetTextareaControl from './PresetTextareaControl';
import { usePlaygroundContext } from './PlaygroundProvider';
import type { PropDef } from './playground.types';

const BASE_INPUT = 'w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring';

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

function IconPickerControl({ value, onChange }: { value: boolean | string; onChange: (v: boolean | string) => void }) {
    const { environment } = usePlaygroundContext();
    const Icon = environment.Icon;
    const hasIcon = value !== false;
    const selectValue = value === true ? '__auto__' : (typeof value === 'string' ? value : '__auto__');

    return (
        <div className="space-y-2">
            <label className="flex cursor-pointer items-center gap-2">
                <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border accent-primary"
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
                                const next = e.target.value;
                                onChange(next === '__auto__' ? true : next);
                            }}
                        >
                            <option value="__auto__">Auto (default for type)</option>
                            {PLAYGROUND_ICONS.map((name) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                        <Icon name="chevron-down" size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <div className="flex w-6 shrink-0 items-center justify-center text-foreground">
                        {typeof value === 'string' && value
                            ? <Icon name={value} size={18} />
                            : <span className="text-xs italic text-muted-foreground">auto</span>}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function PlaygroundPropControl({
    def,
    value,
    onChange,
}: {
    def: PropDef;
    value: any;
    onChange: (value: any) => void;
}) {
    const { environment } = usePlaygroundContext();
    const Icon = environment.Icon;
    const inputClass = def.readOnly
        ? `${BASE_INPUT} bg-muted text-muted-foreground cursor-not-allowed`
        : BASE_INPUT;

    return (
        <div className="flex items-start gap-3">
            <div className="w-44 shrink-0 pt-1.5">
                <span className="font-mono text-xs text-foreground">{def.name}</span>
                {def.required && <span className="ml-1 text-xs text-destructive">*</span>}
            </div>
            <div className="min-w-0 flex-1">
                {def.control === 'boolean' && (
                    <label className="flex cursor-pointer items-center gap-2">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-border accent-primary"
                            checked={!!value}
                            disabled={def.readOnly}
                            onChange={(e) => onChange(e.target.checked)}
                        />
                        <span className="text-xs text-muted-foreground">{value ? 'true' : 'false'}</span>
                    </label>
                )}
                {def.control === 'text' && (
                    <>
                        {def.suggestions && (
                            <datalist id={`dl-${def.name}`}>
                                {def.suggestions.map((s) => <option key={s} value={s} />)}
                            </datalist>
                        )}
                        <input
                            type="text"
                            className={inputClass}
                            value={value ?? ''}
                            readOnly={def.readOnly}
                            list={def.suggestions ? `dl-${def.name}` : undefined}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    </>
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
                        <span className="w-8 text-right text-xs text-muted-foreground">{value}</span>
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
                            {def.options?.map((option) => (
                                <option key={option} value={option}>{option || '(none)'}</option>
                            ))}
                        </select>
                        <Icon name="chevron-down" size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                )}
                {def.control === 'textarea' && (
                    def.shortcuts?.length || def.textareaMode === 'json' || def.validationMessage || def.placeholder ? (
                        <PresetTextareaControl
                            value={value}
                            readOnly={def.readOnly}
                            inputClassName={`${inputClass} resize-y`}
                            mode={def.textareaMode ?? 'text'}
                            rows={def.rows ?? 3}
                            placeholder={def.placeholder}
                            validationMessage={def.validationMessage}
                            shortcuts={def.shortcuts}
                            onChange={onChange}
                        />
                    ) : (
                        <textarea
                            className={`${inputClass} resize-y`}
                            value={typeof value === 'string' ? value : (value ?? '')}
                            rows={def.rows ?? 3}
                            readOnly={def.readOnly}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    )
                )}
                {def.control === 'json' && (
                    <PresetTextareaControl
                        value={value}
                        readOnly={def.readOnly}
                        inputClassName={`${inputClass} resize-y font-mono text-xs`}
                        mode="json"
                        rows={def.rows ?? 4}
                        placeholder={def.placeholder}
                        validationMessage={def.validationMessage}
                        shortcuts={def.shortcuts}
                        onChange={onChange}
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
