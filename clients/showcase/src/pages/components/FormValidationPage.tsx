import React, { useState, useRef } from 'react';
import { Form, Input, Select, TextArea, MockDataProvider, DataProvider, Modal, ActionButton } from '@llmnative/react';
import type { FormRef } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import type { PropDef } from '../../docs-kit/playground';

// ── Shared mock setup ──────────────────────────────────────────────────────────

const mockProvider = new MockDataProvider();

function WithMock({ children }: { children: React.ReactNode }) {
    return (
        <DataProvider registry={{ default: mockProvider }} defaultKey="default">
            {children}
        </DataProvider>
    );
}

// ── Validators ────────────────────────────────────────────────────────────────

const validateEmail = (value: any): string | undefined => {
    if (!value) return undefined;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))
        ? undefined
        : 'Enter a valid email address (e.g. user@example.com)';
};

const validatePhone = (value: any): string | undefined => {
    if (!value) return undefined;
    return /^\+?[\d\s\-()]{7,20}$/.test(String(value))
        ? undefined
        : 'Enter a valid phone number';
};

const validatePassword = (value: any): string | undefined => {
    if (!value) return undefined;
    const s = String(value);
    if (s.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(s)) return 'Password must contain at least one uppercase letter';
    if (!/\d/.test(s)) return 'Password must contain at least one number';
    if (!/[^A-Za-z0-9]/.test(s)) return 'Password must contain at least one special character';
    return undefined;
};

const validateUrl = (value: any): string | undefined => {
    if (!value) return undefined;
    try { new URL(String(value)); return undefined; }
    catch { return 'Enter a valid URL (e.g. https://example.com)'; }
};

const validatePostalCode = (value: any): string | undefined => {
    if (!value) return undefined;
    return /^\d{5}(-\d{4})?$/.test(String(value))
        ? undefined
        : 'Enter a valid US postal code (e.g. 94105)';
};

const validateUsername = (value: any): string | undefined => {
    if (!value) return undefined;
    const s = String(value);
    if (s.length < 3) return 'Username must be at least 3 characters';
    if (s.length > 20) return 'Username must be at most 20 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(s)) return 'Username may only contain letters, numbers and underscores';
    return undefined;
};

const validateAge = (value: any): string | undefined => {
    if (value === undefined || value === null || value === '') return undefined;
    const n = Number(value);
    if (isNaN(n)) return 'Age must be a number';
    if (n < 18) return 'You must be at least 18 years old';
    if (n > 120) return 'Age must be realistic (≤ 120)';
    return undefined;
};

const COUNTRY_OPTIONS = [
    { label: 'Italy',          value: 'it' },
    { label: 'United States',  value: 'us' },
    { label: 'Germany',        value: 'de' },
    { label: 'France',         value: 'fr' },
    { label: 'United Kingdom', value: 'uk' },
];

// ── Prop docs ──────────────────────────────────────────────────────────────────

const VALIDATOR_PROPS: PropDef[] = [
    {
        name: 'required',
        type: 'boolean',
        default: 'false',
        description: 'Marks the field as mandatory. The form collects all empty required fields before showing errors - submit is blocked until every required field has a value.',
    },
    {
        name: 'validator',
        type: '(value: any) => string | undefined',
        description: 'Custom validator function. Called after the required check. Return an error string to block submit; return undefined to pass. Works on Input, TextArea and Select.',
        shape: `// The validator receives the raw field value.
// Return a string to show as error; return undefined to pass.
const validateEmail = (value: any): string | undefined => {
    if (!value) return undefined;  // let required handle the empty case
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(String(value))
        ? undefined
        : 'Enter a valid email address';
};

<Input name="email" label="Email" required validator={validateEmail} />`,
    },
];

// ── Page ───────────────────────────────────────────────────────────────────────

const MODAL_POSITIONS = ['center', 'left', 'right', 'top', 'bottom'] as const;
type ModalPosition = typeof MODAL_POSITIONS[number];

