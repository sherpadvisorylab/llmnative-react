import { FieldFactory } from "../components/Component";
import { InputProps, TextAreaProps, CheckboxProps } from "../components/ui/fields/Input";
import { SelectProps, AutocompleteProps, ChecklistProps } from "../components/ui/fields/Select";
import { UploadImageProps, UploadDocumentProps } from "../components/ui/fields/Upload";
import { ImageFieldProps } from "../components/ui/fields/ImageField";
import componentFormFields from "./FormFields";

type SchemaFields = Record<string, ReturnType<FieldFactory>>;

export interface ComponentFormSchemaMap {
    string:         (overrides?: Partial<InputProps>)          => SchemaFields;
    number:         (overrides?: Partial<InputProps>)          => SchemaFields;
    email:          (overrides?: Partial<InputProps>)          => SchemaFields;
    password:       (overrides?: Partial<InputProps>)          => SchemaFields;
    color:          (overrides?: Partial<InputProps>)          => SchemaFields;
    date:           (overrides?: Partial<InputProps>)          => SchemaFields;
    time:           (overrides?: Partial<InputProps>)          => SchemaFields;
    datetime:       (overrides?: Partial<InputProps>)          => SchemaFields;
    week:           (overrides?: Partial<InputProps>)          => SchemaFields;
    month:          (overrides?: Partial<InputProps>)          => SchemaFields;
    textarea:       (overrides?: Partial<TextAreaProps>)       => SchemaFields;
    checkbox:       (overrides?: Partial<CheckboxProps>)       => SchemaFields;
    switch:         (overrides?: Partial<CheckboxProps>)       => SchemaFields;
    select:         (overrides?: Partial<SelectProps>)         => SchemaFields;
    autocomplete:   (overrides?: Partial<AutocompleteProps>)   => SchemaFields;
    checklist:      (overrides?: Partial<ChecklistProps>)      => SchemaFields;
    uploadImage:    (overrides?: Partial<UploadImageProps>)    => SchemaFields;
    uploadDocument: (overrides?: Partial<UploadDocumentProps>) => SchemaFields;
    imageField:     (overrides?: Partial<ImageFieldProps>)     => SchemaFields;
}

const f = componentFormFields;

