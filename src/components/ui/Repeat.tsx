import React, { useMemo } from 'react';
import { ActionButton } from './Buttons';
import { FieldOnChange, setFormFieldsName, useFormContext } from '../widgets/Form';
import { Col, Row } from './GridSystem';
import { RecordProps } from '../../providers/data/DataProvider';

interface RepeatProps {
    name: string;
    children: React.ReactNode | ((record: RecordProps) => React.ReactNode);
    value?: RecordProps[];
    onChange?: FieldOnChange;
    onAdd?: (value: RecordProps[]) => void;
    onRemove?: (index: number) => void;
    className?: string;
    layout?: 'vertical' | 'horizontal' | 'inline';
    minItems?: number;
    maxItems?: number;
    label?: string;
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
    readOnly = false,
}: RepeatProps) => {
    const { value, handleChange } = useFormContext({ name, onChange });
    const records = Array.isArray(value) ? value as RecordProps[] : [];

    const renderChildren = (index: number, wrapperClassName?: string) => {
        return setFormFieldsName({
            children: typeof children === 'function'
                ? children({ record: records[index], records, index: index })
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
            return <Row className="mb-1">
                <Col className='min-w-0'>
                    {renderChildren(index)}
                </Col>
                {canRemove && (
                    <Col xs='auto' className='flex items-center justify-end'>
                        <ActionButton
                            className="h-7 w-7 rounded-md bg-transparent p-0 text-muted-foreground hover:bg-accent hover:text-foreground"
                            icon="x"
                            onClick={() => handleRemove(index)}
                        />
                    </Col>
                )}
            </Row>
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
            return <ActionButton
                icon='plus'
                label={label ? undefined : 'Add'}
                variant={label ? 'link' : 'secondary'}
                className={label ? 'h-7 w-7 rounded-md p-0' : undefined}
                onClick={handleAdd}
            />
        }
        return null;
    }, [readOnly, maxItems, components.length]);

    return (
        <div className={className}>
            {label && (
            <div className='flex items-center justify-between mb-2'>
                <span className='text-sm font-medium text-foreground'>{label}</span>
                {addButton}
            </div>
        )}
            {components}
            {!label && addButton}
        </div>
    );
};

export default Repeat;
