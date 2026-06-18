import React, { useMemo, useState } from 'react';
import { ActionButton } from "../ui/Buttons";
import {converter} from "../../libs/converter";
import { getTabLayoutConfig, getTabPaneClassName, getTabTriggerClassName, TabLayouts, TabPosition } from '../ui/Tab';
import { FieldOnChange, setFormFieldsName, useFormContext } from './Form';
import { RecordProps } from '../../providers/data/DataProvider';

interface TabDynamicProps {
    children: React.ReactNode | ((record: RecordProps) => React.ReactNode);
    name: string;
    onChange?: FieldOnChange;
    onAdd?: (value: RecordProps[]) => void;
    onRemove?: (index: number) => void;
    value?: RecordProps[];
    label?: string;
    min?: number;
    max?: number;
    activeIndex?: number;
    title?: string;
    readOnly?: boolean;
    tabPosition?: TabPosition;
}

const TabDynamic = ({
                 children,
                 name,
                 onChange       = undefined,
                 onAdd          = undefined,
                 onRemove       = undefined,
                 //value          = undefined,
                 label          = "Tab",
                 min            = 1,
                 max            = undefined,
                 activeIndex    = 0,
                 title          = undefined,
                 readOnly       = false,
                 tabPosition    = "default"
}: TabDynamicProps) => {
    const { value, handleChange } = useFormContext({name, onChange});
    const records = Array.isArray(value) ? value as RecordProps[] : [];

    const [active, setActive] = useState(activeIndex);
    const [release, setRelease] = useState(0);


    const tabs = useMemo(() => {
        return (records.length > 0 ? records : Array.from({ length: min }, () => ({}) as RecordProps))?.map((_, index) => label.includes("{")
        ? converter.parse(records[index] ?? {}, label)
        : label + " " + (index + 1))
    }, [records, label, min, release]);

    const components = typeof children === 'function'
    ? children({record: records[active] ?? {}, records, currentIndex: active})
    : children;

    const component = useMemo(() => {
        return setFormFieldsName({
            children: components,
            parentName: `${name}.${active}`,
            parentKey: `${name}-${active}-${release}`
        });
    }, [active, components, name, release]);


    const handleAdd = () => {
        const next: RecordProps[] = records.length > 0
            ? [...records, {}]
            : Array.from({ length: tabs.length + 1 }, () => ({}));
        onAdd?.(next);
        handleChange({ target: { name: `${name}.${next.length - 1}`, value: {} } });

        setActive(next.length - 1);
        setRelease(prev => prev + 1);
    }

    const handleRemove = (index: number) => {
        const lastIndex = tabs.length - 1;
        onRemove?.(index);
        //setRecords(next);
        handleChange({ target: { name: `${name}.${index}` } });

        if(active >= lastIndex) {
            setActive(prev => prev - 1);
        }
        setRelease(prev => prev + 1);
    }


    
    const TabLayout = TabLayouts[tabPosition];
    const config = getTabLayoutConfig(tabPosition);

    return (
        <div>
            {title && <h3>{title}</h3>}
            <TabLayout
                menu={<>
                    {tabs?.map((label, index) => 
                        <div key={`${name}-${index}`} className={`${config.itemClassName} relative`}>
                            <button
                               type="button"
                               role="tab"
                               aria-selected={index === active}
                               onClick={() => setActive(index)}
                               className={getTabTriggerClassName(tabPosition, index === active, !readOnly && tabs.length - 1 >= min && index === active ? 'pr-9' : undefined)}
                            >
                                {label}
                            </button>
                            {(!readOnly && tabs.length -1 >= min && index === active) &&
                                <ActionButton className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-current opacity-70 hover:opacity-100" icon="x"
                                              onClick={() => handleRemove(index)}/>}
                        </div>
                    )}
                    {!readOnly && (!max || tabs.length < max) && <div key={tabs.length + 1} className={config.itemClassName}>
                        <ActionButton
                            className={getTabTriggerClassName(tabPosition, false, 'border border-dashed border-border/70 justify-center')}
                            icon="plus"
                            title="Add tab"
                            onClick={handleAdd}
                        />
                    </div>}
                </>}
                content={<div className={getTabPaneClassName()}>
                    {component}
                </div>}
            />
        </div>
    );
}

export default TabDynamic;
