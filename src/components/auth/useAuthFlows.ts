import { useContext, useEffect, useMemo, useState } from 'react';
import AuthProviderContext, { useAuthProvider } from '../../providers/auth/AuthProviderContext';
import type { AuthProviderAdapter, UserProfile } from '../../providers/auth/AuthProvider';
import type { SignInProps } from './SignIn';
import type { SignUpProps } from './SignUp';
import type { ForgotPasswordProps } from './ForgotPassword';
import type { ResetPasswordProps } from './ResetPassword';
import type { VerifyEmailProps } from './VerifyEmail';

// ── Session ───────────────────────────────────────────────────────────────────

/** Adapters whose session of the last visit is known: a page that mounts later does not wait again. */
const readyAdapters = new WeakSet<AuthProviderAdapter>();

export interface AuthSession {
    /** The signed-in user, `null` without a session. */
    user: UserProfile | null;
    /** `false` while the session of the last visit is being restored: show neither the page nor the sign-in. */
    ready: boolean;
    signOut: () => Promise<void>;
    adapter: AuthProviderAdapter;
}

/** Who is signed in with an auth provider of the app, and whether it is known yet (CR-127). */
export function useAuthSession(provider?: string): AuthSession {
    const auth = useAuthProvider(provider);
    const [ready, setReady] = useState(() => readyAdapters.has(auth) || !auth.whenReady);
    const [user, setUser] = useState<UserProfile | null>(() => auth.getUser());

    useEffect(() => {
        let live = true;
        setUser(auth.getUser());
        const unsubscribe = auth.onAuthChange((next) => {
            if (live) setUser(next);
        });
        if (auth.whenReady && !readyAdapters.has(auth)) {
            auth.whenReady()
                .catch(() => undefined)
                .then(() => {
                    readyAdapters.add(auth);
                    if (!live) return;
                    setUser(auth.getUser());
                    setReady(true);
                });
        } else {
            setReady(true);
        }
        return () => {
            live = false;
            unsubscribe();
        };
    }, [auth]);

    return useMemo(() => ({ user, ready, signOut: () => auth.signOut(), adapter: auth }), [auth, ready, user]);
}

// ── Flows ─────────────────────────────────────────────────────────────────────

export interface AuthFlowsOptions {
    /** The page the confirmation link of a new account opens (your `VerifyEmail`), e.g. `/verify-email`. */
    verifyEmailPath?: string;
    /** The page the link to choose a new password opens (your `ResetPassword`), e.g. `/reset-password`. */
    resetPasswordPath?: string;
}

export interface AuthFlows {
    adapter: AuthProviderAdapter;
    /** For `<SignIn {...flows.signIn} />`: password, code by email, providers, as the adapter offers them. */
    signIn: Pick<SignInProps, 'onPasswordSignIn' | 'onRequestCode' | 'onVerifyCode' | 'onProviderSignIn' | 'providers'>;
    /** For `<SignUp {...flows.signUp} />`; `undefined` when the adapter cannot create accounts. */
    signUp?: Pick<SignUpProps, 'onSignUp' | 'onResendVerification'>;
    /** For `<ForgotPassword {...flows.forgotPassword} />`; `undefined` without password reset. */
    forgotPassword?: Pick<ForgotPasswordProps, 'onSendReset'>;
    /** For `<ResetPassword {...flows.resetPassword(code)} />`, with the code of the link. */
    resetPassword: (code: string | null | undefined) => Pick<ResetPasswordProps, 'onResetPassword' | 'invalidLink'>;
    /** For `<VerifyEmail {...flows.verifyEmail} code={…} />`. */
    verifyEmail: Pick<VerifyEmailProps, 'onVerify' | 'onResend'>;
}

/** The name of a provider whose only way in is its own (`githubAuth` → `github`). */
const providerIdOf = (key: string) => key.replace(/Auth$/, '').toLowerCase();

/**
 * Binds the access screens to an auth provider of the app (CR-127): each screen gets the functions of
 * the methods the adapter has. An adapter that can reset a password (Firebase, Supabase, mock) signs in
 * with email and password; one that cannot (Google, GitHub, Dropbox) offers its own button.
 */
export function useAuthFlows(provider?: string, options: AuthFlowsOptions = {}): AuthFlows {
    const auth = useAuthProvider(provider);
    const context = useContext(AuthProviderContext);
    const key = provider ?? context?.defaultKey ?? '';
    const { verifyEmailPath, resetPasswordPath } = options;

    return useMemo<AuthFlows>(() => {
        const withPassword = typeof auth.sendPasswordReset === 'function' || typeof auth.signUp === 'function';
        const withCode = typeof auth.requestEmailCode === 'function' && typeof auth.verifyEmailCode === 'function';
        const signIn = auth.signIn?.bind(auth);

        return {
            adapter: auth,
            signIn: {
                ...(withPassword && signIn
                    ? { onPasswordSignIn: ({ email, password }) => signIn({ method: 'password', email, password }) }
                    : {}),
                ...(withCode
                    ? {
                        onRequestCode: (email: string) => auth.requestEmailCode!(email),
                        onVerifyCode: (email: string, code: string) => auth.verifyEmailCode!(email, code),
                    }
                    : {}),
                ...(signIn
                    ? withPassword || withCode
                        ? { onProviderSignIn: (id: string) => signIn({ method: 'oauth', provider: id }) }
                        : { providers: [providerIdOf(key)], onProviderSignIn: () => signIn() }
                    : {}),
            },
            signUp: auth.signUp
                ? {
                    onSignUp: (input) => auth.signUp!({ ...input, redirectTo: verifyEmailPath }),
                    ...(auth.sendEmailVerification
                        ? { onResendVerification: (email: string) => auth.sendEmailVerification!({ email, redirectTo: verifyEmailPath }) }
                        : {}),
                }
                : undefined,
            forgotPassword: auth.sendPasswordReset
                ? { onSendReset: (email) => auth.sendPasswordReset!(email, { redirectTo: resetPasswordPath }) }
                : undefined,
            resetPassword: (code) => ({
                invalidLink: !auth.confirmPasswordReset,
                onResetPassword: (password) => auth.confirmPasswordReset
                    ? auth.confirmPasswordReset(code ?? '', password)
                    : Promise.reject(new Error('confirmPasswordReset is not supported')),
            }),
            verifyEmail: {
                ...(auth.verifyEmail ? { onVerify: (code: string) => auth.verifyEmail!(code) } : {}),
                ...(auth.sendEmailVerification
                    ? { onResend: () => auth.sendEmailVerification!({ redirectTo: verifyEmailPath }) }
                    : {}),
            },
        };
    }, [auth, key, verifyEmailPath, resetPasswordPath]);
}

/**
 * The code of the link an email opened, whatever the service calls it: `oobCode` (Firebase),
 * `token_hash` (Supabase), `code`.
 */
export function linkCode(search: string | URLSearchParams = typeof window !== 'undefined' ? window.location.search : ''): string | null {
    const params = typeof search === 'string' ? new URLSearchParams(search) : search;
    return params.get('oobCode') ?? params.get('token_hash') ?? params.get('code');
}
