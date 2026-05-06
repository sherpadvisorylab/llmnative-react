import React from 'react';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';

export default function DataProviderPage() {
    return (
        <PageLayout
            title="DataProvider interface"
            description="DataProvider is the data access contract used by Form, Grid and application code. App registers the default provider once, then components consume it through framework hooks."
        >
            <div className="space-y-8">
                <Section
                    title="Contract"
                    description="Every data adapter implements the same CRUD and subscription surface."
                    preview={
                        <div className="grid gap-2 text-sm md:grid-cols-5 w-full">
                            {['read', 'set', 'update', 'remove', 'useListener'].map((method) => (
                                <div key={method} className="rounded-md border bg-card p-3 font-medium">{method}</div>
                            ))}
                        </div>
                    }
                    code={`export interface DataProvider {
  read(path: string, options?: ReadOptions): Promise<any>;
  set(path: string, data: object, exception?: boolean): Promise<void>;
  update(path: string, data: object, exception?: boolean): Promise<void>;
  remove(path: string, exception?: boolean): Promise<void>;
  useListener(
    path: string | undefined,
    setRecords: (records: RecordArray) => void,
    options?: DatabaseOptions
  ): void;

  count?(path: string): Promise<number>;
  readShallow?(path: string, exception?: boolean): Promise<string[]>;
  setChunks?(path: string, data: object, options?: SetChunksOptions): Promise<void>;
}`}
                />

                <Section
                    title="Scaffold default"
                    description="New Vite consumers start with MockDataProvider and app-local data in src/data/mockData.ts."
                    preview={
                        <div className="alert alert-success text-sm w-full">
                            MockDataProvider is useful for demos, local development and documentation examples.
                        </div>
                    }
                    code={`// src/data/mockData.ts
export const mockData = {
  '/tasks': {
    'task-1': { title: 'Review scaffold structure', status: 'done' },
    'task-2': { title: 'Connect your first provider', status: 'next' },
  },
};

// src/index.tsx
import { App, MockDataProvider } from 'react-firestrap';
import { mockData } from './data/mockData';

const dataProvider = new MockDataProvider(mockData);

<App
  menuConfig={menu}
  LayoutDefault={AppLayout}
  dataProvider={dataProvider}
/>`}
                />

                <Section
                    title="Provider selection"
                    description="Drive provider choice from VITE_DATA_PROVIDER and register one or more adapters in App."
                    preview={
                        <div className="grid gap-2 text-sm md:grid-cols-4 w-full">
                            {['firebase', 'supabase', 'mock', 'custom'].map((provider) => (
                                <div key={provider} className="rounded-md border bg-card p-3">{provider}</div>
                            ))}
                        </div>
                    }
                    code={`import {
  App,
  FirebaseDataProvider,
  MockDataProvider,
  SupabaseDataProvider,
} from 'react-firestrap';

const env = import.meta.env;

<App
  menuConfig={menu}
  LayoutDefault={AppLayout}
  providers={{
    data: {
      firebase: new FirebaseDataProvider(),
      mock: new MockDataProvider(mockData),
      supabase: new SupabaseDataProvider({
        url: env.VITE_SUPABASE_URL,
        anonKey: env.VITE_SUPABASE_ANON_KEY,
      }),
    },
  }}
  defaultProviders={{
    data: env.VITE_DATA_PROVIDER ?? 'mock',
  }}
/>`}
                />

                <Section
                    title="Consume the default provider"
                    description="Most app code should consume the default provider selected by App."
                    preview={
                        <div className="alert alert-info text-sm w-full">
                            Form and Grid do this internally when you pass dataStoragePath.
                        </div>
                    }
                    code={`import { useDataProvider } from 'react-firestrap';

function UserCount() {
  const data = useDataProvider();
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    data.read('/users').then((records) => {
      setCount(Object.keys(records ?? {}).length);
    });
  }, [data]);

  return <span>{count} users</span>;
}`}
                />

                <Section
                    title="Real-time listener"
                    description="useListener is a hook-shaped provider method. It keeps framework widgets and custom screens in sync."
                    preview={
                        <div className="grid gap-3 text-sm md:grid-cols-2 w-full">
                            <div className="rounded-md border bg-card p-4">
                                <p className="font-semibold">RecordArray</p>
                                <p className="mt-1 text-xs text-muted-foreground">Records include _key and _index.</p>
                            </div>
                            <div className="rounded-md border bg-card p-4">
                                <p className="font-semibold">DatabaseOptions</p>
                                <p className="mt-1 text-xs text-muted-foreground">where, order, fieldMap, onLoad.</p>
                            </div>
                        </div>
                    }
                    code={`import { useDataProvider } from 'react-firestrap';

function UsersList() {
  const data = useDataProvider();
  const [records, setRecords] = React.useState([]);

  data.useListener('/users', setRecords, {
    order: { name: 'asc' },
  });

  return (
    <ul>
      {records.map((record) => (
        <li key={record._key}>{record.name}</li>
      ))}
    </ul>
  );
}`}
                />

                <Section
                    title="Framework widgets"
                    description="Grid and Form are provider-agnostic. They only need a storage path; the active DataProvider handles the backend."
                    preview={
                        <div className="flex flex-wrap gap-2">
                            {['Grid', 'Form', 'dataStoragePath'].map((item) => (
                                <span key={item} className="badge bg-secondary">{item}</span>
                            ))}
                        </div>
                    }
                    code={`import { Grid, Form, Input } from 'react-firestrap';

function UsersGrid() {
  return (
    <Grid
      dataStoragePath="/users"
      columns={[
        { key: 'name', label: 'Name', sort: true },
        { key: 'email', label: 'Email' },
      ]}
      allowedActions={['add', 'edit', 'delete']}
      modal={{ mode: 'form' }}
    >
      {() => (
        <>
          <Input name="name" label="Name" required />
          <Input name="email" label="Email" inputType="email" />
        </>
      )}
    </Grid>
  );
}`}
                />

                <Section
                    title="Custom provider"
                    description="Implement DataProvider when an app needs a backend that is not built into react-firestrap."
                    preview={
                        <div className="alert alert-warning text-sm w-full">
                            Custom providers belong to the consumer app only when the built-ins are not enough.
                        </div>
                    }
                    code={`import type { DataProvider, RecordArray } from 'react-firestrap';

export class RestDataProvider implements DataProvider {
  async read(path: string) {
    return fetch('/api' + path).then((res) => res.json());
  }

  async set(path: string, data: object) {
    await fetch('/api' + path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async update(path: string, data: object) {
    await fetch('/api' + path, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async remove(path: string) {
    await fetch('/api' + path, { method: 'DELETE' });
  }

  useListener(
    path: string | undefined,
    setRecords: (records: RecordArray) => void
  ) {
    React.useEffect(() => {
      if (!path) return;
      this.read(path).then((data) => {
        const records = Object.entries(data ?? {}).map(([key, value], index) => ({
          _key: key,
          _index: index,
          ...(value as object),
        }));
        setRecords(records);
      });
    }, [path]);
  }
}`}
                />
            </div>
        </PageLayout>
    );
}
