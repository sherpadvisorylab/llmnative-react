import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchRest } from './libs/fetch';
import { ActionButton, type IButton } from './components/ui/Buttons';
import { getGlobalVars, setGlobalVars, useGlobalVars } from './Global';
import { useAuthProvider } from './providers/auth/AuthProviderContext';
import type { AuthIntent, UserProfile } from './providers/auth/AuthProvider';
import ImageAvatar from './components/ui/ImageAvatar';
import { PLACEHOLDER_USER, useTheme } from './Theme';
import { getProviderConfigurationState } from './providers/ProviderConfiguration';
import Icon from './components/ui/Icon';

interface IAuthResponse {
    iat: number;
    access_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
    refresh_token: string;
    account_id: string;
    uid: string;
}

interface AuthChallenge {
    authServer: string;
    clientID: string;
    codeVerifier: string;
}

export const AUTH_REDIRECT_URI = '/__/authorize';
const _AUTHS = 'auths';

function generateCodeVerifier(): string {
    const array = new Uint32Array(56 / 2);
    window.crypto.getRandomValues(array);
    return Array.from(array, (dec) => (`0${dec.toString(16)}`).substr(-2)).join('');
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

const openAuthWindow = (authUrl: string, windowName: string, width: number) => {
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - width / 2;
    const options = `width=${width},height=${width},top=${top},left=${left}`;
    return window.open(authUrl, windowName, options);
};

export function redirectToAuthPage({
    authServer,
    clientID,
    scopes = undefined,
    refreshParamName = 'access_type',
}: {
    authServer: string;
    clientID: string;
    scopes?: string[];
    refreshParamName?: string;
}) {
    const codeVerifier = generateCodeVerifier();
    localStorage.setItem('authChallenge', JSON.stringify({
        authServer,
        clientID,
        codeVerifier,
    }));

    generateCodeChallenge(codeVerifier).then((codeChallenge) => {
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: clientID,
            redirect_uri: `${window.location.origin}${AUTH_REDIRECT_URI}`,
            scope: scopes ? scopes.join(' ') : '',
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
            [refreshParamName]: 'offline',
        });
        openAuthWindow(`https://${authServer}/authorize?${params.toString()}`, 'auth', 600);
    });
}

const setAuths = (authServer: string, clientID: string, authResponse: IAuthResponse): void => {
    setGlobalVars({
        [clientID]: {
            ...authResponse,
            server: authServer,
            client_id: clientID,
            iat: Math.floor(Date.now() / 1000),
        },
    }, _AUTHS);
};

const Authorize = () => {
    const location = useLocation().search;

    useEffect(() => {
        const query = new URLSearchParams(location);

        const code = query.get('code');
        const getJsonFromStorage = <T = any>(key: string, fallback?: T): T | undefined => {
            try {
                return JSON.parse(localStorage.getItem(key) || '') || fallback;
            } catch {
                return fallback;
            }
        };

        const authChallenge = getJsonFromStorage<AuthChallenge>('authChallenge');
        if (!code || !authChallenge) return;

        const { authServer, clientID, codeVerifier } = authChallenge;
        fetchRest(`https://${authServer}/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: {
                grant_type: 'authorization_code',
                client_id: clientID,
                code,
                redirect_uri: `${window.location.origin}${AUTH_REDIRECT_URI}`,
                code_verifier: codeVerifier,
            },
        })
            .then((authResponse: IAuthResponse) => {
                setAuths(authServer, clientID, authResponse);
                localStorage.removeItem('authChallenge');
                window.close();
            })
            .catch((error) => console.error('Error:', error));
    }, [location]);

    return <div>Loading...</div>;
};

const refreshAccessToken = (authServer: string, clientID: string, refresh_token: string): Promise<string | null> => {
    return fetchRest(`https://${authServer}/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: {
            grant_type: 'refresh_token',
            client_id: clientID,
            refresh_token,
        },
    })
        .then((authResponse: IAuthResponse) => {
            setAuths(authServer, clientID, authResponse);
            return authResponse.access_token;
        })
        .catch((error) => {
            console.error('Error:', error);
            localStorage.removeItem(_AUTHS);
            return null;
        });
};

export const useAccessToken = (clientID: string, renew = true): boolean => {
    const [auths] = useGlobalVars(_AUTHS);
    const auth = auths?.[clientID] || {};

    const isExpired = Math.floor(Date.now() / 1000) >= (auth?.iat + auth?.expires_in);
    return !!(auth && auth?.access_token && (!isExpired || (renew && isExpired && auth.refresh_token && (refreshAccessToken(auth.server, auth.client_id, auth.refresh_token) || true))));
};

export const getAuthSession = (clientID: string) => {
    const auths = getGlobalVars(_AUTHS);
    return auths?.[clientID];
};

export const clearAccessToken = (clientID: string): void => {
    const auths = getGlobalVars(_AUTHS) || {};
    if (auths[clientID]) {
        delete auths[clientID];
        setGlobalVars(auths, _AUTHS);
    }
};

export const getAccessToken = (clientID: string): Promise<string | null> => {
    const auth = getAuthSession(clientID);
    const isExpired = Math.floor(Date.now() / 1000) > auth?.iat + auth?.expires_in;

    if (!isExpired && auth?.access_token) {
        return Promise.resolve(auth.access_token);
    }
    if (isExpired && auth?.refresh_token) {
        return refreshAccessToken(auth.server, auth.client_id, auth.refresh_token);
    }

    return Promise.resolve(null);
};

