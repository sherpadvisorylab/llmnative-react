import React from 'react';
import type { PropShortcut } from './playground.types';

type PresetTextareaControlProps = {
    value: unknown;
    readOnly?: boolean;
    inputClassName: string;
    mode?: 'text' | 'json';
    rows?: number;
    placeholder?: string;
    validationMessage?: string;
    shortcuts?: PropShortcut[];
    onChange: (value: unknown) => void;
};

function toRawText(value: unknown, mode: 'text' | 'json'): string {
    if (mode !== 'json') {
        if (value == null) return '';
        if (Array.isArray(value)) return JSON.stringify(value);
        return String(value);
    }
    if (value == null) return '';
    if (typeof value === 'string') return value;
    return JSON.stringify(value, null, 2);
}

export default function PresetTextareaControl({
    value,
    readOnly = false,
    inputClassName,
    mode = 'text',
    rows = 4,
    placeholder,
    validationMessage,
    shortcuts,
    onChange,
}: PresetTextareaControlProps) {
    const [rawText, setRawText] = React.useState(() => toRawText(value, mode));
    const isFocusedRef = React.useRef(false);
    const externalKey = React.useMemo(() => {
        try { return JSON.stringify(value); } catch { return String(value); }
    }, [value]);
    const prevKeyRef = React.useRef(externalKey);

    React.useEffect(() => {
        if (prevKeyRef.current === externalKey) return;
        prevKeyRef.current = externalKey;
        if (!isFocusedRef.current) {
            setRawText(toRawText(value, mode));
        }
    }, [externalKey, mode, value]);

    const isInvalid = React.useMemo(() => {
        if (mode !== 'json' || readOnly) return false;
        const trimmed = rawText.trim();
        if (trimmed === '' || trimmed === '{}' || trimmed === '[]') return false;
        // Plain strings (not objects/arrays) are valid as-is
        if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return false;
        try { JSON.parse(trimmed); return false; } catch { return true; }
    }, [mode, readOnly, rawText]);

    return (
        <div className="space-y-1">
            <textarea
                className={`${inputClassName}${isInvalid ? ' border-destructive' : ''}`}
                rows={rows}
                value={rawText}
                readOnly={readOnly}
                spellCheck={false}
                placeholder={placeholder}
                onFocus={() => { isFocusedRef.current = true; }}
                onBlur={() => { isFocusedRef.current = false; }}
                onChange={(e) => {
                    const next = e.target.value;
                    setRawText(next);
                    if (mode === 'json') {
                        try { onChange(JSON.parse(next)); } catch { onChange(next); }
                        return;
                    }
                    onChange(next);
                }}
            />
            {shortcuts && shortcuts.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {shortcuts.map((shortcut) => (
                        <button
                            key={shortcut.label}
                            type="button"
                            className="rounded border border-border px-2 py-1 text-[11px] font-medium leading-none text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={readOnly}
                            title={shortcut.help}
                            onClick={() => onChange(shortcut.value)}
                        >
                            {shortcut.label}
                        </button>
                    ))}
                </div>
            )}
            {isInvalid && (
                <p className="text-xs text-destructive">
                    {validationMessage ?? 'Invalid JSON - keys must be quoted: {"key":"value"}'}
                </p>
            )}
        </div>
    );
}
