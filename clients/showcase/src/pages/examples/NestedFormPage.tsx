import React from 'react';
import { MockDataProvider, DataProvider, Form, Input, Repeat } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import { Section } from '../../docs-kit/page';
import { useShowcaseNestedFormI18n, useShowcaseCommonI18n } from '../../showcase/i18n';

const CONTACT_SEED = {
    'contacts/1': {
        firstName: 'Mario',
        lastName: 'Rossi',
        address: { street: 'Via Roma 1', city: 'Milano', zip: '20100' },
        phoneNumbers: [
            { label: 'Mobile', number: '+39 333 1234567' },
            { label: 'Work', number: '+39 02 9876543' },
        ],
    },
};

const mockProvider = new MockDataProvider({ '/contacts': CONTACT_SEED });

function WithMock({ children }: { children: React.ReactNode; }) {
    const scoped = React.useMemo(() => mockProvider, []);
    return <DataProvider registry={{ default: scoped }} defaultKey="default">{children}</DataProvider>;
}

const NESTED_CODE = `<Form path="/contacts">
  {/* Flat fields */}
  <Input name="firstName" label="First name" required />
  <Input name="lastName" label="Last name" required />

  {/* Dot notation — saved as { address: { street, city, zip } } */}
  <Input name="address.street" label="Street" />
  <Input name="address.city" label="City" />
  <Input name="address.zip" label="ZIP code" />

  {/* Dynamic array with Repeat */}
  <Repeat name="phoneNumbers">
    {(index, { remove }) => (
      <div className="flex gap-2 items-end">
        <Input name={\`phoneNumbers.\${index}.label\`} label="Label" />
        <Input name={\`phoneNumbers.\${index}.number\`} label="Number" />
        <button onClick={remove} className="btn btn-sm btn-danger mb-1">×</button>
      </div>
    )}
  </Repeat>
</Form>`;

const SEED_CODE = `const seed = {
  'contacts/1': {
    firstName: 'Mario',
    lastName: 'Rossi',
    address: { street: 'Via Roma 1', city: 'Milano', zip: '20100' },
    phoneNumbers: [
      { label: 'Mobile', number: '+39 333 1234567' },
    ],
  },
};`;

export default function NestedFormPage() {
    const common = useShowcaseCommonI18n();
    const t = useShowcaseNestedFormI18n();
    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.seedData.title}
                description={t.sections.seedData.description}
                code={SEED_CODE}
            />
            <Section
                title={t.sections.liveForm.title}
                description={t.sections.liveForm.description}
                preview={
                    <WithMock>
                        <Form path="/contacts/1" appearance="card" showBack={false}>
                            <Input name="firstName" label="First name" required />
                            <Input name="lastName" label="Last name" required />
                            <Input name="address.street" label="Street" />
                            <Input name="address.city" label="City" />
                            <Input name="address.zip" label="ZIP code" />
                            <Repeat name="phoneNumbers">
                                {(index, { remove }) => (
                                    <div className="flex gap-2 items-end">
                                        <Input name={`phoneNumbers.${index}.label`} label="Label" />
                                        <Input name={`phoneNumbers.${index}.number`} label="Number" />
                                        <button onClick={remove} className="btn btn-sm btn-danger mb-1">×</button>
                                    </div>
                                )}
                            </Repeat>
                        </Form>
                    </WithMock>
                }
                code={NESTED_CODE}
            />
        </PageLayout>
    );
}
