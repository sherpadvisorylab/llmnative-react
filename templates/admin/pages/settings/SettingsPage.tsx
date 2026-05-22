import React from 'react';
import { Form, Input, Select } from '@ash/react';

const timezoneOptions = [
    { label: 'UTC',              value: 'UTC' },
    { label: 'Europe/Rome',      value: 'Europe/Rome' },
    { label: 'America/New_York', value: 'America/New_York' },
    { label: 'Asia/Tokyo',       value: 'Asia/Tokyo' },
];

export default function SettingsPage() {
    return (
        <div className="mx-auto max-w-2xl px-2 py-4">
            <Form
                dataStoragePath="/settings"
                recordId="app"
                aspect="card"
            >
                <Input  name="siteName"     label="Site name"      required />
                <Input  name="supportEmail" label="Support email"  inputType="email" />
                <Select name="timezone"     label="Timezone"       options={timezoneOptions} />
            </Form>
        </div>
    );
}
