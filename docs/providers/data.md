---
title: DataProvider
group: Service providers
order: 20
path: /providers/data
description: Use records from mock data, Firebase, Supabase or your own backend without changing UI components.
---

# DataProvider

`DataProvider` is the service behind record-based UI. It powers `Grid`, `Form`, data-backed fields and any custom screen that needs to read or write records.

## Supported data services

| Driver | Backend | Best for |
|---|---|---|
| `mock` | In-memory data | local demos, tests, scaffolded apps |
| `dbRealtime` | Firebase Realtime Database | realtime CRUD apps |
| `firestoreDb` | Cloud Firestore | Firestore collections with onSnapshot realtime |
| `supabaseDb` | Supabase Postgres | Supabase-backed apps with Postgres Realtime |
| custom | Your adapter | REST, GraphQL, internal APIs |

For complete provider configuration options, see [AppProvidersConfig](/docs/app-configuration#appprovidersconfig).

## Configuration state

Built-in data providers expose whether their required configuration is present:

- `mock` is always configured.
- `dbRealtime` and `firestoreDb` check the Firebase config keys.
- `supabaseDb` checks `supabase.url` and `supabase.anonKey`.

Custom data providers can implement `isConfigured()` or `getConfigurationState()` when their endpoint or API key is optional at runtime.

## Use data with Grid

`Grid` subscribes to the active `DataProvider` when `path` points to a provider collection.

```tsx
import { Grid, Badge } from '@llmnative/react';

function CustomersPage() {
  return (
    <Grid
      path="/customers"
      order={{ name: "asc" }}
      title="Customers"
      columns={[
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email' },
        {
          key: 'status',
          label: 'Status',
          render: ({ value }) => (
            <Badge type={value === 'active' ? 'success' : 'secondary'}>
              {value}
            </Badge>
          ),
        },
      ]}
      form={<CustomerFormFields />}
      pagination={{ limit: 20, align: 'end' }}
    />
  );
}
```

The page above works with mock data, Firebase or any custom provider as long as the active provider implements the data contract.

When you use `onSelectionChange` or `onReorder`, `Grid` maps the visual rows back to the original provider records before invoking your callback.

## Use data with Form

`Form` loads and saves one record through the active provider.

```tsx
import { Form, Input, Select } from '@llmnative/react';

function CustomerForm({ id }: { id: string }) {
  return (
    <Form path={`/customers/${id}`}>
      <Input name="name" label="Name" required />
      <Input name="email" label="Email" type="email" required />
      <Select
        name="status"
        label="Status"
        options={[
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ]}
      />
    </Form>
  );
}
```

## Use data in custom components

Use `useDataProvider()` when the screen is custom and not covered by `Grid` or `Form`.

```tsx
import { useDataProvider } from '@llmnative/react';

function CustomerStats() {
  const data = useDataProvider();
  const [stats, setStats] = React.useState({ total: 0, active: 0 });

  React.useEffect(() => {
    data.read('/customers').then((records) => {
      const list = Object.values(records ?? {}) as Array<{ status?: string }>;
      setStats({
        total: list.length,
        active: list.filter((item) => item.status === 'active').length,
      });
    });
  }, [data]);

  return (
    <dl>
      <dt>Total</dt>
      <dd>{stats.total}</dd>
      <dt>Active</dt>
      <dd>{stats.active}</dd>
    </dl>
  );
}
```

## Realtime records

For live lists, use `subscribe()`. This is the same primitive used internally by `Grid`; React components should call it from `useEffect`.

```tsx
function LiveCustomers() {
  const data = useDataProvider();
  const [records, setRecords] = React.useState([]);

  React.useEffect(() => {
    return data.subscribe('/customers', setRecords, {
      order: { name: 'asc' },
    });
  }, [data]);

  return (
    <ul>
      {records.map((customer) => (
        <li key={customer._key}>{customer.name}</li>
      ))}
    </ul>
  );
}
```

## Minimal configuration

```tsx
<App
  providers={{
    mock: { data: mockData },
    services: { data: 'mock' },
  }}
/>
```

See [FirebaseConfig](/docs/app-configuration#firebaseconfig), [SupabaseProviderConfig](/docs/app-configuration#supabaseproviderconfig) and [environment config](/docs/app-configuration#reading-config-from-environment) for credential examples.

## Custom DataProvider

Create a custom provider when your records live behind a REST API, GraphQL endpoint or internal SDK.

```ts
import type { DataProviderAdapter, RecordArray } from '@llmnative/react';

export class RestDataProvider implements DataProviderAdapter {
  constructor(private baseUrl: string) {}

  isConfigured() {
    return Boolean(this.baseUrl);
  }

  getConfigurationState() {
    return this.isConfigured()
      ? { configured: true }
      : {
          configured: false,
          reason: 'RestDataProvider is not configured. Missing: baseUrl.',
          missingKeys: ['baseUrl'],
        };
  }

  async read(path: string) {
    return fetch(this.baseUrl + path).then((res) => res.json());
  }

  async set(path: string, data: object) {
    await fetch(this.baseUrl + path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async update(path: string, data: object) {
    await fetch(this.baseUrl + path, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  }

  async remove(path: string) {
    await fetch(this.baseUrl + path, { method: 'DELETE' });
  }

  subscribe(path: string | undefined, setRecords: (records: RecordArray) => void) {
    if (!path) return () => undefined;

    this.read(path).then((data) => {
      const records = Object.entries(data ?? {}).map(([key, value], index) => ({
        _key: key,
        _index: index,
        ...(value as object),
      }));
      setRecords(records);
    });

    return () => undefined;
  }
}
```

Register it once:

```tsx
<App
  providers={{
    custom: { data: new RestDataProvider('/api') },
    services: { data: 'custom' },
  }}
/>
```
