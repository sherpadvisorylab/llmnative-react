import React from 'react';
import { AuthButton } from 'react-firestrap';
import PageLayout from '../../components/PageLayout';
import Section from '../../components/Section';
import PropDocsTable from '../../components/PropDocsTable';
import { usePlayground } from '../../context/PlaygroundContext';
import type { PlaygroundConfig, PropDef } from '../../types/playground';

const primaryButton = 'btn-primary';

const AUTH_BUTTON_PROPS: PropDef[] = [
    { name: 'provider', type: 'string', description: 'AuthProvider driver key. Defaults to the app auth service.', control: 'text' },
    { name: 'intent', type: '"signIn" | "connect" | "signOut" | "disconnect" | "reauthorize"', default: '"signIn"', description: 'Action requested from the selected AuthProvider.', control: 'select', options: ['signIn', 'connect', 'signOut', 'disconnect', 'reauthorize'] },
    { name: 'aspect', type: '"button" | "avatar"', default: '"button"', description: 'Visual presentation of the auth action.', control: 'select', options: ['button', 'avatar'] },
    { name: 'scopes', type: 'string[]', description: 'Scopes requested from the selected provider.', control: 'json', typeDetails: `string[]`, example: `scopes={['files.metadata.read', 'files.content.read']}` },
    { name: 'iconLogout', type: 'string', default: '"log-out"', description: 'IconProvider key used for the avatar logout menu item.', control: 'icon' },
    { name: 'avatarClass', type: 'string', description: 'CSS classes applied to the profile avatar.', control: 'text' },
    { name: 'options', type: 'IButton', description: 'ActionButton options such as label, icon, className and disabled.', control: 'json', typeDetails: `{
  label?: string;
  icon?: string;
  className?: string;
  disabled?: boolean;
}`, example: `options={{
  label: 'Connect Dropbox',
  icon: 'link',
  className: 'btn-primary',
  disabled: true,
}}` },
];

const AUTH_BUTTON_PLAYGROUND_PROPS: PropDef[] = [
    { name: 'provider', type: 'string', default: '"dropboxAuth"', description: 'AuthProvider driver key.', control: 'select', options: ['googleAuth', 'dropboxAuth'] },
    { name: 'intent', type: '"signIn" | "connect" | "signOut" | "disconnect" | "reauthorize"', default: '"connect"', description: 'Action requested from the selected AuthProvider.', control: 'select', options: ['signIn', 'connect', 'signOut', 'disconnect', 'reauthorize'] },
    { name: 'aspect', type: '"button" | "avatar"', default: '"button"', description: 'Visual presentation.', control: 'select', options: ['button', 'avatar'] },
    { name: 'label', type: 'string', default: '"Connect Dropbox"', description: 'Button label for button aspect.', control: 'text' },
    { name: 'icon', type: 'string', default: '"link"', description: 'IconProvider key for button aspect.', control: 'icon' },
    { name: 'iconLogout', type: 'string', default: '"log-out"', description: 'IconProvider key for avatar logout.', control: 'icon' },
    { name: 'className', type: 'string', default: 'primary button classes', description: 'Button CSS classes.', control: 'text' },
    { name: 'avatarClass', type: 'string', description: 'Avatar CSS classes.', control: 'text' },
    { name: 'disabled', type: 'boolean', default: 'true', description: 'Keep enabled only when you want to start a real OAuth flow.', control: 'boolean' },
    { name: 'scopes', type: 'string[]', description: 'Requested OAuth scopes.', control: 'json' },
];

const PLAYGROUND: PlaygroundConfig = {
    props: AUTH_BUTTON_PLAYGROUND_PROPS,
    size: 'md',
    defaultProps: {
        provider: 'dropboxAuth',
        intent: 'connect',
        aspect: 'button',
        label: 'Connect Dropbox',
        icon: 'link',
        iconLogout: 'log-out',
        className: primaryButton,
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
};

export default function AuthPage() {
    usePlayground(PLAYGROUND, 'AuthButton');

    return (
        <PageLayout
            title="Auth"
            description="Provider-driven auth UI for app sign-in and external OAuth integrations."
        >
            <Section
                title="Avatar login"
                description="Use the default auth service as application identity and render it as a profile/avatar control."
                preview={
                    <AuthButton provider="googleAuth" intent="signIn" aspect="avatar" iconLogout="log-out" />
                }
                code={`import { AuthButton } from 'react-firestrap';

<AuthButton provider="googleAuth" intent="signIn" aspect="avatar" iconLogout="log-out" />`}
            />

            <Section
                title="Integration connect"
                description="Use a named auth service for external integrations. The showcase preview is disabled to avoid opening a real provider window."
                preview={
                    <AuthButton
                        provider="dropboxAuth"
                        intent="connect"
                        aspect="button"
                        scopes={['files.metadata.read', 'files.content.read']}
                        options={{
                            icon: 'link',
                            label: 'Connect Dropbox',
                            className: primaryButton,
                            disabled: true,
                        }}
                    />
                }
                code={`import { AuthButton, getAccessToken } from 'react-firestrap';

<AuthButton
  provider="dropboxAuth"
  intent="connect"
  aspect="button"
  scopes={['files.metadata.read', 'files.content.read']}
  options={{ icon: 'link', label: 'Connect Dropbox' }}
/>

const token = await getAccessToken(import.meta.env.VITE_DROPBOX_CLIENT_ID);`}
            />

            <PropDocsTable props={AUTH_BUTTON_PROPS} title="AuthButton props" />
        </PageLayout>
    );
}
