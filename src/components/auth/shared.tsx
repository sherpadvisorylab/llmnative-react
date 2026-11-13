import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../libs/cn';
import { useI18n, interpolate, type I18nDict } from '../../I18n';
import Icon from '../ui/Icon';
import { fieldControlBaseClass, fieldLabelClass } from '../ui/fields/Input';
import { buttonBaseClass, buttonPrimaryClass } from '../ui/Buttons';
import { AuthFlowError, type AuthErrorReason } from '../../providers/auth/AuthProvider';

export type AccessDict = I18nDict['access'];

/** The texts of the access screens, in the language of the app. */
export const useAccessText = (): AccessDict => useI18n('access');

/**
 * A link to another screen: a path of the app (a `Link`, no reload) or a function (a button that
 * looks like a link, e.g. to switch the screen in place).
 */
export type AuthLink = string | (() => void);

/** What every access screen shares: its frame. */
export interface AuthScreenProps {
    /** The mark above the title: a `<Brand>`, a logo. */
    brand?: React.ReactNode;
    /** Top right of the page: a `ThemeSwitcher`, a `LocaleSwitcher`. */
    toolbar?: React.ReactNode;
    /** Bottom of the page: legal links, the copyright. */
    footer?: React.ReactNode;
    /** Only the content, without `AuthLayout` (inside a modal or a page of your own). */
    bare?: boolean;
    className?: string;
    /** The message shown for an error of a function; `undefined` falls back to the translated reason. */
    errorMessage?: (error: unknown) => string | undefined;
}

// ── Errors ────────────────────────────────────────────────────────────────────

const FIREBASE_REASONS: Record<string, AuthErrorReason> = {
    'auth/invalid-credential': 'credentials',
    'auth/invalid-login-credentials': 'credentials',
    'auth/wrong-password': 'credentials',
    'auth/user-not-found': 'credentials',
    'auth/email-already-in-use': 'emailInUse',
    'auth/weak-password': 'weakPassword',
    'auth/password-does-not-meet-requirements': 'weakPassword',
    'auth/invalid-email': 'invalidEmail',
    'auth/missing-email': 'invalidEmail',
    'auth/too-many-requests': 'tooManyRequests',
    'auth/network-request-failed': 'network',
    'auth/user-disabled': 'disabled',
    'auth/expired-action-code': 'expiredLink',
    'auth/invalid-action-code': 'expiredLink',
    'auth/popup-closed-by-user': 'cancelled',
    'auth/cancelled-popup-request': 'cancelled',
    'auth/user-cancelled': 'cancelled',
    'auth/invalid-verification-code': 'invalidCode',
    'auth/code-expired': 'invalidCode',
    'auth/operation-not-allowed': 'notSupported',
};

const SUPABASE_REASONS: Record<string, AuthErrorReason> = {
    invalid_credentials: 'credentials',
    email_exists: 'emailInUse',
    user_already_exists: 'emailInUse',
    weak_password: 'weakPassword',
    same_password: 'weakPassword',
    email_address_invalid: 'invalidEmail',
    over_request_rate_limit: 'tooManyRequests',
    over_email_send_rate_limit: 'tooManyRequests',
    otp_expired: 'invalidCode',
    user_banned: 'disabled',
    email_provider_disabled: 'notSupported',
    otp_disabled: 'notSupported',
    signup_disabled: 'notSupported',
};

/**
 * Why an access flow failed: the reason of an `AuthFlowError`, of a known code of Firebase or Supabase,
 * a refused connection, too many requests; `generic` otherwise. Never the raw text of the service.
 */
export function authErrorReason(error: unknown): AuthErrorReason {
    if (error instanceof AuthFlowError) return error.reason;
    const value = error as { reason?: unknown; code?: unknown; status?: unknown; name?: unknown; message?: unknown } | null;
    if (!value || typeof value !== 'object') return 'generic';
    if (typeof value.reason === 'string' && value.reason in REASON_KEYS) return value.reason as AuthErrorReason;
    const code = typeof value.code === 'string' ? value.code : '';
    if (FIREBASE_REASONS[code]) return FIREBASE_REASONS[code];
    if (SUPABASE_REASONS[code]) return SUPABASE_REASONS[code];
    if (value.status === 429) return 'tooManyRequests';
    if (value.name === 'TypeError' && /fetch|network/i.test(String(value.message ?? ''))) return 'network';
    return 'generic';
}

const REASON_KEYS: Record<AuthErrorReason, keyof AccessDict> = {
    credentials: 'errorCredentials',
    emailInUse: 'errorEmailInUse',
    weakPassword: 'errorWeakPassword',
    invalidEmail: 'errorInvalidEmail',
    tooManyRequests: 'errorTooManyRequests',
    network: 'errorNetwork',
    invalidCode: 'errorInvalidCode',
    expiredLink: 'errorExpiredLink',
    disabled: 'errorDisabled',
    cancelled: 'errorCancelled',
    notSupported: 'errorNotSupported',
    generic: 'errorGeneric',
};

