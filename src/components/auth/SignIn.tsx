import React, { useRef, useState } from 'react';
import { interpolate } from '../../I18n';
import { AuthFrame } from './AuthLayout';
import { ProviderButtons, type AuthProviderOption } from './providers';
import { VerifyCode } from './VerifyCode';
import {
    AltLine,
    AuthField,
    Divider,
    FormError,
    LinkButton,
    PasswordField,
    SubmitButton,
    TextLink,
    emailProblem,
    focusFirstInvalid,
    useAccessText,
    useAuthAction,
    type AuthLink,
    type AuthScreenProps,
} from './shared';

export interface SignInProps extends AuthScreenProps {
    /** Signs in with email and password. Without it there is no password. */
    onPasswordSignIn?: (credentials: { email: string; password: string }) => Promise<unknown>;
    /** Sends a code by email. With `onVerifyCode`, the screen offers to sign in with a code. */
    onRequestCode?: (email: string) => Promise<unknown>;
    /** Signs in with the code received by email. */
    onVerifyCode?: (email: string, code: string) => Promise<unknown>;
    /** The ways in through other services, in this order: `['google', 'apple']`. */
    providers?: AuthProviderOption[];
    /** Signs in with a provider of `providers`. */
    onProviderSignIn?: (id: string) => Promise<unknown>;
    /** The first way offered when there are password and code. Default `password`. */
    method?: 'password' | 'code';
    /** Digits of the code. Default `6`. */
    codeLength?: number;
    /** Seconds before a new code can be asked. Default `30`. */
    resendSeconds?: number;
    /** "Forgot password?" next to the password. */
    forgotPasswordLink?: AuthLink;
    /** "Don't have an account? Create one" under the card. */
    signUpLink?: AuthLink;
    /** The email already typed (an invitation, the last visit). */
    defaultEmail?: string;
    /** The name of the app in the title: "Sign in to <appName>". */
    appName?: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    /** Called once signed in (the gate shows the page by itself). */
    onSignedIn?: () => void;
}

/**
 * The sign-in screen (CR-127): providers, then email and password or a code by email, in any
 * combination. An error of a function appears in the screen, translated, and what was typed stays.
 */
export function SignIn({
    onPasswordSignIn,
    onRequestCode,
    onVerifyCode,
    providers = [],
    onProviderSignIn,
    method: initialMethod,
    codeLength = 6,
    resendSeconds = 30,
    forgotPasswordLink,
    signUpLink,
    defaultEmail = '',
    appName,
    title,
    description,
    onSignedIn,
    errorMessage,
    brand,
    toolbar,
    footer,
    bare,
    className,
}: SignInProps) {
    const t = useAccessText();
    const hasPassword = !!onPasswordSignIn;
    const hasCode = !!onRequestCode && !!onVerifyCode;
    const hasProviders = providers.length > 0 && !!onProviderSignIn;
    const [method, setMethod] = useState<'password' | 'code'>(
        initialMethod === 'code' && hasCode ? 'code' : hasPassword ? 'password' : 'code',
    );
    const [email, setEmail] = useState(defaultEmail);
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [codeSentTo, setCodeSentTo] = useState<string | null>(null);
    const [providerPending, setProviderPending] = useState<string | null>(null);
    const action = useAuthAction(errorMessage);
    const form = useRef<HTMLFormElement>(null);
    const frame = { brand, toolbar, footer, bare, className };

    if (codeSentTo && onVerifyCode && onRequestCode) {
        return (
            <VerifyCode
                {...frame}
                email={codeSentTo}
                length={codeLength}
                resendSeconds={resendSeconds}
                errorMessage={errorMessage}
                onVerify={(code) => onVerifyCode(codeSentTo, code)}
                onResend={() => onRequestCode(codeSentTo)}
                onChangeEmail={() => setCodeSentTo(null)}
                onVerified={onSignedIn}
            />
        );
    }

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        const found = {
            email: emailProblem(email, t),
            password: method === 'password' && !password ? t.passwordRequired : undefined,
        };
        setErrors(found);
        if (found.email || found.password) {
            focusFirstInvalid(form.current);
            return;
        }
        const address = email.trim();
        if (method === 'password' && onPasswordSignIn) {
            const result = await action.run(() => onPasswordSignIn({ email: address, password }));
            if (result.ok) onSignedIn?.();
        } else if (onRequestCode) {
            const result = await action.run(() => onRequestCode(address));
            if (result.ok) setCodeSentTo(address);
        }
    };

    const signInWith = async (id: string) => {
        if (!onProviderSignIn) return;
        setProviderPending(id);
        const result = await action.run(() => onProviderSignIn(id));
        setProviderPending(null);
        if (result.ok) onSignedIn?.();
    };

    const switchMethod = () => {
        action.clear();
        setErrors({});
        setMethod((current) => (current === 'password' ? 'code' : 'password'));
    };

    const showForm = hasPassword || hasCode;

    return (
        <AuthFrame
            {...frame}
            title={title ?? (appName ? interpolate(t.signInTitleApp, { app: appName }) : t.signInTitle)}
            description={description ?? t.signInDescription}
            below={<AltLine text={t.noAccount} link={signUpLink} label={t.signUpLink} />}
        >
            <div className="space-y-6">
                {hasProviders && (
                    <ProviderButtons
                        providers={providers}
                        onSelect={signInWith}
                        pending={providerPending}
                        disabled={action.pending}
                    />
                )}
                {hasProviders && showForm && <Divider label={t.or} />}
                {!showForm && <FormError message={action.error} />}
                {showForm && (
                    <form ref={form} className="space-y-4" noValidate onSubmit={submit}>
                        <AuthField
                            label={t.email}
                            type="email"
                            name="email"
                            value={email}
                            onChange={(value) => {
                                setEmail(value);
                                if (errors.email) setErrors((current) => ({ ...current, email: undefined }));
                            }}
                            autoComplete={method === 'password' ? 'username' : 'email'}
                            autoCapitalize="none"
                            spellCheck={false}
                            error={errors.email}
                            autoFocus={!defaultEmail && !hasProviders}
                            required
                        />
                        {method === 'password' && (
                            <PasswordField
                                label={t.password}
                                name="password"
                                value={password}
                                onChange={(value) => {
                                    setPassword(value);
                                    if (errors.password) setErrors((current) => ({ ...current, password: undefined }));
                                }}
                                autoComplete="current-password"
                                error={errors.password}
                                autoFocus={!!defaultEmail}
                                required
                                labelAside={forgotPasswordLink && (
                                    <TextLink to={forgotPasswordLink} className="text-sm">{t.forgotPassword}</TextLink>
                                )}
                            />
                        )}
                        <FormError message={action.error} />
                        <SubmitButton pending={action.pending && !providerPending}>
                            {method === 'password' ? t.signInSubmit : t.codeRequest}
                        </SubmitButton>
                        {hasPassword && hasCode && (
                            <div className="text-center">
                                <LinkButton onClick={switchMethod}>
                                    {method === 'password' ? t.useCode : t.usePassword}
                                </LinkButton>
                            </div>
                        )}
                    </form>
                )}
            </div>
        </AuthFrame>
    );
}

export default SignIn;
