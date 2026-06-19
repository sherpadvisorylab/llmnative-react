import React from 'react';
import { Form, Input, TextArea, Checkbox } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PropDef, PlaygroundConfig } from '../../docs-kit/playground';
import { useShowcaseInputI18n } from '../../showcase/i18n';

function LiveForm({ children, title, description, code }: {
    children: React.ReactNode;
    title: string;
    description?: string;
    code: string;
}) {
    return (
        <Section
            bare
            title={title}
            description={description}
            preview={(
                <div className="w-full max-w-md">
                    <Form appearance="empty">
                        {children}
                    </Form>
                </div>
            )}
            code={code}
        />
    );
}

export default function InputPage() {
    const t = useShowcaseInputI18n();

    const inputProps = React.useMemo<PropDef[]>(() => [
        { name: 'name', type: 'string', required: true, description: t.propsDocs.items.name.description, control: 'text' },
        { name: 'label', type: 'string', description: t.propsDocs.items.label.description, control: 'text' },
        { name: 'type', type: '"text" | "number" | "email" | "password" | "url" | "color" | "date" | "datetime-local" | "time" | "week" | "month" | "range"', default: '"text"', description: t.propsDocs.items.type.description, control: 'select', options: ['text', 'number', 'email', 'password', 'url', 'color', 'date', 'datetime-local', 'time', 'week', 'month', 'range'] },
        { name: 'placeholder', type: 'string', description: t.propsDocs.items.placeholder.description, control: 'text' },
        { name: 'required', type: 'boolean', default: 'false', description: t.propsDocs.items.required.description, control: 'boolean' },
        { name: 'disabled', type: 'boolean', default: 'false', description: t.propsDocs.items.disabled.description, control: 'boolean' },
        { name: 'readOnlyAfterSet', type: 'boolean', default: 'false', description: t.propsDocs.items.readOnlyAfterSet.description, control: 'boolean' },
        { name: 'defaultValue', type: 'any', description: t.propsDocs.items.defaultValue.description, control: 'text' },
        { name: 'min', type: 'number', description: t.propsDocs.items.min.description, control: 'number', min: 0 },
        { name: 'max', type: 'number', description: t.propsDocs.items.max.description, control: 'number', min: 0 },
        { name: 'step', type: 'number', description: t.propsDocs.items.step.description, control: 'number', min: 1 },
        { name: 'feedback', type: 'string', description: t.propsDocs.items.feedback.description, control: 'text' },
        { name: 'id', type: 'string', description: t.propsDocs.items.id.description, control: 'text' },
        { name: 'labelClassName', type: 'string', description: t.propsDocs.items.labelClassName.description, control: 'text' },
        { name: 'validator', type: '(value: FieldValue) => string | undefined', description: t.propsDocs.items.validator.description },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'wrapperClassName', type: 'string', description: t.propsDocs.items.wrapperClassName.description, control: 'text' },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        size: 'lg',
        showFormRecord: true,
        props: inputProps,
        defaultProps: {
            name: 'demo',
            label: t.labels.fieldLabel,
            type: 'text',
            placeholder: t.labels.typeSomething,
            required: false,
            disabled: false,
            readOnlyAfterSet: false,
            defaultValue: '',
            feedback: '',
            className: '',
            wrapperClassName: '',
        },
        render: (p, onValuesChange) => (
            <Form appearance="empty" defaultValues={p.defaultValue ? { [p.name || 'demo']: p.defaultValue } : {}} onChange={onValuesChange}>
                <Input
                    name={p.name || 'demo'}
                    label={p.label}
                    type={p.type}
                    placeholder={p.placeholder || undefined}
                    required={p.required}
                    disabled={p.disabled}
                    readOnlyAfterSet={p.readOnlyAfterSet}
                    min={p.min || undefined}
                    max={p.max || undefined}
                    step={p.step || undefined}
                    feedback={p.feedback || undefined}
                    className={p.className || undefined}
                    wrapperClassName={p.wrapperClassName || undefined}
                />
            </Form>
        ),
    }), [inputProps, t]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <LiveForm
                title={t.sections.textVariants.title}
                description={t.sections.textVariants.description}
                code={`import { Form, Input } from '@llmnative/react';

<Form appearance="empty">
    <Input name="firstName" label="First name" required />
    <Input name="email"    label="Email"    type="email" />
    <Input name="password" label="Password" type="password" />
    <Input name="website"  label="Website"  type="url" placeholder="https://..." />
</Form>`}
            >
                <Input name="firstName" label={t.labels.firstName} required />
                <Input name="email" label={t.labels.email} type="email" />
                <Input name="password" label={t.labels.password} type="password" />
                <Input name="website" label={t.labels.website} type="url" placeholder="https://..." />
            </LiveForm>

            <LiveForm
                title={t.sections.numberRange.title}
                code={`<Input name="age"   label="Age"           type="number" min={0} max={120} />
<Input name="score" label="Score (0-100)" type="range"  min={0} max={100} />`}
            >
                <Input name="age" label={t.labels.age} type="number" min={0} max={120} />
                <Input name="score" label={t.labels.score} type="range" min={0} max={100} />
            </LiveForm>

            <LiveForm
                title={t.sections.dateTime.title}
                code={`<Input name="birthday"    label="Birthday"    type="date" />
<Input name="startTime"   label="Start time"  type="time" />
<Input name="appointment" label="Appointment" type="datetime-local" />
<Input name="week"        label="Week"        type="week" />
<Input name="month"       label="Month"       type="month" />`}
            >
                <Input name="birthday" label={t.labels.birthday} type="date" />
                <Input name="startTime" label={t.labels.startTime} type="time" />
                <Input name="appointment" label={t.labels.appointment} type="datetime-local" />
                <Input name="week" label={t.labels.week} type="week" />
                <Input name="month" label={t.labels.month} type="month" />
            </LiveForm>

            <LiveForm
                title={t.sections.colorPicker.title}
                code={`<Input name="brandColor" label="Brand color" type="color" />`}
            >
                <Input name="brandColor" label={t.labels.brandColor} type="color" />
            </LiveForm>

            <LiveForm
                title={t.sections.textarea.title}
                description={t.sections.textarea.description}
                code={`import { TextArea } from '@llmnative/react';

<TextArea name="bio" label="Bio" minHeight={120} placeholder="Tell us about yourself..." />`}
            >
                <TextArea name="bio" label={t.labels.bio} minHeight={120} placeholder={t.labels.tellUsAboutYourself} />
            </LiveForm>

            <LiveForm
                title={t.sections.checkbox.title}
                code={`import { Checkbox } from '@llmnative/react';

<Checkbox name="terms" label="I accept the terms and conditions" required />`}
            >
                <Checkbox name="terms" label={t.labels.acceptTerms} required />
            </LiveForm>

            <LiveForm
                title={t.sections.disabledReadOnlyAfterSet.title}
                description={t.sections.disabledReadOnlyAfterSet.description}
                code={`<Input name="id"   label="Record ID" disabled />
<Input name="slug" label="Slug"      readOnlyAfterSet />`}
            >
                <Input name="id" label={t.labels.recordId} defaultValue="rec_42" disabled />
                <Input name="slug" label={t.labels.slug} defaultValue="my-article-slug" readOnlyAfterSet />
            </LiveForm>

            <PropDocsTable props={inputProps} title={t.propsDocs.title} />
        </PageLayout>
    );
}