export default function FormValidationPage() {
    const [openPosition, setOpenPosition] = useState<ModalPosition | null>(null);
    const formRef = useRef<FormRef>(null);

    return (
        <PageLayout
            title="Form - Validation"
            description="The Form widget collects all invalid fields in a single pass before blocking submit. Required fields and custom validators are both supported. Errors appear inline under each field; they clear as soon as the user starts typing. Clicking Save always clears the previous state immediately before re-validating."
        >
            {/* ── 1. Create mode - required + validators + notification ─── */}
            <Section
                title="Create mode - required fields & validators"
                description="Click Save without filling anything: all required fields highlight simultaneously. The footer shows a warning notification next to the Save button - it persists until you fix the errors and submit again. Once all fields are valid the notification switches to a success confirmation that auto-dismisses."
                preview={
                    <WithMock>
                        <div className="w-full max-w-lg">
                            <Form
                                path="/demo"
                                aspect="card"
                                keyGenerator={() => `rec_${Date.now()}`}
                                onFinally={async () => false}
                            >
                                <Input name="username"  label="Username" required validator={validateUsername} />
                                <Input name="email"     label="Email"    required validator={validateEmail} />
                                <Input name="phone"     label="Phone"             validator={validatePhone} />
                                <Input
                                    name="password"
                                    label="Password"
                                    inputType="password"
                                    required
                                    validator={validatePassword}
                                />
                                <Select
                                    name="country"
                                    label="Country"
                                    required
                                    options={COUNTRY_OPTIONS}
                                />
                            </Form>
                        </div>
                    </WithMock>
                }
                code={`const validateEmail   = (v: any) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v) ? undefined : 'Invalid email';
const validatePhone   = (v: any) => !v || /^\\+?[\\d\\s\\-()]{7,20}$/.test(v) ? undefined : 'Invalid phone';
const validatePassword = (v: any) => {
    if (!v) return undefined;
    if (v.length < 8)         return 'At least 8 characters';
    if (!/[A-Z]/.test(v))    return 'Add an uppercase letter';
    if (!/\\d/.test(v))       return 'Add a number';
    if (!/[^A-Za-z0-9]/.test(v)) return 'Add a special character';
};

// path="/demo" + keyGenerator → create mode (Save button, no Delete)
<Form path="/demo" aspect="card" keyGenerator={() => \`rec_\${Date.now()}\`}>
    <Input  name="username" label="Username" required validator={validateUsername} />
    <Input  name="email"    label="Email"    required validator={validateEmail} />
    <Input  name="phone"    label="Phone"             validator={validatePhone} />
    <Input  name="password" label="Password" inputType="password" required validator={validatePassword} />
    <Select name="country"  label="Country"  required options={COUNTRY_OPTIONS} />
</Form>`}
            />

            {/* ── 2. Edit mode - save + delete ─────────────────────────── */}
            <Section
                title="Edit mode - save & delete"
                description="Pass defaultValues that include a _key field to signal edit mode. The Form sees _key in defaultValues and sets isNewRecord = false, rendering both Save and Delete buttons. path is the collection; the record's _key is appended for writes."
                preview={
                    <WithMock>
                        <div className="w-full max-w-lg">
                            <Form
                                path="/users"
                                aspect="card"
                                defaultValues={{
                                    _key:     'user_001',
                                    username: 'alice_dev',
                                    email:    'alice@example.com',
                                    phone:    '+39 02 1234567',
                                    country:  'it',
                                }}
                                onDelete={async () => { alert('Record deleted!'); return undefined; }}
                                onFinally={async () => false}
                            >
                                <Input  name="username" label="Username" required validator={validateUsername} />
                                <Input  name="email"    label="Email"    required validator={validateEmail} />
                                <Input  name="phone"    label="Phone"             validator={validatePhone} />
                                <Select name="country"  label="Country"  required options={COUNTRY_OPTIONS} />
                            </Form>
                        </div>
                    </WithMock>
                }
                code={`// defaultValues with _key → edit mode (isNewRecord = false → Save + Delete both visible)
// Saves to /users/user_001 (path + _key)
<Form
    path="/users"
    aspect="card"
    defaultValues={{ _key: 'user_001', username: 'alice_dev', email: 'alice@example.com', country: 'it' }}
    onDelete={async () => { /* custom delete logic */ return undefined; }}
    onFinally={async ({ action }) => {
        if (action === 'delete') navigate('/users');
        return true;
    }}
>
    <Input  name="username" label="Username" required validator={validateUsername} />
    <Input  name="email"    label="Email"    required validator={validateEmail} />
    <Select name="country"  label="Country"  required options={COUNTRY_OPTIONS} />
</Form>`}
            />

            {/* ── 3. Long form - scroll to first error ─────────────────── */}
            <Section
                title="Long form - scroll to first error"
                description="When a form is taller than the viewport, the form automatically scrolls to the first invalid field and focuses it after a failed submit. Scroll to the bottom of this form and click Save - the page jumps back to the first missing field."
                preview={
                    <div className="w-full max-w-lg">
                        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 mb-4">
                            <strong>How to try it:</strong> scroll past all fields to the Save button, then click it. The page scrolls back to the first invalid field.
                        </div>
                        <WithMock>
                            <Form
                                path="/long-demo"
                                aspect="card"
                                keyGenerator={() => `rec_${Date.now()}`}
                                onFinally={async () => false}
                                defaultValues={{
                                    firstName: 'Alice',
                                    lastName:  'Rossi',
                                    birthDate: '1990-06-15',
                                }}
                            >
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-2 mb-1">Personal</p>
                                <Input name="firstName" label="First name"    required />
                                <Input name="lastName"  label="Last name"     required />
                                <Input name="birthDate" label="Date of birth" inputType="date" required />

                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-4 mb-1">Contact</p>
                                <Input name="email"   label="Email"   required validator={validateEmail} />
                                <Input name="phone"   label="Phone"            validator={validatePhone} />
                                <Input name="website" label="Website"          validator={validateUrl} />

                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-4 mb-1">Address</p>
                                <Input name="address.street"     label="Street"      required />
                                <Input name="address.city"       label="City"        required />
                                <Input name="address.postalCode" label="Postal code" required validator={validatePostalCode} />
                                <Select name="address.country"   label="Country"     required options={COUNTRY_OPTIONS} />

                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-4 mb-1">Account</p>
                                <Input name="username" label="Username" required validator={validateUsername} />
                                <Input name="password" label="Password" inputType="password" required validator={validatePassword} />

                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-4 mb-1">Extra</p>
                                <Input name="age" label="Age" inputType="number" required validator={validateAge} />
                                <TextArea
                                    name="bio"
                                    label="Bio"
                                    rows={4}
                                    validator={(v) => v && String(v).length > 500 ? 'Bio must be at most 500 characters' : undefined}
                                />
                            </Form>
                        </WithMock>
                    </div>
                }
                code={`<Form
    path="/users"
    aspect="card"
    keyGenerator={() => \`rec_\${Date.now()}\`}
    defaultValues={{ firstName: 'Alice', lastName: 'Rossi', birthDate: '1990-06-15' }}
>
    <Input name="firstName" label="First name"    required />
    <Input name="lastName"  label="Last name"     required />
    <Input name="birthDate" label="Date of birth" inputType="date" required />
    <Input name="email"     label="Email"   required validator={validateEmail} />
    <Input name="address.street" label="Street"   required />
    <Select name="address.country" label="Country" required options={COUNTRY_OPTIONS} />
    <Input name="username" label="Username" required validator={validateUsername} />
    <Input name="password" label="Password" inputType="password" required validator={validatePassword} />
    <Input name="age"      label="Age"      inputType="number" required validator={validateAge} />
</Form>`}
            />

            {/* ── 4. Form inside modal - all positions ─────────────────── */}
            <Section
                title="Form inside modal"
                description="A validated form can live inside a Modal at any position. The modal's Save button delegates to the form's internal handleSave: validation runs, errors appear inline, and the modal closes only when all fields are valid."
                preview={
                    <WithMock>
                        <div className="flex flex-wrap gap-2 justify-center py-4">
                            {MODAL_POSITIONS.map(pos => (
                                <ActionButton
                                    key={pos}
                                    label={pos}
                                    onClick={() => setOpenPosition(pos)}
                                />
                            ))}
                        </div>

                        {openPosition && (
                            <Modal
                                key={openPosition}
                                title={`Contact form - ${openPosition}`}
                                position={openPosition}
                                size="md"
                                closeOnBackdrop
                                onClose={() => setOpenPosition(null)}
                                onSave={async e => {
                                    const ok = await (formRef.current?.handleSave(e) ?? Promise.resolve(false));
                                    if (ok) setOpenPosition(null);
                                    return ok;
                                }}
                            >
                                <Form
                                    ref={formRef}
                                    path="/modal-demo"
                                    keyGenerator={() => `rec_${Date.now()}`}
                                >
                                    <Input name="firstName" label="First name" required />
                                    <Input name="lastName"  label="Last name"  required />
                                    <Input name="email"     label="Email"      required validator={validateEmail} />
                                    <Input name="phone"     label="Phone"               validator={validatePhone} />
                                    <Select
                                        name="country"
                                        label="Country"
                                        required
                                        options={COUNTRY_OPTIONS}
                                    />
                                </Form>
                            </Modal>
                        )}
                    </WithMock>
                }
                code={`import { Modal, Form, Input, Select, FormRef } from '@llmnative/react';
import { useRef, useState } from 'react';

const formRef = useRef<FormRef>(null);
const [open, setOpen] = useState(false);

{open && (
    <Modal
        title="Contact form"
        position="center"   // center | left | right | top | bottom
        size="md"
        closeOnBackdrop
        onClose={() => setOpen(false)}
        onSave={async e => {
            const ok = await (formRef.current?.handleSave(e) ?? Promise.resolve(false));
            if (ok) setOpen(false);
            return ok;   // true → modal closes · false → keeps modal open
        }}
    >
        <Form
            ref={formRef}
            path="/contacts"
            keyGenerator={() => \`rec_\${Date.now()}\`}
            showNotice={false}
        >
            <Input  name="firstName" label="First name" required />
            <Input  name="lastName"  label="Last name"  required />
            <Input  name="email"     label="Email"      required validator={validateEmail} />
            <Select name="country"   label="Country"    required options={COUNTRY_OPTIONS} />
        </Form>
    </Modal>
)}`}
            />

            <PropDocsTable props={VALIDATOR_PROPS} />
        </PageLayout>
    );
}
