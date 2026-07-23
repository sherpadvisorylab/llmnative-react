import React from 'react';
import { AsyncDropdown, Icon } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PlaygroundConfig, PropDef } from '../../docs-kit/playground';

type Workspace = { id: string; name: string; description: string; icon: string };

const workspaces: Workspace[] = [
    { id: 'acme', name: 'Acme Corp', description: 'Production workspace', icon: 'building-2' },
    { id: 'blog', name: 'Blog Dev', description: 'Content experimentation', icon: 'newspaper' },
    { id: 'design', name: 'Design Studio', description: 'Design system workspace', icon: 'palette' },
    { id: 'retail', name: 'Retail Group', description: 'Commerce operations', icon: 'store' },
];

const sleep = (milliseconds: number, signal: AbortSignal) => new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(resolve, milliseconds);
    signal.addEventListener('abort', () => { window.clearTimeout(timeout); reject(new DOMException('Aborted', 'AbortError')); }, { once: true });
});

export default function AsyncDropdownPage() {
    const [selectedId, setSelectedId] = React.useState('acme');
    const loadWorkspaces = React.useCallback(async (query: string, signal: AbortSignal) => {
        await sleep(250, signal);
        const normalized = query.trim().toLowerCase();
        return normalized ? workspaces.filter((item) => item.name.toLowerCase().includes(normalized)) : workspaces;
    }, []);

    const props = React.useMemo<PropDef[]>(() => [
        { name: 'trigger', type: 'string | ReactNode | TriggerConfig', required: true, description: 'The Dropdown trigger. Inherited from Dropdown.', control: 'text' },
        { name: 'loadItems', type: '(query: string, signal: AbortSignal) => Promise<TItem[]>', required: true, description: 'Async reader called on open and after debounced searches.' },
        { name: 'getItemId', type: '(item: TItem) => string', required: true, description: 'Returns the stable item identity.' },
        { name: 'renderItem', type: '(item: TItem) => ReactNode', required: true, description: 'Renders a result row.' },
        { name: 'onSelect', type: '(item: TItem) => void | Promise<void>', required: true, description: 'Handles selection before optional automatic close.' },
        { name: 'selectedId', type: 'string | null', description: 'Current item identity; receives selected row styling.', control: 'text' },
        { name: 'searchPlaceholder', type: 'string', description: 'Overrides the localized search placeholder.', control: 'text' },
        { name: 'emptyState', type: 'ReactNode', description: 'Content displayed for an empty result set.', control: 'text' },
        { name: 'loadingState', type: 'ReactNode', description: 'Content displayed while the loader is pending.', control: 'text' },
        { name: 'errorState', type: '(error: unknown) => ReactNode', description: 'Optional custom error renderer.' },
        { name: 'debounceMs', type: 'number', default: '200', description: 'Delay before running non-empty search queries.', control: 'number' },
        { name: 'closeOnSelect', type: 'boolean', default: 'true', description: 'Closes the dropdown after onSelect settles.', control: 'boolean' },
        { name: 'header', type: 'ReactNode', description: 'Optional content below the search field.', control: 'text' },
        { name: 'footer', type: 'ReactNode', description: 'Standard Dropdown footer content.', control: 'text' },
        { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (open) => void', description: 'Standard controlled and uncontrolled Dropdown state.' },
        { name: 'position / placement / strategy', type: '"start" | "end" / "auto" | "top" | "bottom" / "fixed" | "absolute"', description: 'Standard Dropdown positioning props.' },
        { name: 'wrapperClassName / className / triggerClassName / menuClassName', type: 'string', description: 'Standard UIProps and Dropdown styling overrides.' },
        { name: 'inputClassName / selectedClassName', type: 'string', description: 'Style overrides for the search field and current result.', control: 'text' },
        { name: 'motion', type: 'MotionReference', description: 'Standard framework motion override.' },
    ], []);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props,
        defaultProps: {
            trigger: 'Switch workspace',
            searchPlaceholder: 'Search workspaces…',
            emptyState: 'No workspace found',
            debounceMs: 200,
            closeOnSelect: true,
            placement: 'bottom',
            position: 'start',
            defaultOpen: true,
            inputClassName: '',
            selectedClassName: '',
        },
        render: (values) => (
            <AsyncDropdown
                key={`${values.defaultOpen}-${values.placement}-${values.position}`}
                trigger={values.trigger || 'Switch workspace'}
                defaultOpen={values.defaultOpen}
                placement={values.placement || undefined}
                position={values.position || undefined}
                searchPlaceholder={values.searchPlaceholder || undefined}
                emptyState={values.emptyState || undefined}
                debounceMs={Number(values.debounceMs) || 0}
                closeOnSelect={Boolean(values.closeOnSelect)}
                selectedId={selectedId}
                loadItems={loadWorkspaces}
                getItemId={(item) => item.id}
                onSelect={(item) => setSelectedId(item.id)}
                inputClassName={values.inputClassName || undefined}
                selectedClassName={values.selectedClassName || undefined}
                renderItem={(item) => <WorkspaceRow item={item} />}
            />
        ),
    }), [loadWorkspaces, props, selectedId]);

    usePlayground(playground, 'AsyncDropdown playground');

    return (
        <PageLayout title="AsyncDropdown" description="A framework-native searchable Dropdown with cancellable async loading, shared theme, icon and localization behavior.">
            <Section
                title="Async entity switcher"
                description="Use AsyncDropdown for sites, tenants, editor entities and any resource that must be loaded on demand. The framework handles the search field, loading, empty/error states and menu lifecycle; your application supplies only the reader and selection action."
                preview={<div className="min-h-72 pt-3 pr-3"><AsyncDropdown trigger="Switch workspace" defaultOpen selectedId={selectedId} loadItems={loadWorkspaces} getItemId={(item) => item.id} renderItem={(item) => <WorkspaceRow item={item} />} onSelect={(item) => setSelectedId(item.id)} /></div>}
                code={`import { AsyncDropdown } from '@llmnative/react';

<AsyncDropdown
  trigger="Switch workspace"
  selectedId={currentId}
  loadItems={(query, signal) => workspaceRepository.search(query, signal)}
  getItemId={(workspace) => workspace.id}
  renderItem={(workspace) => <WorkspaceRow item={workspace} />}
  onSelect={(workspace) => setCurrentWorkspace(workspace)}
/>`}
            />
            <Section
                title="Selection and search"
                description="Results are loaded when the menu opens. Typing debounces the next request and aborts stale work, so late responses cannot overwrite newer results."
                preview={<div className="min-h-72 pt-3 pr-3"><AsyncDropdown trigger="Find a workspace" defaultOpen selectedId={selectedId} searchPlaceholder="Type a workspace name…" emptyState="Nothing matches this search" loadItems={loadWorkspaces} getItemId={(item) => item.id} renderItem={(item) => <WorkspaceRow item={item} />} onSelect={(item) => setSelectedId(item.id)} /></div>}
                code={`<AsyncDropdown
  trigger="Find a workspace"
  searchPlaceholder="Type a workspace name…"
  debounceMs={200}
  emptyState="Nothing matches this search"
  loadItems={searchWorkspaces}
  getItemId={(item) => item.id}
  renderItem={(item) => item.name}
  onSelect={selectWorkspace}
/>`}
            />
            <PropDocsTable props={props} title="Properties" />
        </PageLayout>
    );
}

function WorkspaceRow({ item }: { item: Workspace }) {
    return (
        <span className="flex min-w-0 items-center gap-2">
            <Icon name={item.icon} size={16} className="shrink-0 text-muted-foreground" />
            <span className="min-w-0"><span className="block truncate font-medium">{item.name}</span><span className="block truncate text-xs text-muted-foreground">{item.description}</span></span>
        </span>
    );
}
