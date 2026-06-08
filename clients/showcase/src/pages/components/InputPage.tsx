import React from 'react';
import { Form, Input, TextArea, Checkbox } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';

function LiveForm({ children, title, description, code }: {
    children: React.ReactNode;
    title: string;
    description?: string;
    code: string;
}) {
    return (
        <Section bare
            title={title}
            description={description}
            preview={
                <div className="w-full max-w-md">
                    <Form aspect="empty">
                        {children}
                    </Form>
                </div>
            }
            code={code}
        />
    );
}

const PROPS_CONFIG: PropDef[] = [
    { name: 'name', type: 'string', required: true, description: 'Field name — used as form key and dot-notation path', control: 'text' },
    { name: 'label', type: 'string', description: 'Label displayed above the input', control: 'text' },
    { name: 'type', type: '"text" | "number" | "email" | "password" | "url" | "color" | "date" | "datetime-local" | "time" | "week" | "month" | "range"', default: '"text"', description: 'HTML input type', control: 'select', options: ['text', 'number', 'email', 'password', 'url', 'color', 'date', 'datetime-local', 'time', 'week', 'month', 'range'] },
    { name: 'placeholder', type: 'string', description: 'Placeholder text', control: 'text' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Marks field as required and shows a * on the label', control: 'boolean' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Makes the field read-only', control: 'boolean' },
    { name: 'updatable', type: 'boolean', default: 'false', description: 'Shows a pencil icon; field becomes editable on click', control: 'boolean' },
    { name: 'defaultValue', type: 'any', description: 'Initial value when not managed by a Form', control: 'text' },
    { name: 'min', type: 'number', description: 'Minimum value (number/range inputs)', control: 'number', min: 0 },
    { name: 'max', type: 'number', description: 'Maximum value (number/range inputs)', control: 'number', min: 0 },
    { name: 'step', type: 'number', description: 'Step increment (number/range inputs)', control: 'number', min: 1 },
    { name: 'feedback', type: 'string', description: 'Validation feedback message shown below the field', control: 'text' },
    { name: 'className', type: 'string', description: 'CSS classes on the input element', control: 'text' },
    { name: 'wrapClass', type: 'string', description: 'CSS classes on the outer wrapper', control: 'text' },
];

const PLAYGROUND: PlaygroundConfig = {
    size: 'lg',
    showFormRecord: true,
    props: PROPS_CONFIG,
    defaultProps: {
        name: 'demo',
        label: 'Field label',
        type: 'text',
        placeholder: 'Type something…',
        required: false,
        disabled: false,
        updatable: false,
        defaultValue: '',
        feedback: '',
        className: '',
        wrapClass: '',
    },
    render: (p, onValuesChange) => (
        <Form aspect="empty" defaultValues={p.defaultValue ? { [p.name || 'demo']: p.defaultValue } : {}} onChange={onValuesChange}>
            <Input
                name={p.name || 'demo'}
                label={p.label}
                type={p.type}
                placeholder={p.placeholder || undefined}
                required={p.required}
                disabled={p.disabled}
                updatable={p.updatable}
                min={p.min || undefined}
                max={p.max || undefined}
                step={p.step || undefined}
                feedback={p.feedback || undefined}
                className={p.className || undefined}
                wrapClass={p.wrapClass || undefined}
            />
        </Form>
    ),
};

export default function InputPage() {
    usePlayground(PLAYGROUND, 'Input');

    return (
        <PageLayout
            title="Input"
            description="Text, number, email, password, color, date, datetime, week, month and textarea variants. All inputs are form-context-aware — wrap them in a Form to get two-way binding automatically."
        >
            <LiveForm
                title="Text variants"
                description="The most common input types. All support label, required, placeholder and disabled props."
                code={`import { Form, Input } from '@llmnative/react';

<Form aspect="empty">
    <Input name="firstName" label="First name" required />
    <Input name="email"    label="Email"    type="email" />
    <Input name="password" label="Password" type="password" />
    <Input name="website"  label="Website"  type="url" placeholder="https://…" />
</Form>`}
            >
                <Input name="firstName" label="First name" required />
                <Input name="email"    label="Email"    type="email" />
                <Input name="password" label="Password" type="password" />
                <Input name="website"  label="Website"  type="url" placeholder="https://…" />
            </LiveForm>

            <LiveForm
                title="Number and range"
                code={`<Input name="age"   label="Age"           type="number" min={0} max={120} />
<Input name="score" label="Score (0–100)" type="range"  min={0} max={100} />`}
            >
                <Input name="age"   label="Age"           type="number" min={0} max={120} />
                <Input name="score" label="Score (0–100)" type="range"  min={0} max={100} />
            </LiveForm>

            <LiveForm
                title="Date and time"
                code={`<Input name="birthday"    label="Birthday"    type="date" />
<Input name="startTime"   label="Start time"  type="time" />
<Input name="appointment" label="Appointment" type="datetime-local" />
<Input name="week"        label="Week"        type="week" />
<Input name="month"       label="Month"       type="month" />`}
            >
                <Input name="birthday"    label="Birthday"    type="date" />
                <Input name="startTime"   label="Start time"  type="time" />
                <Input name="appointment" label="Appointment" type="datetime-local" />
                <Input name="week"        label="Week"        type="week" />
                <Input name="month"       label="Month"       type="month" />
            </LiveForm>

            <LiveForm
                title="Color picker"
                code={`<Input name="brandColor" label="Brand color" type="color" />`}
            >
                <Input name="brandColor" label="Brand color" type="color" />
            </LiveForm>

            <LiveForm
                title="Textarea"
                description="Multi-line text with configurable rows."
                code={`import { TextArea } from '@llmnative/react';

<TextArea name="bio" label="Bio" rows={4} placeholder="Tell us about yourself…" />`}
            >
                <TextArea name="bio" label="Bio" rows={4} placeholder="Tell us about yourself…" />
            </LiveForm>

            <LiveForm
                title="Checkbox"
                code={`import { Checkbox } from '@llmnative/react';

<Checkbox name="terms" label="I accept the terms and conditions" required />`}
            >
                <Checkbox name="terms" label="I accept the terms and conditions" required />
            </LiveForm>

            <LiveForm
                title="Disabled and updatable"
                description="updatable makes a read-only field editable on click (pencil icon)."
                code={`<Input name="id"   label="Record ID" disabled />
<Input name="slug" label="Slug"      updatable />`}
            >
                <Input name="id"   label="Record ID" defaultValue="rec_42"         disabled />
                <Input name="slug" label="Slug"      defaultValue="my-article-slug" updatable />
            </LiveForm>

            <PropDocsTable props={PROPS_CONFIG} title="Input props" />

        </PageLayout>
    );
}
