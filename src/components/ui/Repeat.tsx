import React, { useMemo } from 'react';
import { ActionButton } from './Buttons';
import { FieldOnChange, setFormFieldsName, useFormContext } from '../widgets/Form';
import { RecordProps } from '../../providers/data/DataProvider';

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
            return <>
                {canRemove && (<div className='flex justify-between pl-1 mb-2'>
                    <h6>#{index + 1}</h6>
                    <ActionButton
                        className="h-6 w-6 rounded-md bg-transparent p-0 text-muted-foreground hover:bg-accent hover:text-foreground"
                        icon="x"
                        onClick={() => handleRemove(index)}
                    />
                </div>)}
                <div className={`pl-2`}>
                    {renderChildren(index)}
                </div>
                <hr className='mb-2' />
            </>
            case 'vertical':
                return <></>
            case 'inline':
            return (
                <div className="flex items-start gap-2 mb-1">
                    <div className="flex-1 min-w-0">
                        {renderChildren(index, '!mb-0')}
                    </div>
                    {canRemove && !hideRemoveButton && (
                        <ActionButton
                            className="shrink-0 mt-1 h-7 w-7 rounded-md bg-transparent p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            icon="x"
                            onClick={() => handleRemove(index)}
                        />
                    )}
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
                        className="w-full justify-start gap-1 text-xs text-muted-foreground hover:text-foreground px-1 h-7"
                        onClick={handleAdd}
                    />
                );
            }
            return <ActionButton
                icon='plus'
                label={label ? undefined : 'Add'}
                variant={label ? 'link' : 'secondary'}
                className={label ? 'h-7 w-7 rounded-md p-0' : undefined}
                onClick={handleAdd}
            />
        }
        return null;
    }, [readOnly, maxItems, components.length, label, labelPosition]);

    return (
        <div className={className}>
            {label && labelPosition === 'top' && (
                <div className='flex items-center justify-between mb-2'>
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