/** The message of an error of an access flow, translated (see `authErrorReason`). */
export function authErrorMessage(error: unknown, dict: AccessDict): string {
    return dict[REASON_KEYS[authErrorReason(error)]];
}

/** Runs a function of a screen: its pending state and its error, as a message for the person. */
export function useAuthAction(errorMessage?: AuthScreenProps['errorMessage']) {
    const t = useAccessText();
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [reason, setReason] = useState<AuthErrorReason | null>(null);
    const alive = useRef(true);
    useEffect(() => {
        alive.current = true;
        return () => { alive.current = false; };
    }, []);

    const run = useCallback(async <T,>(action: () => Promise<T>): Promise<{ ok: true; value: T } | { ok: false }> => {
        setPending(true);
        setError(null);
        setReason(null);
        try {
            const value = await action();
            return { ok: true, value };
        } catch (caught) {
            if (alive.current) {
                setReason(authErrorReason(caught));
                setError(errorMessage?.(caught) ?? authErrorMessage(caught, t));
            }
            return { ok: false };
        } finally {
            if (alive.current) setPending(false);
        }
    }, [errorMessage, t]);

    const clear = useCallback(() => { setError(null); setReason(null); }, []);
    return { pending, error, reason, run, clear };
}

// ── Validation ────────────────────────────────────────────────────────────────

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emailProblem(value: string, t: AccessDict): string | undefined {
    if (!value.trim()) return t.emailRequired;
    if (!EMAIL_PATTERN.test(value.trim())) return t.emailInvalid;
    return undefined;
}

/** What a new password needs. Length first (NIST 800-63B); the others only when you ask for them. */
export interface PasswordRules {
    /** Default `8`. */
    minLength?: number;
    number?: boolean;
    mixedCase?: boolean;
    symbol?: boolean;
}

export function passwordChecks(value: string, rules: PasswordRules, t: AccessDict) {
    const min = rules.minLength ?? 8;
    return [
        { id: 'length', label: interpolate(t.ruleLength, { min }), met: value.length >= min },
        ...(rules.number ? [{ id: 'number', label: t.ruleNumber, met: /\d/.test(value) }] : []),
        ...(rules.mixedCase ? [{ id: 'case', label: t.ruleCase, met: /[a-z]/.test(value) && /[A-Z]/.test(value) }] : []),
        ...(rules.symbol ? [{ id: 'symbol', label: t.ruleSymbol, met: /[^A-Za-z0-9\s]/.test(value) }] : []),
    ];
}

/** Moves the focus to the first field with an error, after the render that shows it. */
export function focusFirstInvalid(form: HTMLFormElement | null) {
    requestAnimationFrame(() => {
        form?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    });
}

// ── Cooldown of a new send ────────────────────────────────────────────────────

/** Seconds left before a new send; `start()` begins the wait. */
export function useCooldown(seconds: number): [number, () => void] {
    const [left, setLeft] = useState(0);
    useEffect(() => {
        if (left <= 0) return undefined;
        const timer = setTimeout(() => setLeft((value) => value - 1), 1000);
        return () => clearTimeout(timer);
    }, [left]);
    return [left, useCallback(() => setLeft(seconds), [seconds])];
}

// ── Parts ─────────────────────────────────────────────────────────────────────

export const authControlClass = cn(fieldControlBaseClass, 'h-11 text-base sm:h-10 sm:text-sm');

interface AuthFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    hint?: React.ReactNode;
    /** Right of the label (e.g. "Forgot password?"). */
    labelAside?: React.ReactNode;
    /** Inside the field, at its right (e.g. the button that shows the password). */
    inset?: React.ReactNode;
}

/** A field of an access screen: its label, its error announced and tied to it, its hint. */
export const AuthField = React.forwardRef<HTMLInputElement, AuthFieldProps>(function AuthField(
    { label, value, onChange, error, hint, labelAside, inset, id, className, ...input },
    ref,
) {
    const generated = useId();
    const fieldId = id ?? generated;
    const errorId = `${fieldId}-error`;
    const hintId = `${fieldId}-hint`;
    const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined;

    return (
        <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={fieldId} className={cn(fieldLabelClass, 'mb-0')}>{label}</label>
                {labelAside}
            </div>
            <div className={cn(inset && 'relative')}>
                <input
                    ref={ref}
                    id={fieldId}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={describedBy}
                    className={cn(
                        authControlClass,
                        error && 'border-destructive focus-visible:ring-destructive',
                        inset && 'pr-11',
                        className,
                    )}
                    {...input}
                />
                {inset && <span className="absolute inset-y-0 right-0 flex items-center pr-1">{inset}</span>}
            </div>
            {error && (
                <p id={errorId} className="flex items-center gap-1.5 text-sm text-foreground">
                    <Icon name="warning-circle" size={14} className="shrink-0 text-destructive" />
                    <span>{error}</span>
                </p>
            )}
            {hint && <div id={hintId}>{hint}</div>}
        </div>
    );
});

