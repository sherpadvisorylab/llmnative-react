import type { ProviderConfigurable } from '../ProviderConfiguration';

export interface UserProfile {
    uid?: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
    [key: string]: unknown;
}

export type AuthIntent = 'signIn' | 'connect' | 'signOut' | 'disconnect' | 'reauthorize';

export interface AuthSignInOptions {
    scopes?: string[];
    intent?: AuthIntent;
    [key: string]: unknown;
}

export interface AuthProviderAdapter extends ProviderConfigurable {
    getUser(): UserProfile | null;
    signIn?(options?: AuthSignInOptions): Promise<UserProfile | null>;
    signOut(): Promise<void>;
    onAuthChange(callback: (user: UserProfile | null) => void): () => void;
    getAccessToken?(scopes?: string[]): Promise<string>;
    isAuthenticated?(): boolean;
    /**
     * Custom claims embedded in the current session's token (e.g. a JWT's payload),
     * for providers backed by one — Firebase custom claims, a Supabase JWT, etc.
     * Optional: providers with no token-claims concept (e.g. plain OAuth) omit it.
     * Read-only/UI convenience — never a security boundary, the server always
     * re-verifies the raw token itself rather than trusting client-read claims.
     */
    getIdTokenClaims?(forceRefresh?: boolean): Promise<Record<string, unknown> | null>;

    // ── Flows of the access screens (CR-127) ──────────────────────────────────
    // All optional: a provider implements what its service offers. `useAuthFlows` binds the
    // screens (`SignIn`, `SignUp`, `ForgotPassword`, …) to the methods that are there.

    /** Resolves once the session of the last visit is restored (signed in or not): `AuthGate` waits for it. */
    whenReady?(): Promise<void>;
    /** Creates an account with email and password; says whether the email must be confirmed first. */
    signUp?(input: AuthSignUpInput): Promise<AuthSignUpResult>;
    /** Sends the link to choose a new password. Never says whether the account exists. */
    sendPasswordReset?(email: string, options?: AuthLinkOptions): Promise<void>;
    /** Sets the new password with the code of the link (`oobCode`, `token_hash`, …). */
    confirmPasswordReset?(code: string, newPassword: string): Promise<void>;
    /** Sends again the link that confirms the email: of the signed-in user, or of `email` when the service allows it. */
    sendEmailVerification?(options?: AuthLinkOptions & { email?: string }): Promise<void>;
    /** Confirms the email with the code of the link. */
    verifyEmail?(code: string): Promise<void>;
    /** Sends a one-time code by email to sign in. */
    requestEmailCode?(email: string, options?: AuthEmailCodeOptions): Promise<void>;
    /** Signs in with the code received by email. */
    verifyEmailCode?(email: string, code: string): Promise<UserProfile | null>;
}

export interface AuthSignUpInput {
    email: string;
    password: string;
    /** The full name, when the screen asks for it. */
    name?: string;
    /** Where the confirmation link brings back (the page that calls `verifyEmail`). */
    redirectTo?: string;
}

export interface AuthSignUpResult {
    user: UserProfile | null;
    /** The account works once the email is confirmed: the screen says to check the inbox. */
    needsEmailVerification: boolean;
}

export interface AuthLinkOptions {
    /** The page the link of the email opens. */
    redirectTo?: string;
}

export interface AuthEmailCodeOptions {
    /** Creates the account when the email has none (default `false`: only existing accounts sign in). */
    createUser?: boolean;
}

/** Why an access flow failed, in words a screen can translate (`authErrorMessage`). */
export type AuthErrorReason =
    | 'credentials'
    | 'emailInUse'
    | 'weakPassword'
    | 'invalidEmail'
    | 'tooManyRequests'
    | 'network'
    | 'invalidCode'
    | 'expiredLink'
    | 'disabled'
    | 'cancelled'
    | 'notSupported'
    | 'generic';

/**
 * An error of an access flow with its reason: a screen shows the translated message of the reason,
 * never the raw text of the service. Throw it from your own functions (e.g. a code checked by your server).
 */
export class AuthFlowError extends Error {
    readonly reason: AuthErrorReason;

    constructor(reason: AuthErrorReason, message?: string, options?: { cause?: unknown }) {
        super(message ?? reason, options);
        this.name = 'AuthFlowError';
        this.reason = reason;
    }
}
