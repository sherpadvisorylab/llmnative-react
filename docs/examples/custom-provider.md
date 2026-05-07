# Esempio: DataProvider custom

Questo esempio mostra un adapter REST minimale. L'obiettivo e' rispettare la stessa interfaccia usata da `Form`, `Grid` e dai test contract.

```ts
import * as React from 'react';
import type {
  DataProvider,
  DatabaseOptions,
  ReadOptions,
  RecordArray,
} from 'react-firestrap';

export class RestDataProvider implements DataProvider {
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

  useListener(
    path: string | undefined,
    setRecords: (records: RecordArray) => void,
    _options?: DatabaseOptions
  ): void {
    React.useEffect(() => {
      if (!path) return;

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
    }, [path]);
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

Nota: `useListener` e' un hook-like method per compatibilita con l'API storica. Le implementazioni attuali lo chiamano durante il render di componenti React, quindi possono usare `React.useEffect` internamente.

## Uso in App

```tsx
import { App } from 'react-firestrap';
import { RestDataProvider } from './providers/RestDataProvider';

export default function Root() {
  return (
    <App
      dataProvider={new RestDataProvider(import.meta.env.VITE_API_URL)}
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
