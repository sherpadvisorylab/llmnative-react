# Esempio: DataProviderAdapter custom

Questo esempio mostra un adapter REST minimale. L'obiettivo e' rispettare la stessa interfaccia usata da `Form`, `Grid` e dai test contract.

```ts
import * as React from 'react';
import type {
  DataProviderAdapter,
  DatabaseOptions,
  ReadOptions,
  RecordArray,
} from 'react-firestrap';

export class RestDataProvider implements DataProviderAdapter {
  constructor(private readonly baseUrl: string) {}

  async read(path: string, _options?: ReadOptions): Promise<any> {
    const res = await fetch(this.url(path));
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Read failed: ${res.status}`);
    return res.json();
  }

  async set(path: string, data: object): Promise<void> {
    const res = await fetch(this.url(path), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Set failed: ${res.status}`);
  }

  async update(path: string, data: object): Promise<void> {
    const res = await fetch(this.url(path), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Update failed: ${res.status}`);
  }

  async remove(path: string): Promise<void> {
    const res = await fetch(this.url(path), { method: 'DELETE' });
    if (!res.ok && res.status !== 404) throw new Error(`Delete failed: ${res.status}`);
  }

  subscribe(
    path: string | undefined,
    setRecords: (records: RecordArray) => void,
    _options?: DatabaseOptions
  ): () => void {
    if (!path) return () => undefined;

    let cancelled = false;

    const load = async () => {
      const data = await this.read(path);
      if (cancelled) return;
      setRecords(this.toRecordArray(data));
    };

    load();
    const interval = window.setInterval(load, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }

  private url(path: string): string {
    return `${this.baseUrl}/${path.replace(/^\/+/, '')}`;
  }

  private toRecordArray(data: unknown): RecordArray {
    if (!data) return [];
    if (Array.isArray(data)) {
      return data.map((record, index) => ({ ...record, _index: index }));
    }
    return Object.entries(data as Record<string, any>).map(([key, record], index) => ({
      ...record,
      _key: key,
      _index: index,
    }));
  }
}
```

Nota: `subscribe` e' una primitive provider-agnostic. I componenti React la chiamano dentro `useEffect`, mentre il provider ritorna sempre una funzione di cleanup.

## Uso in App

```tsx
import { App } from 'react-firestrap';
import { RestDataProvider } from './providers/RestDataProvider';

export default function Root() {
  return (
    <App
      providers={{
        custom: {
          data: new RestDataProvider(import.meta.env.VITE_API_URL),
        },
        services: {
          data: 'custom',
        },
      }}
      menuConfig={menu}
      importPage={(path) => import(path)}
    />
  );
}
```

## Test contract

Ogni provider nuovo dovrebbe passare il contract condiviso:

```ts
import { runDataProviderContract } from '../tests/unit/providers/DataProvider.contract';
import { RestDataProvider } from './RestDataProvider';

describe('RestDataProvider contract', () => {
  runDataProviderContract(() => new RestDataProvider('http://localhost:3001'));
});
```

Per un provider REST reale serve un server di test isolato o un mock server che resetti lo stato tra i test.