interface PasswordFieldProps extends Omit<AuthFieldProps, 'type' | 'inset' | 'hint'> {
    /** The requirements shown while typing (a new password). */
    rules?: PasswordRules;
}

/** A password with the button that shows it, and the requirements of a new one. */
export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
    { rules, value, ...props },
    ref,
) {
    const t = useAccessText();
    const [visible, setVisible] = useState(false);
    const checks = rules ? passwordChecks(value, rules, t) : null;

    return (
        <AuthField
            ref={ref}
            {...props}
            value={value}
            type={visible ? 'text' : 'password'}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            inset={(
                <button
                    type="button"
                    onClick={() => setVisible((shown) => !shown)}
                    aria-label={visible ? t.hidePassword : t.showPassword}
                    aria-pressed={visible}
                    title={visible ? t.hidePassword : t.showPassword}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <Icon name={visible ? 'eye-off' : 'eye'} size={16} />
                </button>
            )}
            hint={checks && (
                <div className="pt-0.5">
                    <p className="sr-only">{t.passwordRules}</p>
                    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                        {checks.map((check) => (
                            <li
                                key={check.id}
                                className={cn(
                                    'flex items-center gap-1.5 transition-colors',
                                    check.met ? 'text-foreground' : 'text-muted-foreground',
                                )}
                            >
                                {check.met
                                    ? <Icon name="check" size={12} className="shrink-0 text-success" />
                                    : <span aria-hidden="true" className="mx-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />}
                                <span>{check.label}</span>
                                <span className="sr-only">{check.met ? t.ruleMet : t.ruleNotMet}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        />
    );
});

/** The button that sends the form: full width, its spinner while it waits. */
export const SubmitButton = ({ pending, children, disabled }: { pending: boolean; children: React.ReactNode; disabled?: boolean }) => (
    <button
        type="submit"
        disabled={disabled || pending}
        aria-busy={pending || undefined}
        className={cn(buttonBaseClass, buttonPrimaryClass, 'h-11 w-full text-base sm:h-10 sm:text-sm')}
    >
        {pending && <Spinner />}
        {children}
    </button>
);

export const Spinner = ({ className }: { className?: string }) => (
    <span aria-hidden="true" className={cn('inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent', className)} />
);

/** The error of the last attempt, announced to a screen reader. */
export const FormError = ({ message }: { message: string | null }) => (
    <div role="alert" aria-live="assertive">
        {message && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-foreground">
                <Icon name="warning-circle" size={16} className="mt-0.5 shrink-0 text-destructive" />
                <span>{message}</span>
            </div>
        )}
    </div>
);

/** A quiet message that something happened (a code sent again). */
export const FormNotice = ({ message }: { message: string | null }) => (
    <div role="status" aria-live="polite">
        {message && (
            <div className="flex items-start gap-2 rounded-md border border-border bg-muted px-3 py-2.5 text-sm text-foreground">
                <Icon name="check-circle" size={16} className="mt-0.5 shrink-0 text-success" />
                <span>{message}</span>
            </div>
        )}
    </div>
);

const linkClass = 'rounded-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline';

/** A link of a screen: a path of the app, or a function. */
export const TextLink = ({ to, children, className }: { to: AuthLink; children: React.ReactNode; className?: string }) =>
    typeof to === 'string'
        ? (/^[a-z][a-z0-9+.-]*:/i.test(to)
            ? <a href={to} className={cn(linkClass, className)}>{children}</a>
            : <Link to={to} className={cn(linkClass, className)}>{children}</Link>)
        : <button type="button" onClick={to} className={cn(linkClass, className)}>{children}</button>;

/** A button that looks like a link (a new send, another way in). */
export const LinkButton = ({ onClick, disabled, children, className }: {
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    className?: string;
}) => (
    <button type="button" onClick={onClick} disabled={disabled} className={cn(linkClass, 'text-sm', className)}>
        {children}
    </button>
);

/** "or", between the providers and the form. */
export const Divider = ({ label }: { label: string }) => (
    <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground" role="separator">
        <span className="h-px flex-1 bg-border" />
        <span>{label}</span>
        <span className="h-px flex-1 bg-border" />
    </div>
);

/** "Don't have an account? Create one" under the card. */
export const AltLine = ({ text, link, label }: { text: string; link?: AuthLink; label: string }) =>
    link ? (
        <p className="text-center text-sm text-muted-foreground">
            {text} <TextLink to={link}>{label}</TextLink>
        </p>
    ) : null;
