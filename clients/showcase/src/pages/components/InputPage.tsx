import React from 'react';
import { Form, Input, TextArea, Checkbox } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';

function LiveForm({ children, title, description, code }: {
    children: React.ReactNode;
    title: string;
    description?: string;
    code: string;
}) {
    return (
        <Section
            title={title}
            description={description}
            preview={
                <div className="w-full max-w-md">
                    <Form defaultValues={{}}>
                        {children}
                    </Form>
                </div>
            }
            code={code}
        />
    );
}

export default function InputPage() {
    return (
        <PageLayout
            title="Input"
            description="Text, number, email, password, color, date, datetime, week, month and textarea variants. All inputs are form-context-aware — wrap them in a Form to get two-way binding automatically."
        >
            <LiveForm
                title="Text variants"
                description="The most common input types. All support label, required, placeholder and disabled props."
                code={`import { Form, Input } from 'react-firestrap';

<Form defaultValues={{}}>
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
                code={`import { TextArea } from 'react-firestrap';

<TextArea name="bio" label="Bio" rows={4} placeholder="Tell us about yourself…" />`}
            >
                <TextArea name="bio" label="Bio" rows={4} placeholder="Tell us about yourself…" />
            </LiveForm>

            <LiveForm
                title="Checkbox"
                code={`import { Checkbox } from 'react-firestrap';

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
        </PageLayout>
    );
}