export type AuthButtonAspect = 'button' | 'avatar';

export interface AuthButtonProps extends Omit<IButton, 'onClick'> {
    provider?: string;
    intent?: AuthIntent;
    aspect?: AuthButtonAspect;
    scopes?: string[];
    iconLogout?: string;
    avatarClass?: string;
    options?: Omit<IButton, 'onClick'>;
}

const isLogoutIntent = (intent?: AuthIntent): boolean =>
    intent === 'signOut' || intent === 'disconnect';

export const AuthButton = ({
    provider,
    intent = 'signIn',
    aspect = 'button',
    scopes = undefined,
    iconLogout = 'log-out',
    avatarClass = undefined,
    options = {},
    label = undefined,
    icon = undefined,
    title = undefined,
    className = undefined,
    disabled = false,
    ...rest
}: AuthButtonProps) => {
    const auth = useAuthProvider(provider);
    const theme = useTheme('auth');
    const providerLabel = provider || 'AuthProvider';
    const getConfigurationState = React.useCallback(
        () => getProviderConfigurationState(auth, providerLabel),
        [auth, providerLabel]
    );
    const configurationState = React.useMemo(
        () => getConfigurationState(),
        [getConfigurationState]
    );
    const isConfigured = configurationState.configured;
    const [user, setUser] = React.useState<UserProfile | null>(() => isConfigured ? auth.getUser() : null);
    const [authenticated, setAuthenticated] = React.useState<boolean>(() => isConfigured && (auth.isAuthenticated?.() ?? !!auth.getUser()));
    const [avatarOpen, setAvatarOpen] = React.useState(false);
    const notConfiguredTitle = configurationState.reason
        || `Auth provider "${providerLabel}" is not configured. Add the required client key before using this action.`;

    React.useEffect(() => {
        const configured = getConfigurationState().configured;
        if (!configured) {
            setUser(null);
            setAuthenticated(false);
            setAvatarOpen(false);
            return () => {};
        }

        setUser(auth.getUser());
        setAuthenticated(auth.isAuthenticated?.() ?? !!auth.getUser());
        return auth.onAuthChange((nextUser) => {
            setUser(nextUser);
            setAuthenticated(auth.isAuthenticated?.() ?? !!nextUser);
        });
    }, [auth, getConfigurationState]);

    const refreshState = () => {
        if (!getConfigurationState().configured) {
            setUser(null);
            setAuthenticated(false);
            return;
        }

        const nextUser = auth.getUser();
        setUser(nextUser);
        setAuthenticated(auth.isAuthenticated?.() ?? !!nextUser);
    };

    const runIntent = async () => {
        if (!getConfigurationState().configured) return;

        if (isLogoutIntent(intent)) {
            await auth.signOut();
            refreshState();
            return;
        }

        if (!auth.signIn) {
            throw new Error('AuthProvider does not implement signIn().');
        }

        await auth.signIn({ scopes, intent });
        refreshState();
    };

    const mergedOptions = {
        ...rest,
        ...options,
        label: options.label ?? label ?? (authenticated ? 'Connected' : intent === 'signIn' ? 'Sign in' : 'Connect'),
        icon: options.icon ?? icon ?? (authenticated ? 'link' : 'link-break'),
        title: !isConfigured ? notConfiguredTitle : options.title ?? title,
        className: options.className ?? className,
        disabled: !isConfigured || (options.disabled ?? disabled),
        style: !isConfigured
            ? { ...(rest.style || {}), ...(options.style || {}), opacity: 0.55, cursor: 'not-allowed' }
            : options.style ?? rest.style,
    };

    if (aspect === 'avatar') {
        const displayName = user?.displayName ?? user?.email ?? (authenticated ? 'Authenticated' : 'Sign in');

        return (
            <div
                className={className || theme.SignIn.className}
                style={{ position: 'relative', display: 'inline-flex' }}
                title={!isConfigured ? notConfiguredTitle : undefined}
            >
                <button
                    type="button"
                    className="border-0 bg-transparent p-0"
                    title={!isConfigured ? notConfiguredTitle : displayName}
                    aria-label={displayName}
                    disabled={!isConfigured || disabled}
                    aria-disabled={!isConfigured || disabled}
                    style={!isConfigured ? { opacity: 0.55, cursor: 'not-allowed' } : undefined}
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        if (!isConfigured || disabled) return;
                        setAvatarOpen((value) => !value);
                    }}
                >
                        <ImageAvatar
                            src={user?.photoURL ?? PLACEHOLDER_USER}
                            title={!isConfigured ? notConfiguredTitle : displayName}
                            height={36}
                            className={avatarClass || theme.SignIn.avatarClass}
                        />
                </button>
                {avatarOpen && (
                    <div
                        role="menu"
                        className="absolute right-0 top-full z-50 mt-2 min-w-40 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
                    >
                        {!authenticated && (
                            <button
                                type="button"
                                role="menuitem"
                                className="flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                onClick={runIntent}
                            >
                                {label ?? 'SIGN IN'}
                            </button>
                        )}
                        {authenticated && (
                            <button
                                type="button"
                                role="menuitem"
                                className="flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                onClick={async () => {
                                    await auth.signOut();
                                    refreshState();
                                    setAvatarOpen(false);
                                }}
                            >
                                {iconLogout && <Icon name={iconLogout} className="mr-2" />}
                                LOGOUT
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <ActionButton
            {...mergedOptions}
            onClick={runIntent}
        />
    );
};

export default Authorize;
