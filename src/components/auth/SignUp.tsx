import React, { useRef, useState } from 'react';
import { interpolate } from '../../I18n';
import type { AuthSignUpResult } from '../../providers/auth/AuthProvider';
import { AuthFrame } from './AuthLayout';
import { ProviderButtons, type AuthProviderOption } from './providers';
import { EmailIn } from './VerifyCode';
import {
    AltLine,
    AuthField,
    Divider,
    FormError,
    FormNotice,
    LinkButton,
    PasswordField,
    SubmitButton,
    emailProblem,
    focusFirstInvalid,
    passwordChecks,
    useAccessText,
    useAuthAction,
    useCooldown,
    type AuthLink,
    type AuthScreenProps,
    type PasswordRules,
} from './shared';

export interface SignUpInput {
    name?: string;
    email: string;
    password: string;
}

export interface SignUpProps extends AuthScreenProps {
    /**
     * Creates the account. Return `{ needsEmailVerification: true }` (what `signUp` of the adapter
     * returns) to show "Check your email"; anything else calls `onSignedUp`.
     */
    onSignUp: (input: SignUpInput) => Promise<Partial<AuthSignUpResult> | void | unknown>;
    /** Sends again the link that confirms the email. */
    onResendVerification?: (email: string) => Promise<unknown>;
    /** Asks the full name. Default `true`. */
    askName?: boolean;
    /**
     * A box to tick before creating the account: `true` for the default sentence, or your own (with the
     * links to your terms and privacy policy).
     */
    terms?: boolean | React.ReactNode;
    /** What the password needs. Default: at least 8 characters. */
    passwordRules?: PasswordRules;
    providers?: AuthProviderOption[];
    onProviderSignIn?: (id: string) => Promise<unknown>;
    /** "Already have an account? Sign in" under the card. */
    signInLink?: AuthLink;
    /** Seconds before a new link can be asked. Default `30`. */
    resendSeconds?: number;
    title?: React.ReactNode;
    description?: React.ReactNode;
    /** Called when the account works at once (no email to confirm). */
    onSignedUp?: () => void;
}

/**
 * The screen that creates an account (CR-127): name, email, a password with its requirements shown
 * while typing, the terms; then "Check your email" when the address must be confirmed.
 */
