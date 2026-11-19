import React, { useId, useMemo, useState } from 'react';
import { useI18n } from '../../../I18n';
import { Label, FieldError, fieldFeedbackClass } from './Input';
import { Wrapper } from '../GridSystem';
import Modal from '../Modal';
import Icon from '../Icon';
import { useIconProvider } from '../../../providers/icon/IconProviderContext';
import { FormFieldProps, useFormContext, useFieldValidation } from '../../widgets/Form';
import type { FieldValue } from '../../../providers/data/DataProvider';
import { cn } from '../../../libs/cn';

/** How many icons the grid draws at most: a search narrows the rest. */
const MAX_SHOWN = 240;

export interface IconPickerProps extends FormFieldProps {
    /** Only these icon names can be chosen (in this order); without it, every icon of the active provider. */
    options?: string[];
    /** Names that cannot be chosen (e.g. those already taken by other records). The current value stays choosable. */
    exclude?: string[];
    /** Words that find an icon besides its name, by name (e.g. `{ landmark: 'bank' }`). */
    keywords?: Record<string, string>;
    /** Title of the modal. */
    modalTitle?: React.ReactNode;
    /** Lets the value be emptied ("No icon"). */
    clearable?: boolean;
    disabled?: boolean;
    feedback?: string;
    validator?: (value: FieldValue) => string | undefined | Promise<string | undefined>;
    /** Class of the button that shows the current icon. */
    className?: string;
    /** Only the button, without the name and the link beside it (its name in the tooltip): e.g. the icon in the title of a page. */
    compact?: boolean;
    /** Size of the icon in the button, in pixels (default 26). */
    iconSize?: number;
}

const searchable = (value: string) => value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * IconPicker (CR-148): the field of an icon name. A button shows the current icon; a click opens a modal with a
 * search box on top, the grid of the icons of the active icon provider (lucide, phosphor or one of the app) and Save
 * in the footer. The stored value is the icon name, as `<Icon name>` takes it.
 */
export const IconPicker = ({
    name,
    label = undefined,
    required = false,
    disabled = false,
    defaultValue = undefined,
    onChange = undefined,
    inheritWrapperClassName = true,
    wrapperClassName = undefined,
    className = undefined,
    options = undefined,
    exclude = undefined,
    keywords = undefined,
    modalTitle = undefined,
    clearable = false,
    feedback = undefined,
    validator = undefined,
    compact = false,
    iconSize = 26,
}: IconPickerProps) => {
    const { value, handleChange, formWrapClass } = useFormContext({ name, onChange, wrapperClassName, defaultValue, inheritWrapperClassName });
    const error = useFieldValidation(name, { required, label, validator });
    const dict = useI18n('iconPicker');
    const provider = useIconProvider();
    const id = useId();
    const current = typeof value === 'string' ? value : '';

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [chosen, setChosen] = useState(current);

    const all = useMemo(() => {
        const names = options ?? provider?.list?.() ?? [];
        const out = new Set(exclude ?? []);
        return names.filter((n) => n === current || !out.has(n));
    }, [options, provider, exclude, current]);

    const matches = useMemo(() => {
        const needle = searchable(query.trim());
        if (!needle) return all;
        return all.filter((n) => searchable(n.replace(/-/g, ' ')).includes(needle) || searchable(n).includes(needle) || (keywords?.[n] ? searchable(keywords[n]).includes(needle) : false));
    }, [all, query, keywords]);
    const shown = matches.slice(0, MAX_SHOWN);

    const openPicker = () => {
        if (disabled) return;
        setChosen(current);
        setQuery('');
        setOpen(true);
    };

    return (
        <Wrapper className={formWrapClass}>
            {label && <Label label={label} required={required} htmlFor={id} />}
            <div className="flex items-center gap-3">
                <button
                    id={id}
                    type="button"
                    disabled={disabled}
                    onClick={openPicker}
                    title={compact && current ? `${current} · ${dict.change}` : dict.choose}
                    aria-label={current ? `${dict.choose}: ${current}` : dict.choose}
                    className={cn(
                        'group flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-input bg-primary/10 text-primary transition-colors hover:border-primary hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                        error && 'border-destructive',
                        className,
                    )}
                >
                    {current ? <Icon name={current} size={iconSize} /> : <Icon name="plus" size={Math.round(iconSize * 0.8)} className="opacity-60" />}
                </button>
                {!compact && (
                    <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium">{current || dict.none}</span>
                        {!disabled && <button type="button" onClick={openPicker} className="self-start text-xs text-primary underline-offset-4 hover:underline">{current ? dict.change : dict.choose}</button>}
                    </div>
                )}
            </div>
            {error
                ? <FieldError message={error} />
                : feedback && <div className={fieldFeedbackClass}>{feedback}</div>}

            {open && (
                <Modal
                    title={modalTitle ?? dict.title}
                    size="lg"
                    onClose={() => setOpen(false)}
                    onSave={async () => {
                        handleChange({ target: { name, value: chosen } });
                        return true;
                    }}
                >
                    <div className="flex flex-col gap-3">
                        <div className="sticky top-0 z-10 -mx-1 bg-background px-1 pb-1">
                            <div className="relative">
                                <Icon name="search" size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="search"
                                    autoFocus
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder={dict.searchPlaceholder}
                                    aria-label={dict.searchPlaceholder}
                                    className="h-10 w-full rounded-md border border-input bg-background ps-9 pe-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground" aria-live="polite">
                                {matches.length > MAX_SHOWN
                                    ? dict.tooMany.replace('{shown}', String(MAX_SHOWN)).replace('{total}', String(matches.length))
                                    : dict.count.replace('{total}', String(matches.length))}
                            </p>
                        </div>
                        {shown.length === 0
                            ? <p className="py-6 text-center text-sm text-muted-foreground">{dict.noResults}</p>
                            : (
                                <div role="listbox" aria-label={dict.title} className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2">
                                    {clearable && !query && (
                                        <button type="button" role="option" aria-selected={!chosen} onClick={() => setChosen('')}
                                            className={cn('flex flex-col items-center gap-1 rounded-lg border p-2 text-[11px] text-muted-foreground transition-colors hover:bg-muted', !chosen ? 'border-primary bg-primary/10 text-primary' : 'border-border')}>
                                            <Icon name="ban" size={22} />
                                            <span className="w-full truncate text-center">{dict.none}</span>
                                        </button>
                                    )}
                                    {shown.map((n) => (
                                        <button key={n} type="button" role="option" aria-selected={chosen === n} title={n}
                                            onClick={() => setChosen(n)} onDoubleClick={() => { handleChange({ target: { name, value: n } }); setOpen(false); }}
                                            className={cn('flex flex-col items-center gap-1 rounded-lg border p-2 text-[11px] transition-colors hover:bg-muted', chosen === n ? 'border-primary bg-primary/10 text-primary' : 'border-border text-foreground')}>
                                            <Icon name={n} size={22} />
                                            <span className="w-full truncate text-center text-muted-foreground">{n}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                    </div>
                </Modal>
            )}
        </Wrapper>
    );
};
