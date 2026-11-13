import React, { useEffect, useState } from 'react';
import { interpolate, useI18n } from '../../I18n';
import type { UserProfile } from '../../providers/auth/AuthProvider';
import { AuthLayout } from './AuthLayout';
import { SignIn } from './SignIn';
import { Spinner, useAccessText, useAuthAction, FormError } from './shared';
import { useAuthFlows, useAuthSession } from './useAuthFlows';

export interface AuthGateProps {
    /** The page, shown only to a signed-in (and allowed) user. */
    children?: React.ReactNode;
    /**
     * What shows instead of the page without a session: your `<SignIn …/>`. Default: a `SignIn` bound to
     * the auth provider (`useAuthFlows`). The address does not change: once signed in, the page appears.
     */
    fallback?: React.ReactNode;
    /** The auth provider of the app to ask. Default: the default one. */
    provider?: string;
    /** While the session of the last visit is restored. Default: a spinner in the middle of the page. */
    loading?: React.ReactNode;
    /** Whether a signed-in user may see the pages (a role, an invitation). Default: everyone signed in. */
    allow?: (user: UserProfile) => boolean | Promise<boolean>;
    /** For a signed-in user who is not allowed. Default: "No access" with "Sign in with another account". */
    denied?: React.ReactNode;
}

const Loading = () => {
    const common = useI18n('common');
    return (
        <div className="flex min-h-dvh items-center justify-center bg-background text-muted-foreground" role="status" aria-label={common.loading}>
            <Spinner className="h-6 w-6" />
        </div>
    );
};

const DefaultSignIn = ({ provider }: { provider?: string }) => {
    const flows = useAuthFlows(provider);
    return <SignIn {...flows.signIn} />;
};

const Denied = ({ user, signOut }: { user: UserProfile; signOut: () => Promise<void> }) => {
    const t = useAccessText();
    const action = useAuthAction();
    return (
        <AuthLayout
            icon="shield-warning"
            tone="warning"
            title={t.deniedTitle}
            description={interpolate(t.denied, { user: user.email ?? user.displayName ?? user.uid ?? '' })}
        >
            <div className="space-y-4">
                <FormError message={action.error} />
                <button
                    type="button"
                    onClick={() => void action.run(signOut)}
                    disabled={action.pending}
                    className="btn btn-primary h-11 w-full text-base sm:h-10 sm:text-sm"
                >
                    {action.pending && <Spinner />}
                    {t.signInOther}
                </button>
            </div>
        </AuthLayout>
    );
};

/**
 * Shows its page only to a signed-in user (CR-127); without a session it shows the sign-in in its place,
 * without a redirect, so the address stays the one that was opened and the page appears once signed in.
 * `<App authGate={…}>` puts every route behind one, except those marked `public`.
 */
export function AuthGate({ children, fallback, provider, loading, allow, denied }: AuthGateProps) {
    const session = useAuthSession(provider);
    const { user, ready } = session;
    const [allowed, setAllowed] = useState<boolean | null>(null);
    const uid = user ? (user.uid ?? user.email ?? 'signed-in') : null;

    useEffect(() => {
        if (!user || !allow) {
            setAllowed(null);
            return undefined;
        }
        let live = true;
        setAllowed(null);
        Promise.resolve()
            .then(() => allow(user))
            .catch(() => false)
            .then((value) => { if (live) setAllowed(!!value); });
        return () => { live = false; };
        // The answer is per user: a new object of the same user does not ask again.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uid, allow]);

    if (!ready) return <>{loading ?? <Loading />}</>;
    if (!user) return <>{fallback ?? <DefaultSignIn provider={provider} />}</>;
    if (allow) {
        if (allowed === null) return <>{loading ?? <Loading />}</>;
        if (!allowed) return <>{denied ?? <Denied user={user} signOut={session.signOut} />}</>;
    }
    return <>{children}</>;
}

export default AuthGate;
