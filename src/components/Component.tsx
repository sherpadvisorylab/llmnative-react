import React from "react";
import componentLayout from "../types/Layout";
import componentFormFields from "../types/FormFields";
import componentBlock from "../types/Block";
import componentSection from "../types/Section";
import Form  from "./widgets/Form";
import { RecordProps } from "../providers/data/DataProvider";

export interface FieldRenderProps {
    name?: string;
    label?: string;
    onChange?: (value: unknown) => void;
    [key: string]: unknown;
}

type Defaults = Record<string, unknown>;

interface FieldAdapter<TProps = Record<string, unknown>> {
    getDefaults: (name: string) => Defaults;
    render: (props?: FieldRenderProps & TProps) => React.ReactNode;
    __props: TProps;
}

export type FieldFactory<TProps = Record<string, unknown>> = (props?: TProps) => FieldAdapter;

interface ComponentProps {
    [key: string]: unknown;
}

export type ModelProps = {
    [key: string]: FieldAdapter | React.ReactNode | ModelProps;
};

export type FormTree = {
    [key: string]: React.ReactNode | FormTree;
};


export const Component = {
    layout: componentLayout,
    input: componentFormFields,
    block: componentBlock,
    section: componentSection
};


export abstract class ComponentBlock {
    abstract model: ModelProps;
    abstract html(props?: ComponentProps): React.ReactNode;
    abstract form(props?: ComponentProps): React.ReactNode;

    protected verifyRequiredMethods(): void {
        if (!this.model || typeof this.model !== 'object') {
            throw new Error(`[ComponentBlock] Missing property: "model"`);
        }

        for (const method of ['html', 'form'] as const) {
            if (typeof this[method] !== 'function') {
                throw new Error(`[ComponentBlock] Missing method: "${method}()"`);
            }
        }
    }

    static default(this: new () => ComponentBlock, options?: { path?: string }): React.FC {
        const instance = new this();
        instance.verifyRequiredMethods();
        return () => {
            const [fields, defaults] = React.useMemo(() => {
                return buildFormFields(instance.model);
            }, [instance.model]);


            return (
                <Form defaultValues={defaults as RecordProps} path={options?.path}>
                    {instance.form(fields)}
                </Form>
            );
        };
    }
}

function isFieldAdapter(obj: unknown): obj is FieldAdapter {
    if (typeof obj !== 'object' || obj === null) return false;
    const o = obj as Record<string, unknown>;
    return typeof o.render === 'function' && typeof o.getDefaults === 'function';
}

function isComponentBlock(obj: unknown): obj is new () => ComponentBlock {
    return typeof obj === 'function' && (obj as { prototype: unknown }).prototype instanceof ComponentBlock;
}

function isNestedModel(obj: unknown): obj is ModelProps {
    return (
        obj !== null &&
        obj !== undefined &&
        typeof obj === 'object' &&
        !Array.isArray(obj) &&
        !React.isValidElement(obj) &&
        !isFieldAdapter(obj)
    );
}


export function buildFormFields(
    model: ModelProps
): [ FormTree, Defaults ] {
    const fields: FormTree = {};
    const defaults: Defaults = {};

    function setDefaults(obj: Defaults) {
        for (const [k, v] of Object.entries(obj)) {
            defaults[k] = v;
        }
    }

    for (const [name, value] of Object.entries(model)) {
        if (isFieldAdapter(value)) {
            fields[name] = value.render({name});
            setDefaults(value.getDefaults(name));
        } else if (isComponentBlock(value)) {
            const instance = new value();
            const [subFields, subDefaults] = buildFormFields(instance.model);

            fields[name] = instance.form(subFields);
            setDefaults(subDefaults);
        } else if (Array.isArray(value)) {
            console.warn(
                `[buildFormFields] ⚠️ The field "${name}" is defined as an array. ` +
                `It has been automatically converted into an object with generated keys (e.g., "${name}_0"). ` +
                `Consider refactoring your model to use an explicit object instead of an array.`
            );
            const syntheticModel: ModelProps = {};

            value.forEach((item, i) => {
                const itemKey = `${name}_${i}`;
                syntheticModel[itemKey] = item;
            });

            const [subFields, subDefaults] = buildFormFields(syntheticModel);
            setDefaults(subDefaults);

            fields[name] = subFields
        } else if (isNestedModel(value)) {
            const [nestedFields, nestedDefaults] = buildFormFields(value);
            fields[name] = nestedFields;
            setDefaults(nestedDefaults);
        } else {
            fields[name] = value;
        }
    }

    return [ fields, defaults ];
}

export default Component;