export function SignUp({
    onSignUp,
    onResendVerification,
    askName = true,
    terms,
    passwordRules = {},
    providers = [],
    onProviderSignIn,
    signInLink,
    resendSeconds = 30,
    title,
    description,
    onSignedUp,
    errorMessage,
    brand,
    toolbar,
    footer,
    bare,
    className,
}: SignUpProps) {
    const t = useAccessText();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accepted, setAccepted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string | undefined>>({});
    const [sentTo, setSentTo] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);
    const [providerPending, setProviderPending] = useState<string | null>(null);
    const action = useAuthAction(errorMessage);
    const resend = useAuthAction(errorMessage);
    const [left, startCooldown] = useCooldown(resendSeconds);
    const form = useRef<HTMLFormElement>(null);
    const frame = { brand, toolbar, footer, bare, className };

    if (sentTo) {
        return (
            <AuthFrame
                {...frame}
                icon="mail"
                title={t.checkEmailTitle}
                description={<EmailIn text={interpolate(t.checkEmailSignUp, { email: sentTo })} email={sentTo} />}
                below={<AltLine text={t.haveAccount} link={signInLink} label={t.signInLink} />}
            >
                <div className="space-y-4 text-center text-sm text-muted-foreground">
                    <p>{t.checkEmailHint}</p>
                    <FormError message={resend.error} />
                    <FormNotice message={notice} />
                    <div className="flex flex-col items-center gap-2">
                        {onResendVerification && (
                            <LinkButton
                                disabled={left > 0 || resend.pending}
                                onClick={async () => {
                                    setNotice(null);
                                    const result = await resend.run(() => onResendVerification(sentTo));
                                    if (result.ok) {
                                        setNotice(t.resent);
                                        startCooldown();
                                    }
                                }}
                            >
                                {left > 0 ? interpolate(t.resendIn, { seconds: left }) : t.resend}
                            </LinkButton>
                        )}
                        <LinkButton onClick={() => { setSentTo(null); setNotice(null); }}>{t.useOtherEmail}</LinkButton>
                    </div>
                </div>
            </AuthFrame>
        );
    }

    const clearError = (key: string) => {
        if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
    };

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        const weak = passwordChecks(password, passwordRules, t).some((check) => !check.met);
        const found = {
            name: askName && !name.trim() ? t.nameRequired : undefined,
            email: emailProblem(email, t),
            password: !password ? t.passwordRequired : weak ? t.errorWeakPassword : undefined,
            terms: terms && !accepted ? t.termsRequired : undefined,
        };
        setErrors(found);
        if (Object.values(found).some(Boolean)) {
            focusFirstInvalid(form.current);
            return;
        }
        const address = email.trim();
        const result = await action.run(() => onSignUp({
            ...(askName ? { name: name.trim() } : {}),
            email: address,
            password,
        }));
        if (!result.ok) return;
        const outcome = result.value as Partial<AuthSignUpResult> | undefined;
        if (outcome && typeof outcome === 'object' && outcome.needsEmailVerification) {
            startCooldown();
            setSentTo(address);
        } else {
            onSignedUp?.();
        }
    };

    const signInWith = async (id: string) => {
        if (!onProviderSignIn) return;
        setProviderPending(id);
        const result = await action.run(() => onProviderSignIn(id));
        setProviderPending(null);
        if (result.ok) onSignedUp?.();
    };

    const hasProviders = providers.length > 0 && !!onProviderSignIn;

    return (
        <AuthFrame
            {...frame}
            title={title ?? t.signUpTitle}
            description={description ?? t.signUpDescription}
            below={<AltLine text={t.haveAccount} link={signInLink} label={t.signInLink} />}
        >
            <div className="space-y-6">
                {hasProviders && (
                    <>
                        <ProviderButtons providers={providers} onSelect={signInWith} pending={providerPending} disabled={action.pending} />
                        <Divider label={t.or} />
                    </>
                )}
                <form ref={form} className="space-y-4" noValidate onSubmit={submit}>
                    {askName && (
                        <AuthField
                            label={t.name}
                            name="name"
                            value={name}
                            onChange={(value) => { setName(value); clearError('name'); }}
                            autoComplete="name"
                            error={errors.name}
                            autoFocus={!hasProviders}
                            required
                        />
                    )}
                    <AuthField
                        label={t.email}
                        type="email"
                        name="email"
                        value={email}
                        onChange={(value) => { setEmail(value); clearError('email'); }}
                        autoComplete="email"
                        autoCapitalize="none"
                        spellCheck={false}
                        error={errors.email}
                        autoFocus={!askName && !hasProviders}
                        required
                    />
                    <PasswordField
                        label={t.password}
                        name="new-password"
                        value={password}
                        onChange={(value) => { setPassword(value); clearError('password'); }}
                        autoComplete="new-password"
                        error={errors.password}
                        rules={passwordRules}
                        required
                    />
                    {terms && (
                        <div className="space-y-1.5">
                            <label className="flex cursor-pointer items-start gap-2.5 text-sm text-foreground">
                                <input
                                    type="checkbox"
                                    checked={accepted}
                                    onChange={(event) => { setAccepted(event.target.checked); clearError('terms'); }}
                                    aria-invalid={errors.terms ? true : undefined}
                                    aria-describedby={errors.terms ? 'signup-terms-error' : undefined}
                                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-sm border border-input accent-[hsl(var(--rf-primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                                <span className="leading-snug">{terms === true ? t.terms : terms}</span>
                            </label>
                            {errors.terms && <p id="signup-terms-error" className="text-sm text-foreground">{errors.terms}</p>}
                        </div>
                    )}
                    <FormError message={action.error} />
                    <SubmitButton pending={action.pending && !providerPending}>{t.signUpSubmit}</SubmitButton>
                </form>
            </div>
        </AuthFrame>
    );
}

export default SignUp;
