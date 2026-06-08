import React from "react";
import { FieldFactory, FieldRenderProps } from "../components/Component";
import {
    InputProps,
    Checkbox,
    Date,
    DateTime,
    Email,
    Number,
    String,
    Switch,
    TextArea,
    Time, TextAreaProps, CheckboxProps,
    Password,
    Color,
    Week,
    Month
} from "../components/ui/fields/Input";
import {Autocomplete, Checklist, Select, SelectProps} from "../components/ui/fields/Select";
import {ImageUrl, ImageUrlProps} from "../components/ui/fields/ImageUrl";
import {UploadDocument, UploadDocumentProps, UploadImage, UploadImageProps} from "../components/ui/fields/Upload";
import { Prompt, PromptProps } from "../components/widgets/Prompt";

export interface ComponentFormFieldsMap {
    string: FieldFactory<Partial<InputProps>>;
    number: FieldFactory<Partial<InputProps>>;
    email: FieldFactory<Partial<InputProps>>;
    password: FieldFactory<Partial<InputProps>>;
    color: FieldFactory<Partial<InputProps>>;
    date: FieldFactory<Partial<InputProps>>;
    time: FieldFactory<Partial<InputProps>>;
    datetime: FieldFactory<Partial<InputProps>>;
    week: FieldFactory<Partial<InputProps>>;
    month: FieldFactory<Partial<InputProps>>;
    textarea: FieldFactory<Partial<TextAreaProps>>;
    checkbox: FieldFactory<Partial<CheckboxProps>>;
    switch: FieldFactory<Partial<CheckboxProps>>;
    select: FieldFactory<Partial<SelectProps>>;
    autocomplete: FieldFactory<Partial<SelectProps>>;
    checklist: FieldFactory<Partial<SelectProps>>;
    uploadImage: FieldFactory<Partial<UploadImageProps>>;
    uploadDocument: FieldFactory<Partial<UploadDocumentProps>>;
    prompt: FieldFactory<Partial<PromptProps>>;
    imageUrl: FieldFactory<Partial<ImageUrlProps>>;
    menu: FieldFactory<{ defaultValue?: string }>;
}

