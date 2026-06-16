import React from 'react';
import { AuthButton } from '@llmnative/react';
import PageLayout from '../../showcase/page';
import Section from '../../docs-kit/page/Section';
import PropDocsTable from '../../docs-kit/docs/PropDocsTable';
import { usePlayground } from '../../docs-kit/playground';
import type { PlaygroundConfig, PropDef } from '../../docs-kit/playground';
import { useShowcaseAuthI18n } from '../../showcase/i18n';

export default function AuthPage() {
    const t = useShowcaseAuthI18n();

    const authButtonProps = React.useMemo<PropDef[]>(() => [
        { name: 'provider', type: 'string', description: t.propsDocs.items.provider.description, control: 'text' },
        { name: 'intent', type: '"signIn" | "connect" | "signOut" | "disconnect" | "reauthorize"', default: '"signIn"', description: t.propsDocs.items.intent.description, control: 'select', options: ['signIn', 'connect', 'signOut', 'disconnect', 'reauthorize'] },
        { name: 'aspect', type: '"button" | "avatar"', default: '"button"', description: t.propsDocs.items.aspect.description, control: 'select', options: ['button', 'avatar'] },
        { name: 'scopes', type: 'string[]', description: t.propsDocs.items.scopes.description, control: 'json', typeDetails: 'string[]', example: `scopes={['files.metadata.read', 'files.content.read']}` },
        { name: 'iconLogout', type: 'string', default: '"log-out"', description: t.propsDocs.items.iconLogout.description, control: 'icon' },
        { name: 'avatarClass', type: 'string', description: t.propsDocs.items.avatarClass.description, control: 'text' },
        {
            name: 'options',
            type: 'Omit<IButton, "onClick">',
            description: t.propsDocs.items.options.description,
            control: 'json',
            typeDetails: `{
  label?: string | ReactNode;
  icon?: string;
  title?: string;
  disabled?: boolean;
  loading?: boolean;
  iconClassName?: string;
  style?: React.CSSProperties;
  variant?: "primary" | "secondary" | "danger" | "success" | "warning" | "info" | "light" | "dark" | "outline-primary" | "outline-secondary" | "outline-danger" | "outline-success" | "link";
  badge?: BadgeProps;
  className?: string;
}`,
            example: `options={{
  label: 'Connect Dropbox',
  icon: 'link',
  className: 'btn-primary',
  disabled: true,
}}`,
        },
        { name: 'label', type: 'string | ReactNode', description: t.propsDocs.items.label.description, control: 'text' },
        { name: 'icon', type: 'string', description: t.propsDocs.items.icon.description, control: 'icon' },
        { name: 'title', type: 'string', description: t.propsDocs.items.title.description, control: 'text' },
        { name: 'disabled', type: 'boolean', default: 'false', description: t.propsDocs.items.disabled.description, control: 'boolean' },
        { name: 'className', type: 'string', description: t.propsDocs.items.className.description, control: 'text' },
    ], [t]);

    const authButtonPlaygroundProps = React.useMemo<PropDef[]>(() => [
        { name: 'provider', type: 'string', default: '"dropboxAuth"', description: t.propsDocs.items.provider.description, control: 'select', options: ['googleAuth', 'dropboxAuth'] },
        { name: 'intent', type: '"signIn" | "connect" | "signOut" | "disconnect" | "reauthorize"', default: '"connect"', description: t.propsDocs.items.intent.description, control: 'select', options: ['signIn', 'connect', 'signOut', 'disconnect', 'reauthorize'] },
        { name: 'aspect', type: '"button" | "avatar"', default: '"button"', description: t.propsDocs.items.aspect.description, control: 'select', options: ['button', 'avatar'] },
        { name: 'label', type: 'string', default: `"${t.labels.connectDropbox}"`, description: t.propsDocs.items.label.description, control: 'text' },
        { name: 'icon', type: 'string', default: '"link"', description: t.propsDocs.items.icon.description, control: 'icon' },
        { name: 'iconLogout', type: 'string', default: '"log-out"', description: t.propsDocs.items.iconLogout.description, control: 'icon' },
        { name: 'className', type: 'string', default: t.labels.primaryButtonClasses, description: t.propsDocs.items.className.description, control: 'text' },
        { name: 'avatarClass', type: 'string', description: t.propsDocs.items.avatarClass.description, control: 'text' },
        { name: 'disabled', type: 'boolean', default: 'true', description: t.propsDocs.items.disabled.description, control: 'boolean' },
        {
            name: 'scopes',
            type: 'string[]',
            description: t.propsDocs.items.scopes.description,
            control: 'json',
            rows: 4,
            shortcuts: [
                { label: t.playground.shortcuts.dropbox.label, value: ['files.metadata.read', 'files.content.read'], help: t.playground.shortcuts.dropbox.help },
                { label: t.playground.shortcuts.drive.label, value: ['https://www.googleapis.com/auth/drive.readonly'], help: t.playground.shortcuts.drive.help },
                { label: t.playground.shortcuts.empty.label, value: [], help: t.playground.shortcuts.empty.help },
            ],
        },
    ], [t]);

    const playground = React.useMemo<PlaygroundConfig>(() => ({
        props: authButtonPlaygroundProps,
        size: 'lg',
        defaultProps: {
            provider: 'dropboxAuth',
            intent: 'connect',
            aspect: 'button',
            label: t.labels.connectDropbox,
            icon: 'link',
            iconLogout: 'log-out',
            className: 'btn-primary',
            avatarClass: '',
            disabled: true,
            scopes: ['files.metadata.read', 'files.content.read'],
        },
        render: (p) => (
            <AuthButton
                provider={p.provider || undefined}
                intent={p.intent || 'connect'}
                aspect={p.aspect || 'button'}
                scopes={Array.isArray(p.scopes) ? p.scopes : undefined}
                iconLogout={p.iconLogout || undefined}
                avatarClass={p.avatarClass || undefined}
                options={{
                    label: p.label || undefined,
                    icon: p.icon || undefined,
                    className: p.className || undefined,
                    disabled: p.disabled,
                }}
            />
        ),
    }), [authButtonPlaygroundProps, t]);

    usePlayground(playground, t.playground.title);

    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.avatarLogin.title}
                description={t.sections.avatarLogin.description}
                preview={<AuthButton provider="googleAuth" intent="signIn" aspect="avatar" iconLogout="log-out" />}
                code={`import { AuthButton } from '@llmnative/react';

<AuthButton provider="googleAuth" intent="signIn" aspect="avatar" iconLogout="log-out" />`}
            />

            <Section
                title={t.sections.integrationConnect.title}
                description={t.sections.integrationConnect.description}
                preview={(
                    <AuthButton
                        provider="dropboxAuth"
                        intent="connect"
                        aspect="button"
                        scopes={['files.metadata.read', 'files.content.read']}
                        options={{
                            icon: 'link',
                            label: t.labels.connectDropbox,
                            className: 'btn-primary',
                            disabled: true,
                        }}
                    />
                )}
                code={`import { AuthButton, getAccessToken } from '@llmnative/react';

<AuthButton
  provider="dropboxAuth"
  intent="connect"
  aspect="button"
  scopes={['files.metadata.read', 'files.content.read']}
  options={{ icon: 'link', label: 'Connect Dropbox' }}
/>

const token = await getAccessToken(import.meta.env.VITE_DROPBOX_CLIENT_ID);`}
            />

            <PropDocsTable props={authButtonProps} title={t.labels.authButtonPropsTitle} />
        </PageLayout>
    );
}
