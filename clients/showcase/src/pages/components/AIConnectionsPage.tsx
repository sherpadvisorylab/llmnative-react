import React, { useMemo } from 'react';
import { AIConnections, type AIConnectionStore, type AIConnectionsSnapshot, type AIConnector } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import type { PropDef } from '../../docs-kit/playground';

const PROPS: PropDef[] = [
    { name: 'store', type: 'AIConnectionStore', description: 'The port of the app: load, connect (checks with the provider), disconnect; optional accounts, order, models. The secrets stay behind it.' },
    { name: 'allow / hide', type: 'string[]', description: 'Only these providers / not these.' },
    { name: 'readOnly', type: 'boolean', default: 'false', description: 'Shown, not changed: what the app fixes in its code.' },
    { name: 'subscriptions', type: 'string[]', default: "['opencode-go']", description: 'The providers listed with the subscriptions.' },
    { name: 'connectors', type: 'AIConnector[]', description: 'Connectors of the app next to the providers: a form of fields (e.g. the address and access of a runner) or a content of their own.' },
    { name: 'region', type: "{ preferred, mode?: 'recommend' | 'require' }", description: 'The data region the app prefers: other models are marked, or refused.' },
    { name: 'orderProviders', type: 'string[]', description: 'Which ids enter the order of the providers.' },
    { name: 'renderProvider', type: '(id) => ReactNode', description: 'More in the modal of a connected provider (e.g. the model its chats start with).' },
];

/** A store in memory, for the demo: a key that starts with "bad" is refused. */
function demoStore(): AIConnectionStore {
    let snapshot: AIConnectionsSnapshot = {
        providers: [{ id: 'vertex', fields: { projectId: 'my-project', location: 'eu' } }],
        order: { list: ['claude-code', 'vertex'], manual: false },
    };
    return {
        load: async () => snapshot,
        connect: async (provider, fields) => {
            if (Object.values(fields).some((value) => value.startsWith('bad'))) return { ok: false, error: 'the provider refused the key' };
            const visible = Object.fromEntries(Object.entries(fields).filter(([key]) => !/key|secret|serviceAccount/i.test(key)));
            snapshot = { ...snapshot, providers: [...snapshot.providers.filter((entry) => entry.id !== provider), { id: provider, fields: visible }] };
            return { ok: true };
        },
        disconnect: async (provider) => {
            snapshot = { ...snapshot, providers: snapshot.providers.filter((entry) => entry.id !== provider) };
        },
        setOrder: async (order) => {
            snapshot = { ...snapshot, order: { list: order ?? ['claude-code', 'vertex'], manual: Boolean(order) } };
        },
        models: async (provider) => provider === 'vertex'
            ? [
                { id: 'vertex/gemini-3.5-flash', provider, model: 'gemini-3.5-flash', label: 'gemini-3.5-flash', dataRegion: 'eu', structuredOutput: 'native', pricing: { input: 0.3, output: 2.5, currency: 'USD', source: 'models.dev' } },
                { id: 'vertex/gemini-3.5-flash-lite', provider, model: 'gemini-3.5-flash-lite', label: 'gemini-3.5-flash-lite', dataRegion: 'eu', structuredOutput: 'native' },
            ]
            : [{ id: `${provider}/model`, provider, model: 'a-model', label: 'a-model', dataRegion: 'unknown', structuredOutput: 'prompted' }],
    };
}

const RUNNER: AIConnector = {
    id: 'claude-code',
    label: 'Claude Code',
    description: 'The subscription of Claude, used by the agents on a runner. Name the runner and how to reach it: several apps can share one.',
    icon: 'terminal',
    connected: false,
    fields: [
        { key: 'runnerUrl', label: 'Runner address', type: 'text', placeholder: 'https://runner.example.com' },
        { key: 'runnerToken', label: 'Runner access', type: 'password' },
    ],
    connect: async () => ({ ok: true }),
};

function Demo() {
    const store = useMemo(demoStore, []);
    return <AIConnections store={store} allow={['vertex', 'anthropic', 'gemini', 'openai', 'mistral']} connectors={[RUNNER]} region={{ preferred: 'eu' }} />;
}

export default function AIConnectionsPage() {
    return (
        <PageLayout
            title="AIConnections"
            description="The page where an app connects its AI providers: keys, accounts, order, the models with where they process the data, and the connectors of the app."
        >
            <Section
                title="Providers and a runner"
                description="Vertex AI is connected: open it to see its models and their data region. A key that starts with “bad” is refused by the demo store. Claude Code is a connector of the app, with the address of its runner."
                preview={<Demo />}
                code={`import { AIConnections } from '@llmnative/react';

<AIConnections
    store={connectionsStore}          // the app's port: secrets never come back to the page
    region={{ preferred: 'eu' }}      // models outside the EU are marked
    connectors={[claudeCodeOnRunner]} // a subscription on a runner the app names
/>`}
            />
            <PropDocsTable props={PROPS} title="AIConnections props" />
        </PageLayout>
    );
}