const componentFormFields: ComponentFormFieldsMap = {
    string: (props = {}) => ({
        __props: props,
        getDefaults: (name) => ({[name]: props.defaultValue}),
        render: ({name, label, ...rest} = {} as FieldRenderProps) => <String key={name ?? props.name} name={(name ?? props.name) as string} label={label ?? props.label ?? name} {...props} {...rest} />
    }),
    number: (props = {}) => ({
        __props: props,
        getDefaults: (name) => ({[name]: props.defaultValue}),
        render: ({name, label, ...rest} = {} as FieldRenderProps) => <Number key={name ?? props.name} name={(name ?? props.name) as string} label={label ?? props.label ?? name} {...props} {...rest} />
    }),
    email: (props = {}) => ({
        __props: props,
        getDefaults: (name) => ({[name]: props.defaultValue}),
        render: ({name, label, ...rest} = {} as FieldRenderProps) => <Email key={name ?? props.name} name={(name ?? props.name) as string} label={label ?? props.label ?? name} {...props} {...rest} />
    }),
    password: (props = {}) => ({
        __props: props,
        getDefaults: (name) => ({[name]: props.defaultValue}),
        render: ({name, label, ...rest} = {} as FieldRenderProps) => <Password key={name ?? props.name} name={(name ?? props.name) as string} label={label ?? props.label ?? name} {...props} {...rest} />
    }),
    color: (props = {}) => ({
        __props: props,
        getDefaults: (name) => ({[name]: props.defaultValue}),
        render: ({name, label, ...rest} = {} as FieldRenderProps) => <Color key={name ?? props.name} name={(name ?? props.name) as string} label={label ?? props.label ?? name} {...props} {...rest} />
    }),
    date: (props = {}) => ({
        __props: props,
        getDefaults: (name) => ({[name]: props.defaultValue}),
        render: ({name, label, ...rest} = {} as FieldRenderProps) => <Date key={name ?? props.name} name={(name ?? props.name) as string} label={label ?? props.label ?? name} {...props} {...rest} />
    }),
    time: (props = {}) => ({
        __props: props,
        getDefaults: (name) => ({[name]: props.defaultValue}),
        render: ({name, label, ...rest} = {} as FieldRenderProps) => <Time key={name ?? props.name} name={(name ?? props.name) as string} label={label ?? props.label ?? name} {...props} {...rest} />
    }),
    datetime: (props = {}) => ({
        __props: props,
        getDefaults: (name) => ({ [name]: props.defaultValue }),
        render: ({name, label, ...rest} = {} as FieldRenderProps) => <DateTime key={name ?? props.name} name={(name ?? props.name) as string} label={label ?? props.label ?? name} {...props} {...rest} />
    }),
    week: (props = {}) => ({
        __props: props,
        getDefaults: (name) => ({ [name]: props.defaultValue }),
        render: ({name, label, ...rest} = {} as FieldRenderProps) => <Week key={name ?? props.name} name={(name ?? props.name) as string} label={label ?? props.label ?? name} {...props} {...rest} />
    }),
    month: (props = {}) => ({
        __props: props,
        getDefaults: (name) => ({ [name]: props.defaultValue }),
        render: ({name, label, ...rest} = {} as FieldRenderProps) => <Month key={name ?? props.name} name={(name ?? props.name) as string} label={label ?? props.label ?? name} {...props} {...rest} />
    }),
    textarea: (props = {}) => ({
        __props: props,
        getDefaults: (name) => ({[name]: props.defaultValue}),
        render: ({name, label, ...rest} = {} as FieldRenderProps) => <TextArea key={name ?? props.name} name={(name ?? props.name) as string} label={label ?? props.label ?? name} {...props} {...rest} />
    }),
    checkbox: (props = {}) => ({
        __props: props,
        getDefaults: (name) => ({[name]: props.defaultValue}),
        render: ({name, label, ...rest} = {} as FieldRenderProps) => <Checkbox key={name ?? props.name} name={(name ?? props.name) as string} label={label ?? props.label ?? name} {...props} {...rest} />
    }),
    switch: (props = {}) => ({
        __props: props,
        getDefaults: (name) => ({[name]: props.defaultValue}),
        render: ({name, label, ...rest} = {} as FieldRenderProps) => <Switch key={name ?? props.name} name={(name ?? props.name) as string} label={label ?? props.label ?? name} {...props} {...rest} />
    }),
    select: (props = {}) => ({
        __props: props,
        getDefaults: (name) => ({[name]: props.defaultValue}),
        render: ({name, label, ...rest} = {} as FieldRenderProps) => <Select key={name ?? props.name} name={(name ?? props.name) as string} label={label ?? props.label ?? name} {...props} {...rest} />
    }),
    autocomplete: (props = {}) => ({
        __props: props,
        getDefaults: (name) => ({[name]: props.defaultValue}),
        render: ({name, label, ...rest} = {} as FieldRenderProps) => <Autocomplete key={name ?? props.name} name={(name ?? props.name) as string} label={label ?? props.label ?? name} {...props} {...rest} />
    }),
    checklist: (props = {}) => ({
        __props: props,
        getDefaults: (name) => ({[name]: props.defaultValue}),
        render: ({name, label, ...rest} = {} as FieldRenderProps) => <Checklist key={name ?? props.name} name={(name ?? props.name) as string} label={label ?? props.label ?? name} {...props} {...rest} />
    }),
    uploadImage: (props = {}) => ({
        __props: props,
        getDefaults: (name) => ({[name]: props.defaultValue}),
        render: ({name, label, ...rest} = {} as FieldRenderProps) => <UploadImage key={name ?? props.name} name={(name ?? props.name) as string} label={label ?? props.label ?? name} {...props} {...rest} />
    }),
    uploadDocument: (props = {}) => ({
        __props: props,
        getDefaults: (name) => ({[name]: props.defaultValue}),
        render: ({name, label, ...rest} = {} as FieldRenderProps) => <UploadDocument key={name ?? props.name} name={(name ?? props.name) as string} label={label ?? props.label ?? name} {...props} {...rest} />
    }),
    prompt: (props = {}) => ({
        __props: props,
        getDefaults: (name) => ({[name]: props.defaultValue}),
        render: ({name, label, ...rest} = {} as FieldRenderProps) => <Prompt key={name ?? props.name} name={(name ?? props.name) as string} label={label ?? props.label ?? name} {...props} {...rest} />
    }),
    imageUrl: (props = {}) => {
        return {
            __props: props,
            getDefaults: (name) => ({[name]: props.defaultValue}),
            render: ({name, label, ...rest} = {} as FieldRenderProps) => <ImageUrl name={(name ?? props.name) as string} label={label ?? name} {...props} {...rest} />
        }
    },
    menu: (props = {}) => ({
        __props: props,
        getDefaults: (name) => ({[name]: props.defaultValue}),
        render: ({name, label, ...rest} = {} as FieldRenderProps) => <Select key={name} name={name as string} label={label ?? name} {...props} {...rest} />
    })
};

export default componentFormFields;
