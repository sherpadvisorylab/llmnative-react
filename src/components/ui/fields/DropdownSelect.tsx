import React, { useCallback, useId, useMemo } from 'react';
import { AsyncDropdown } from '../../blocks/Dropdown';
import { useI18n } from '../../../I18n';
import { useTheme } from '../../../Theme';
import { cn } from '../../../libs/cn';
import type { FieldValue } from '../../../providers/data/DataProvider';
import { FormFieldProps, useFieldValidation, useFormContext } from '../../widgets/Form';
import { Wrapper } from '../GridSystem';
import Icon from '../Icon';
import { FieldError, Label, fieldControlBaseClass, fieldFeedbackClass } from './Input';

// CR-136 — a form field to pick one of many options, grouped: the menu of the framework (`AsyncDropdown` with its
// search) with the groups under sticky headers, as the model picker of `Chatbot`. `Select` stays the simple one.

export interface DropdownSelectOption {
    label: string;
    value: string;
    /** Its group: the options are listed under a sticky header per group. */
    group?: string;
    /** More on the right of its row (a price, a region). */
    hint?: React.ReactNode;
}

export interface DropdownSelectProps extends FormFieldProps {
    options: DropdownSelectOption[];
    placeholder?: string;
    searchPlaceholder?: string;
    disabled?: boolean;
    title?: string;
    feedback?: string;
    validator?: (value: FieldValue) => string | undefined;
}

const normalize = (text: string) => text.toLocaleLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export const DropdownSelect = ({
    name,
    label = undefined,
    options,
    placeholder = undefined,
    searchPlaceholder = undefined,
    required = false,
    disabled = false,
    title = undefined,
    feedback = undefined,
    validator = undefined,
    onChange = undefined,
    defaultValue = undefined,
    inheritWrapperClassName = true,
    wrapperClassName = undefined,
    className = undefined,
}: DropdownSelectProps) => {
    const { value, handleChange, formWrapClass } = useFormContext({ name, onChange, wrapperClassName, defaultValue, inheritWrapperClassName });
    const error = useFieldValidation(name, { required, label, validator });
    const theme = useTheme('select');
    const dict = useI18n('select');
    const id = useId();

    const current = value === undefined || value === null ? '' : String(value);
    const chosen = useMemo(() => options.find((option) => option.value === current), [options, current]);
    const loadItems = useCallback(async (query: string) => {
        const needle = normalize(query.trim());
        if (!needle) return options;
        return options.filter((option) => [option.label, option.value, option.group ?? ''].some((text) => normalize(text).includes(needle)));
    }, [options]);

    const trigger = (
        <span className="flex w-full min-w-0 items-center justify-between gap-2" title={title}>
            <span className={cn('truncate', !chosen && !current && 'text-muted-foreground')}>
                {chosen ? (chosen.group ? `${chosen.group} · ${chosen.label}` : chosen.label) : (current || placeholder || dict.placeholder)}
            </span>
            <Icon name="chevron-down" size={14} className="shrink-0 text-muted-foreground" />
        </span>
    );

    return (
        <Wrapper className={formWrapClass || theme.Select.wrapperClassName}>
            {label && <Label label={label} required={required} htmlFor={id} />}
            <div id={id} aria-invalid={Boolean(error) || undefined}>
                {disabled ? (
                    <div className={cn(fieldControlBaseClass, 'items-center opacity-50', className)}>{trigger}</div>
                ) : (
                    <AsyncDropdown<DropdownSelectOption>
                        trigger={trigger}
                        className="relative block w-full text-left"
                        triggerClassName={cn(fieldControlBaseClass, 'items-center text-left', error && 'border-destructive', className || theme.Select.className)}
                        loadItems={loadItems}
                        debounceMs={0}
                        getItemId={(option) => option.value}
                        getItemGroup={(option) => option.group}
                        selectedId={current || null}
                        searchPlaceholder={searchPlaceholder}
                        renderItem={(option) => (
                            <span className="flex w-full min-w-0 items-center justify-between gap-3">
                                <span className="min-w-0 truncate">{option.label}</span>
                                {option.hint !== undefined && <span className="shrink-0 text-xs text-muted-foreground">{option.hint}</span>}
                            </span>
                        )}
                        onSelect={(option) => {
                            handleChange?.({ target: { name, value: option.value } });
                        }}
                    />
                )}
            </div>
            <input type="hidden" name={name} value={current} />
            {error
                ? <FieldError message={error} />
                : feedback && <div className={fieldFeedbackClass}>{feedback}</div>}
        </Wrapper>
    );
};

export default DropdownSelect;
