import React, { useMemo } from 'react';
import { ActionButton } from './Buttons';
import { FieldOnChange, setFormFieldsName, useFormContext } from '../widgets/Form';
import { RecordProps } from '../../providers/data/DataProvider';
import { cn } from '../../libs/cn';

export interface RepeatCallbackArgs {
    record: RecordProps;
    records: RecordProps[];
    index: number;
    remove: () => void;
}

interface RepeatProps {
    name: string;
    children: React.ReactNode | ((args: RepeatCallbackArgs) => React.ReactNode);
    value?: RecordProps[];
    onChange?: FieldOnChange;
    onAdd?: (value: RecordProps[]) => void;
    onRemove?: (index: number) => void;
    className?: string;
    layout?: 'vertical' | 'horizontal' | 'inline';
    minItems?: number;
    maxItems?: number;
    label?: string;
    labelPosition?: 'top' | 'bottom';
    hideRemoveButton?: boolean;
    readOnly?: boolean;
}

const itemShellClass = "rounded-xl border border-border/60 bg-card/80 shadow-sm";
const itemHeaderClass = "flex items-center justify-between gap-3 border-b border-border/50 px-3 py-2";
const itemIndexClass = "text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground";
const itemBodyClass = "px-3 py-3";
const removeButtonClass = "h-7 w-7 rounded-md bg-transparent p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive";

const Repeat = ({
    name,
    children,
    //value = undefined,
    onChange,
    onAdd,
    onRemove,
    className,
    layout = 'horizontal',
    minItems = undefined,
    maxItems = undefined,
    label = undefined,
    labelPosition = 'top',
    hideRemoveButton = false,
    readOnly = false,
}: RepeatProps) => {
    const { value, handleChange } = useFormContext({ name, onChange });
    const records = Array.isArray(value) ? value as RecordProps[] : [];

    const renderChildren = (index: number, wrapperClassName?: string) => {
        return setFormFieldsName({
            children: typeof children === 'function'
                ? children({ record: records[index], records, index, remove: () => handleRemove(index) })
                : children,
            parentName: `${name}.${index}`,
            wrapperClassName
        })
    }
    const renderLayout = (index: number, canRemove: boolean) => {
        switch (layout) {
            case 'horizontal':
                return (
                    <div className={itemShellClass}>
                        <div className={itemHeaderClass}>
                            <span className={itemIndexClass}>#{index + 1}</span>
                            {canRemove && !hideRemoveButton ? (
                                <ActionButton
                                    className={removeButtonClass}
                                    icon="x"
                                    onClick={() => handleRemove(index)}
                                />
                            ) : <span className="h-7 w-7" aria-hidden="true" />}
                        </div>
                        <div className={itemBodyClass}>
                            {renderChildren(index)}
                        </div>
                    </div>
                );
            case 'vertical':
                return <></>
            case 'inline':
                return (
                    <div className={cn(itemShellClass, "px-3 py-2")}>
                        <div className="flex items-start gap-2">
                            <div className="flex-1 min-w-0">
                                {renderChildren(index, '!mb-0')}
                            </div>
                            {canRemove && !hideRemoveButton && (
                                <ActionButton
                                    className={cn(removeButtonClass, "mt-1 shrink-0")}
                                    icon="x"
                                    onClick={() => handleRemove(index)}
                                />
                            )}
                        </div>
                    </div>
                )
        }
    }


    const components = (records.length > 0 ? records : Array.from({ length: minItems || 0 }, () => ({}) as RecordProps))?.map((_, index) => {
        const canRemove = !readOnly && index >= (minItems || 0);

        return (
            <React.Fragment key={`${name}-${index}`}>
                {renderLayout(index, canRemove)}
            </React.Fragment>
        );
    });

    const handleAdd = () => {
        const next: RecordProps[] = records.length > 0
            ? [...records, {}]
            : Array.from({ length: components.length + 1 }, () => ({}));
        onAdd?.(next);
        handleChange({ target: { name: `${name}.${next.length - 1}`, value: {} } });
    };

    const handleRemove = (index: number) => {
        onRemove?.(index);
        handleChange({ target: { name: `${name}.${index}` } });
    };

    const addButton = useMemo(() => {
        if (readOnly) return null;
        if (!maxItems || components.length < maxItems) {
            if (label && labelPosition === 'bottom') {
                return (
                    <ActionButton
                        icon='plus'
                        label={label}
                        variant='link'
                        className="w-full justify-start gap-1 rounded-lg border border-dashed border-border/60 px-3 py-2 text-sm text-muted-foreground hover:border-border hover:bg-muted/40 hover:text-foreground"
                        onClick={handleAdd}
                    />
                );
            }
            return <ActionButton
                icon='plus'
                label={label ? undefined : 'Add'}
                variant={label ? 'link' : 'secondary'}
                className={label ? 'h-8 w-8 rounded-lg p-0 text-muted-foreground hover:bg-muted/50 hover:text-foreground' : undefined}
                onClick={handleAdd}
            />
        }
        return null;
    }, [readOnly, maxItems, components.length, label, labelPosition]);

    return (
        <div className={cn("space-y-3", className)}>
            {label && labelPosition === 'top' && (
                <div className='flex items-center justify-between gap-3'>
                    <span className='text-sm font-medium text-foreground'>{label}</span>
                    {addButton}
                </div>
            )}
            {components}
            {!label && addButton}
            {label && labelPosition === 'bottom' && addButton}
        </div>
    );
};

export default Repeat;
