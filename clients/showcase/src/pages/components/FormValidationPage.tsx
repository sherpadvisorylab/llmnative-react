import React from 'react';
import { Form, Input, Select, TextArea, MockDataProvider, DataProvider } from '@llmnative/react';
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

const validateUrl = (value: any): string | undefined => {
    if (!value) return undefined;
    try {
        new URL(String(value));
        return undefined;
    } catch {
        return 'Enter a valid URL (e.g. https://example.com)';
    }
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

const validatePostalCode = (value: any): string | undefined => {
    if (!value) return undefined;
    return /^\d{5}(-\d{4})?$/.test(String(value))
        ? undefined
        : 'Enter a valid US postal code (e.g. 94105 or 94105-1234)';
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
        description: 'Marks the field as mandatory. The form collects all empty required fields before showing errors — submit is blocked until every required field has a value.',
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

export default function FormValidationPage() {
    return (
        <PageLayout
            title="Form — Validation"
            description="The Form widget collects all invalid fields in a single pass before blocking submit. Required fields and custom regexp-based validators are both supported. Errors appear inline under each field with a red border; they clear as soon as the user starts typing."
        >
            {/* ── 1. All required at once ───────────────────────────────── */}
            <Section
                title="Required fields — all at once"
                description="Click Save without filling anything. Every required field is highlighted simultaneously — the form never stops at the first error."
                preview={
                    <WithMock>
                        <div className="w-full max-w-lg">
                            <Form
                                dataStoragePath="/demo"
                                aspect="card"
                                setPrimaryKey={() => `rec_${Date.now()}`}
                                onFinally={async () => { alert('Saved!'); return false; }}
                            >
                                <Input name="firstName" label="First name" required />
                                <Input name="lastName"  label="Last name"  required />
                                <Input name="email"     label="Email"      required />
                                <Select
                                    name="country"
                                    label="Country"
                                    required
                                    options={COUNTRY_OPTIONS}
                                />
                                <TextArea name="bio" label="Bio" required rows={3} />
                            </Form>
                        </div>
                    </WithMock>
                }
                code={`import { Form, Input, Select, TextArea } from '@llmnative/react';

<Form dataStoragePath="/demo" aspect="card" setPrimaryKey={() => \`rec_\${Date.now()}\`}>
    <Input   name="firstName" label="First name" required />
    <Input   name="lastName"  label="Last name"  required />
    <Input   name="email"     label="Email"      required />
    <Select  name="country"   label="Country"    required options={COUNTRY_OPTIONS} />
    <TextArea name="bio"      label="Bio"        required rows={3} />
</Form>`}
            />

            {/* ── 2. Format validators ──────────────────────────────────── */}
            <Section
                title="Format validators (regexp)"
                description="Validators run after the required check. Return a string to block submit with a message, or undefined to pass. Try submitting with invalid values."
                preview={
                    <WithMock>
                        <div className="w-full max-w-lg">
                            <Form
                                dataStoragePath="/demo"
                                aspect="card"
                                setPrimaryKey={() => `rec_${Date.now()}`}
                                onFinally={async () => { alert('Saved!'); return false; }}
                            >
                                <Input
                                    name="email"
                                    label="Email"
                                    required
                                    validator={validateEmail}
                                />
                                <Input
                                    name="phone"
                                    label="Phone"
                                    validator={validatePhone}
                                />
                                <Input
                                    name="website"
                                    label="Website"
                                    validator={validateUrl}
                                />
                                <Input
                                    name="postalCode"
                                    label="Postal code (US)"
                                    validator={validatePostalCode}
                                />
                            </Form>
                        </div>
                    </WithMock>
                }
                code={`const validateEmail = (value: any): string | undefined => {
    if (!value) return undefined;
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(String(value))
        ? undefined
        : 'Enter a valid email address (e.g. user@example.com)';
};

const validatePhone = (value: any): string | undefined => {
    if (!value) return undefined;
    return /^\\+?[\\d\\s\\-()]{7,20}$/.test(String(value))
        ? undefined
        : 'Enter a valid phone number';
};

const validateUrl = (value: any): string | undefined => {
    if (!value) return undefined;
    try { new URL(String(value)); return undefined; }
    catch { return 'Enter a valid URL (e.g. https://example.com)'; }
};

<Form dataStoragePath="/demo" aspect="card">
    <Input name="email"      label="Email"             required validator={validateEmail} />
    <Input name="phone"      label="Phone"                       validator={validatePhone} />
    <Input name="website"    label="Website"                     validator={validateUrl} />
    <Input name="postalCode" label="Postal code (US)"            validator={validatePostalCode} />
</Form>`}
            />

            {/* ── 3. Password strength ─────────────────────────────────── */}
            <Section
                title="Password strength validator"
                description="Multi-rule validator: minimum length, uppercase letter, number and special character. The first failing rule is shown as the error message."
                preview={
                    <WithMock>
                        <div className="w-full max-w-lg">
                            <Form
                                dataStoragePath="/demo"
                                aspect="card"
                                setPrimaryKey={() => `rec_${Date.now()}`}
                                onFinally={async () => { alert('Saved!'); return false; }}
                            >
                                <Input name="username" label="Username" required validator={validateUsername} />
                                <Input
                                    name="password"
                                    label="Password"
                                    type="password"
                                    required
                                    validator={validatePassword}
                                />
                            </Form>
                        </div>
                    </WithMock>
                }
                code={`const validatePassword = (value: any): string | undefined => {
    if (!value) return undefined;
    const s = String(value);
    if (s.length < 8)              return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(s))          return 'Password must contain at least one uppercase letter';
    if (!/\\d/.test(s))             return 'Password must contain at least one number';
    if (!/[^A-Za-z0-9]/.test(s))   return 'Password must contain at least one special character';
    return undefined;
};

const validateUsername = (value: any): string | undefined => {
    if (!value) return undefined;
    const s = String(value);
    if (s.length < 3)                   return 'Username must be at least 3 characters';
    if (s.length > 20)                  return 'Username must be at most 20 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(s))    return 'Username may only contain letters, numbers and underscores';
    return undefined;
};

<Form dataStoragePath="/demo" aspect="card">
    <Input name="username" label="Username" required validator={validateUsername} />
    <Input name="password" label="Password" type="password" required validator={validatePassword} />
</Form>`}
            />

            {/* ── 4. Numeric range validator ────────────────────────────── */}
            <Section
                title="Numeric range validator"
                description="Validators work on any input type including numbers. Here age must be between 18 and 120."
                preview={
                    <WithMock>
                        <div className="w-full max-w-lg">
                            <Form
                                dataStoragePath="/demo"
                                aspect="card"
                                setPrimaryKey={() => `rec_${Date.now()}`}
                                onFinally={async () => { alert('Saved!'); return false; }}
                            >
                                <Input name="name" label="Full name" required />
                                <Input
                                    name="age"
                                    label="Age"
                                    type="number"
                                    required
                                    validator={validateAge}
                                />
                                <Select
                                    name="country"
                                    label="Country"
                                    required
                                    options={COUNTRY_OPTIONS}
                                    validator={(value) =>
                                        value === 'us'
                                            ? undefined
                                            : 'Only US residents are supported in this demo'
                                    }
                                />
                            </Form>
                        </div>
                    </WithMock>
                }
                code={`const validateAge = (value: any): string | undefined => {
    if (value === undefined || value === null || value === '') return undefined;
    const n = Number(value);
    if (isNaN(n))  return 'Age must be a number';
    if (n < 18)    return 'You must be at least 18 years old';
    if (n > 120)   return 'Age must be realistic (≤ 120)';
    return undefined;
};

<Form dataStoragePath="/demo" aspect="card">
    <Input  name="name"    label="Full name" required />
    <Input  name="age"     label="Age"       type="number" required validator={validateAge} />
    <Select name="country" label="Country"   required options={COUNTRY_OPTIONS}
        validator={(value) =>
            value === 'us' ? undefined : 'Only US residents are supported in this demo'
        }
    />
</Form>`}
            />

            {/* ── 5. Mixed: required + custom on every field ─────────────── */}
            <Section
                title="Full registration form"
                description="All patterns combined: required fields, email format, password strength, username rules and a textarea. Try to submit empty, then with invalid values."
                preview={
                    <WithMock>
                        <div className="w-full max-w-lg">
                            <Form
                                dataStoragePath="/users"
                                aspect="card"
                                setPrimaryKey={() => `user_${Date.now()}`}
                                onFinally={async () => { alert('Registration saved!'); return false; }}
                            >
                                <Input name="username" label="Username"        required validator={validateUsername} />
                                <Input name="email"    label="Email"           required validator={validateEmail} />
                                <Input name="phone"    label="Phone"                    validator={validatePhone} />
                                <Input
                                    name="password"
                                    label="Password"
                                    type="password"
                                    required
                                    validator={validatePassword}
                                />
                                <Select
                                    name="country"
                                    label="Country"
                                    required
                                    options={COUNTRY_OPTIONS}
                                />
                                <TextArea
                                    name="bio"
                                    label="Bio"
                                    rows={3}
                                    validator={(value) => {
                                        if (!value) return undefined;
                                        return String(value).length > 500
                                            ? 'Bio must be at most 500 characters'
                                            : undefined;
                                    }}
                                />
                            </Form>
                        </div>
                    </WithMock>
                }
                code={`<Form dataStoragePath="/users" aspect="card" setPrimaryKey={() => \`user_\${Date.now()}\`}>
    <Input    name="username" label="Username" required validator={validateUsername} />
    <Input    name="email"    label="Email"    required validator={validateEmail} />
    <Input    name="phone"    label="Phone"             validator={validatePhone} />
    <Input    name="password" label="Password" type="password" required validator={validatePassword} />
    <Select   name="country"  label="Country"  required options={COUNTRY_OPTIONS} />
    <TextArea name="bio"      label="Bio"       rows={3}
        validator={(value) =>
            String(value).length > 500 ? 'Bio must be at most 500 characters' : undefined
        }
    />
</Form>`}
            />

            {/* ── 6. Inline validator (no import) ───────────────────────── */}
            <Section
                title="Inline validator"
                description="For simple one-off rules, pass an arrow function directly to the validator prop — no need to define it separately."
                preview={
                    <WithMock>
                        <div className="w-full max-w-lg">
                            <Form
                                dataStoragePath="/demo"
                                aspect="card"
                                setPrimaryKey={() => `rec_${Date.now()}`}
                                onFinally={async () => { alert('Saved!'); return false; }}
                            >
                                <Input
                                    name="code"
                                    label="Promo code"
                                    required
                                    validator={(value) =>
                                        /^[A-Z]{3}\d{3}$/.test(String(value ?? ''))
                                            ? undefined
                                            : 'Code must match pattern ABC123 (3 uppercase letters + 3 digits)'
                                    }
                                />
                                <Input
                                    name="handle"
                                    label="Twitter handle"
                                    validator={(value) => {
                                        if (!value) return undefined;
                                        return /^@[A-Za-z0-9_]{1,15}$/.test(String(value))
                                            ? undefined
                                            : 'Handle must start with @ and be 1–15 alphanumeric characters';
                                    }}
                                />
                            </Form>
                        </div>
                    </WithMock>
                }
                code={`<Form dataStoragePath="/demo" aspect="card">
    <Input
        name="code"
        label="Promo code"
        required
        validator={(value) =>
            /^[A-Z]{3}\\d{3}$/.test(String(value ?? ''))
                ? undefined
                : 'Code must match pattern ABC123 (3 uppercase letters + 3 digits)'
        }
    />
    <Input
        name="handle"
        label="Twitter handle"
        validator={(value) => {
            if (!value) return undefined;
            return /^@[A-Za-z0-9_]{1,15}$/.test(String(value))
                ? undefined
                : 'Handle must start with @ and be 1–15 alphanumeric characters';
        }}
    />
</Form>`}
            />

            <PropDocsTable props={VALIDATOR_PROPS} />
        </PageLayout>
    );
}