const componentFormSchema: ComponentFormSchemaMap = {

    string: (overrides: Partial<InputProps> = {}) => ({
        label:            f.string({ label: "Label",            required: true, defaultValue: overrides.label }),
        placeholder:      f.string({ label: "Placeholder",                     defaultValue: overrides.placeholder }),
        defaultValue:     f.string({ label: "Valore default",                  defaultValue: overrides.defaultValue as string }),
        required:         f.switch({ label: "Obbligatorio",                    defaultValue: overrides.required }),
        feedback:         f.string({ label: "Messaggio helper",                defaultValue: overrides.feedback }),
        readOnlyAfterSet: f.switch({ label: "Read-only dopo set",              defaultValue: overrides.readOnlyAfterSet }),
        disabled:         f.switch({ label: "Disabilitato",                    defaultValue: overrides.disabled }),
    }),

    number: (overrides: Partial<InputProps> = {}) => ({
        label:            f.string({ label: "Label",            required: true, defaultValue: overrides.label }),
        placeholder:      f.string({ label: "Placeholder",                     defaultValue: overrides.placeholder }),
        defaultValue:     f.number({ label: "Valore default",                  defaultValue: overrides.defaultValue as number }),
        required:         f.switch({ label: "Obbligatorio",                    defaultValue: overrides.required }),
        min:              f.number({ label: "Minimo",                          defaultValue: overrides.min }),
        max:              f.number({ label: "Massimo",                         defaultValue: overrides.max }),
        step:             f.number({ label: "Step",             min: 0,        defaultValue: overrides.step }),
        feedback:         f.string({ label: "Messaggio helper",                defaultValue: overrides.feedback }),
        readOnlyAfterSet: f.switch({ label: "Read-only dopo set",              defaultValue: overrides.readOnlyAfterSet }),
        disabled:         f.switch({ label: "Disabilitato",                    defaultValue: overrides.disabled }),
    }),

    email: (overrides: Partial<InputProps> = {}) => ({
        label:            f.string({ label: "Label",            required: true, defaultValue: overrides.label }),
        placeholder:      f.string({ label: "Placeholder",                     defaultValue: overrides.placeholder }),
        defaultValue:     f.email({ label: "Valore default",                   defaultValue: overrides.defaultValue as string }),
        required:         f.switch({ label: "Obbligatorio",                    defaultValue: overrides.required }),
        feedback:         f.string({ label: "Messaggio helper",                defaultValue: overrides.feedback }),
        readOnlyAfterSet: f.switch({ label: "Read-only dopo set",              defaultValue: overrides.readOnlyAfterSet }),
        disabled:         f.switch({ label: "Disabilitato",                    defaultValue: overrides.disabled }),
    }),

    password: (overrides: Partial<InputProps> = {}) => ({
        label:            f.string({ label: "Label",            required: true, defaultValue: overrides.label }),
        placeholder:      f.string({ label: "Placeholder",                     defaultValue: overrides.placeholder }),
        required:         f.switch({ label: "Obbligatorio",                    defaultValue: overrides.required }),
        feedback:         f.string({ label: "Messaggio helper",                defaultValue: overrides.feedback }),
        readOnlyAfterSet: f.switch({ label: "Read-only dopo set",              defaultValue: overrides.readOnlyAfterSet }),
        disabled:         f.switch({ label: "Disabilitato",                    defaultValue: overrides.disabled }),
    }),

    color: (overrides: Partial<InputProps> = {}) => ({
        label:        f.string({ label: "Label",          required: true, defaultValue: overrides.label }),
        defaultValue: f.color({ label: "Valore default",                 defaultValue: overrides.defaultValue as string }),
        required:     f.switch({ label: "Obbligatorio",                  defaultValue: overrides.required }),
        disabled:     f.switch({ label: "Disabilitato",                  defaultValue: overrides.disabled }),
    }),

    date: (overrides: Partial<InputProps> = {}) => ({
        label:        f.string({ label: "Label",          required: true, defaultValue: overrides.label }),
        defaultValue: f.date({  label: "Valore default",                 defaultValue: overrides.defaultValue as string }),
        required:     f.switch({ label: "Obbligatorio",                  defaultValue: overrides.required }),
        min:          f.number({ label: "Data minima",                   defaultValue: overrides.min }),
        max:          f.number({ label: "Data massima",                  defaultValue: overrides.max }),
        feedback:     f.string({ label: "Messaggio helper",              defaultValue: overrides.feedback }),
        disabled:     f.switch({ label: "Disabilitato",                  defaultValue: overrides.disabled }),
    }),

    time: (overrides: Partial<InputProps> = {}) => ({
        label:        f.string({ label: "Label",          required: true, defaultValue: overrides.label }),
        defaultValue: f.time({  label: "Valore default",                 defaultValue: overrides.defaultValue as string }),
        required:     f.switch({ label: "Obbligatorio",                  defaultValue: overrides.required }),
        feedback:     f.string({ label: "Messaggio helper",              defaultValue: overrides.feedback }),
        disabled:     f.switch({ label: "Disabilitato",                  defaultValue: overrides.disabled }),
    }),

    datetime: (overrides: Partial<InputProps> = {}) => ({
        label:        f.string({   label: "Label",          required: true, defaultValue: overrides.label }),
        defaultValue: f.datetime({ label: "Valore default",               defaultValue: overrides.defaultValue as string }),
        required:     f.switch({   label: "Obbligatorio",                 defaultValue: overrides.required }),
        feedback:     f.string({   label: "Messaggio helper",             defaultValue: overrides.feedback }),
        disabled:     f.switch({   label: "Disabilitato",                 defaultValue: overrides.disabled }),
    }),

    week: (overrides: Partial<InputProps> = {}) => ({
        label:        f.string({ label: "Label",          required: true, defaultValue: overrides.label }),
        defaultValue: f.week({  label: "Valore default",                 defaultValue: overrides.defaultValue as string }),
        required:     f.switch({ label: "Obbligatorio",                  defaultValue: overrides.required }),
        disabled:     f.switch({ label: "Disabilitato",                  defaultValue: overrides.disabled }),
    }),

    month: (overrides: Partial<InputProps> = {}) => ({
        label:        f.string({ label: "Label",          required: true, defaultValue: overrides.label }),
        defaultValue: f.month({ label: "Valore default",                 defaultValue: overrides.defaultValue as string }),
        required:     f.switch({ label: "Obbligatorio",                  defaultValue: overrides.required }),
        disabled:     f.switch({ label: "Disabilitato",                  defaultValue: overrides.disabled }),
    }),

    textarea: (overrides: Partial<TextAreaProps> = {}) => ({
        label:            f.string({   label: "Label",            required: true, defaultValue: overrides.label }),
        placeholder:      f.string({   label: "Placeholder",                     defaultValue: overrides.placeholder }),
        defaultValue:     f.textarea({ label: "Valore default",                  defaultValue: overrides.defaultValue as string }),
        required:         f.switch({   label: "Obbligatorio",                    defaultValue: overrides.required }),
        rows:             f.number({   label: "Righe",            min: 1,        defaultValue: overrides.rows }),
        maxRows:          f.number({   label: "Max righe",        min: 1,        defaultValue: overrides.maxRows }),
        feedback:         f.string({   label: "Messaggio helper",                defaultValue: overrides.feedback }),
        readOnlyAfterSet: f.switch({   label: "Read-only dopo set",              defaultValue: overrides.readOnlyAfterSet }),
        disabled:         f.switch({   label: "Disabilitato",                    defaultValue: overrides.disabled }),
    }),

    checkbox: (overrides: Partial<CheckboxProps> = {}) => ({
        label:        f.string({ label: "Label",           required: true, defaultValue: overrides.label }),
        required:     f.switch({ label: "Obbligatorio",                   defaultValue: overrides.required }),
        defaultValue: f.switch({ label: "Valore default",                 defaultValue: overrides.defaultValue as string }),
        title:        f.string({ label: "Titolo tooltip",                 defaultValue: overrides.title }),
        valueChecked: f.string({ label: "Valore checked",                 defaultValue: overrides.valueChecked?.toString() }),
    }),

    switch: (overrides: Partial<CheckboxProps> = {}) => ({
        label:        f.string({ label: "Label",           required: true, defaultValue: overrides.label }),
        required:     f.switch({ label: "Obbligatorio",                   defaultValue: overrides.required }),
        defaultValue: f.switch({ label: "Valore default",                 defaultValue: overrides.defaultValue as string }),
        title:        f.string({ label: "Titolo tooltip",                 defaultValue: overrides.title }),
        valueChecked: f.string({ label: "Valore checked",                 defaultValue: overrides.valueChecked?.toString() }),
    }),

    select: (overrides: Partial<SelectProps> = {}) => ({
        label:            f.string({ label: "Label",            required: true, defaultValue: overrides.label }),
        defaultValue:     f.string({ label: "Valore default",                  defaultValue: overrides.defaultValue as string }),
        required:         f.switch({ label: "Obbligatorio",                    defaultValue: overrides.required }),
        feedback:         f.string({ label: "Messaggio helper",                defaultValue: overrides.feedback }),
        readOnlyAfterSet: f.switch({ label: "Read-only dopo set",              defaultValue: overrides.readOnlyAfterSet }),
        disabled:         f.switch({ label: "Disabilitato",                    defaultValue: overrides.disabled }),
    }),

    autocomplete: (overrides: Partial<AutocompleteProps> = {}) => ({
        label:       f.string({ label: "Label",             required: true, defaultValue: overrides.label }),
        placeholder: f.string({ label: "Placeholder",                      defaultValue: overrides.placeholder }),
        required:    f.switch({ label: "Obbligatorio",                     defaultValue: overrides.required }),
        minItems:    f.number({ label: "Min selezioni",     min: 0,        defaultValue: overrides.minItems }),
        maxItems:    f.number({ label: "Max selezioni",     min: 1,        defaultValue: overrides.maxItems }),
        creatable:   f.switch({ label: "Creazione libera",                 defaultValue: overrides.creatable }),
        feedback:    f.string({ label: "Messaggio helper",                 defaultValue: overrides.feedback }),
        disabled:    f.switch({ label: "Disabilitato",                     defaultValue: overrides.disabled }),
    }),

    checklist: (overrides: Partial<ChecklistProps> = {}) => ({
        label:    f.string({ label: "Label",            required: true, defaultValue: overrides.label }),
        required: f.switch({ label: "Obbligatorio",                    defaultValue: overrides.required }),
        feedback: f.string({ label: "Messaggio helper",                defaultValue: overrides.feedback }),
        disabled: f.switch({ label: "Disabilitato",                    defaultValue: overrides.disabled }),
    }),

    uploadImage: (overrides: Partial<UploadImageProps> = {}) => ({
        label:         f.string({ label: "Label",              required: true, defaultValue: overrides.label }),
        required:      f.switch({ label: "Obbligatorio",                      defaultValue: overrides.required }),
        multiple:      f.switch({ label: "Multiplo",                          defaultValue: overrides.multiple }),
        editable:      f.switch({ label: "Modificabile",                      defaultValue: overrides.editable }),
        max:           f.number({ label: "Max file",           min: 1,        defaultValue: overrides.max }),
        accept:        f.string({ label: "Formati accettati",                 defaultValue: overrides.accept }),
        previewWidth:  f.number({ label: "Larghezza preview",  min: 0,        defaultValue: overrides.previewWidth }),
        previewHeight: f.number({ label: "Altezza preview",    min: 0,        defaultValue: overrides.previewHeight }),
    }),

    uploadDocument: (overrides: Partial<UploadDocumentProps> = {}) => ({
        label:    f.string({ label: "Label",             required: true, defaultValue: overrides.label }),
        required: f.switch({ label: "Obbligatorio",                     defaultValue: overrides.required }),
        multiple: f.switch({ label: "Multiplo",                         defaultValue: overrides.multiple }),
        editable: f.switch({ label: "Modificabile",                     defaultValue: overrides.editable }),
        max:      f.number({ label: "Max file",          min: 1,        defaultValue: overrides.max }),
        accept:   f.string({ label: "Formati accettati",                defaultValue: overrides.accept }),
    }),

    imageField: (overrides: Partial<ImageFieldProps> = {}) => ({
        label:    f.string({ label: "Label",    required: true, defaultValue: overrides.label }),
        required: f.switch({ label: "Obbligatorio",             defaultValue: overrides.required }),
    }),

};

export default componentFormSchema;
