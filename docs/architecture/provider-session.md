---
title: ProviderSession & ProviderSwitcher
group: Architecture
order: 48
path: /docs/provider-session
description: Switch the active data/storage backend at runtime — useful for multi-tenant, demo-to-production, or backend-switching apps.
---

# ProviderSession & ProviderSwitcher

These two tools let an app switch its active backend (data, storage, or any custom category) at runtime, without a page reload. The same component can connect to a different Firebase project, a different Supabase instance, or a different mock dataset on the fly.

## ProviderSession — the switch engine

`useProviderSession()` returns a `switchSession()` function that takes either:

- a **URL** — `POST`ed with `{ id }` to a backend endpoint that returns the session assignment
- a **resolver function** — called with the picked id, returns the same shape directly (for mock/dev or Firebase Callable Functions)

### Response shape

```ts
interface ProviderSessionResponse {
    providers: Record<string, {
        type: string;                          // 'firebase' | 'supabase' | 'mock' | ...
        publicConfig: Record<string, unknown>; // never a secret
        credential?: { type: string, token?: string, ... };
    }>;
}
```

The `type` field is matched against a registry of **factories**. Built-in factories handle:

| Category | Types |
|----------|-------|
| `data` | `firebase` (Firestore), `supabase`, `mock` |
| `storage` | `firebase`, `supabase` |

### Custom factories

Register your own for any category:

```ts
import { registerProviderSessionFactory } from '@llmnative/react';

registerProviderSessionFactory('ai', 'custom', async (assignment) => {
    return new CustomAIProvider(assignment.publicConfig);
});
```

### Usage

```tsx
import { useProviderSession } from '@llmnative/react';

function SessionButton() {
    const { switchSession } = useProviderSession();

    return (
        <button onClick={async () => {
            const result = await switchSession(
                '/api/session/workspace-123',
                { fetchOptions: { headers: { Authorization: 'Bearer ...' } } },
            );
            console.log('Applied:', result.applied);
            console.log('Skipped (no factory):', result.skipped);
        }}>
            Switch to workspace 123
        </button>
    );
}
```

The return value tells you which categories were actually switched (`applied`) and which ones had no matching factory and were silently ignored (`skipped`).

## ProviderSwitcher — the ready-made UI

`ProviderSwitcher` is a dropdown component that wraps the entire switch flow: fetch items, show a list, call the endpoint on selection, apply the response, and report success/failure.

```tsx
import { ProviderSwitcher } from '@llmnative/react';

function WorkspaceSwitcher() {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [items, setItems] = useState<ProviderSwitcherItem[]>([]);

    useEffect(() => {
        setItems([
            { id: 'ws-1', label: 'Acme Corp', icon: 'building-2' },
            { id: 'ws-2', label: 'Globex Inc', icon: 'building-2' },
        ]);
    }, []);

    return (
        <ProviderSwitcher
            items={items}
            activeId={activeId}
            endpoint="/api/session"
            caption="Workspace"
            onSelect={(id) => setActiveId(id)}
            onError={(id, error) => console.error('Switch failed', id, error)}
        />
    );
}
```

### Key props

| Prop | Type | Description |
|------|------|-------------|
| `items` | `ProviderSwitcherItem[]` | List of options (`id`, `label`, `meta?`, `icon?`) |
| `activeId` | `string \| null` | Currently selected item |
| `endpoint` | `string \| ((id) => Promise<...>)` | Session endpoint URL or resolver function |
| `itemsLoading` | `boolean` | Shows spinner while items are being fetched |
| `onSelect` | `(id) => void` | Fires only after the switch actually succeeds |
| `onError` | `(id, error) => void` | Fires if the switch throws |
| `authorization` | `string \| (() => string \| Promise<string>)` | Override the auth token (defaults to the app's own auth provider) |
| `caption` | `ReactNode` | Small label under the active item (e.g. "Workspace") |
| `icon` | `string \| ReactNode` | Icon for the trigger and default per-item icon |

### How it works

1. User picks an item from the dropdown
2. The switcher calls `getAccessToken()` on the app's registered auth provider (or uses the explicit `authorization` prop)
3. It `POST`s to `endpoint` with `{ id: pickedId }` (or calls the resolver function)
4. The response is fed to `switchSession()` which resolves each category through the factory registry and calls `setProvider()` for each
5. `onSelect` fires — the caller updates `activeId` and the UI reflects the change

No loading spinners, error boundaries, or request plumbing needed in the consumer.

## Related pages

- [Provider registry](/docs/app-configuration#appprovidersconfig)
- [App reference](/docs/app-configuration)
