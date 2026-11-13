import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { interpolate } from '../../I18n';
import { AuthFrame } from './AuthLayout';
import { EmailIn } from './VerifyCode';
import {
    FormError,
    PasswordField,
    SubmitButton,
    TextLink,
    focusFirstInvalid,
    passwordChecks,
    useAccessText,
    useAuthAction,
    type AuthLink,
    type AuthScreenProps,
    type PasswordRules,
} from './shared';
import { buttonBaseClass, buttonPrimaryClass } from '../ui/Buttons';
import { cn } from '../../libs/cn';

export interface ResetPasswordProps extends AuthScreenProps {
    /** Saves the new password (with the code of the link, which your function knows). */
    onResetPassword: (password: string) => Promise<unknown>;
    /** The account, when the link says it. */
    email?: string;
    /** The link has no code, or it is known to be expired: the screen says so at once. */
    invalidLink?: boolean;
    /** What the password needs. Default: at least 8 characters. */
    passwordRules?: PasswordRules;
    /** "Back to sign in", and the button after the password is saved. */
    signInLink?: AuthLink;
    /** "Ask for a new link" when the link is expired (the screen of `ForgotPassword`). */
    requestNewLink?: AuthLink;
    title?: React.ReactNode;
    description?: React.ReactNode;
    /** Called after the password is saved. */
    onDone?: () => void;
}

/**
 * The screen of a new password (CR-127), opened by the link of the email: the password with its
 * requirements, then "Password changed"; an expired link says so and offers a new one.
 */
export function ResetPassword({
    onResetPassword,
    email,
    invalidLink,
    passwordRules = {},
    signInLink,
    requestNewLink,
    title,
    description,
    onDone,
    errorMessage,
    brand,
    toolbar,
    footer,
    bare,
    className,
}: ResetPasswordProps) {
    const t = useAccessText();
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | undefined>();
    const [done, setDone] = useState(false);
    const action = useAuthAction(errorMessage);
    const form = useRef<HTMLFormElement>(null);
    const frame = { brand, toolbar, footer, bare, className };
    const back = signInLink && (
        <p className="text-center text-sm">
            <TextLink to={signInLink}>{t.backToSignIn}</TextLink>
        </p>
    );

    if (invalidLink || action.reason === 'expiredLink') {
        return (
            <AuthFrame {...frame} icon="link-break" tone="warning" title={t.linkExpiredTitle} description={t.linkExpired} below={back}>
                {requestNewLink && <PrimaryLink to={requestNewLink}>{t.requestNewLink}</PrimaryLink>}
            </AuthFrame>
        );
    }

    if (done) {
        return (
            <AuthFrame {...frame} icon="check-circle" tone="success" title={t.resetDoneTitle} description={t.resetDone}>
                {signInLink && <PrimaryLink to={signInLink}>{t.signInLink}</PrimaryLink>}
            </AuthFrame>
        );
    }

    return (
        <AuthFrame
            {...frame}
            title={title ?? t.resetTitle}
            description={description ?? (email
                ? <EmailIn text={interpolate(t.resetDescriptionFor, { email })} email={email} />
                : t.resetDescription)}
            below={back}
        >
            <form
                ref={form}
                className="space-y-4"
                noValidate
                onSubmit={async (event) => {
                    event.preventDefault();
                    const weak = passwordChecks(password, passwordRules, t).some((check) => !check.met);
                    const problem = !password ? t.passwordRequired : weak ? t.errorWeakPassword : undefined;
                    setError(problem);
                    if (problem) {
                        focusFirstInvalid(form.current);
                        return;
                    }
                    const result = await action.run(() => onResetPassword(password));
                    if (result.ok) {
                        setDone(true);
                        onDone?.();
                    }
                }}
            >
                {/* The account, for the password manager that saves the new password. */}
                {email && <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />}
                <PasswordField
                    label={t.newPassword}
                    name="new-password"
                    value={password}
                    onChange={(value) => { setPassword(value); setError(undefined); }}
                    autoComplete="new-password"
                    error={error}
                    rules={passwordRules}
                    autoFocus
                    required
                />
                <FormError message={action.error} />
                <SubmitButton pending={action.pending}>{t.resetSubmit}</SubmitButton>
            </form>
        </AuthFrame>
    );
}

/** The one action of a state (sign in, ask a new link), as a full-width button. */
export function PrimaryLink({ to, children }: { to: AuthLink; children: React.ReactNode }) {
    const className = cn(buttonBaseClass, buttonPrimaryClass, 'h-11 w-full text-base sm:h-10 sm:text-sm');
    if (typeof to !== 'string') return <button type="button" onClick={to} className={className}>{children}</button>;
    if (/^[a-z][a-z0-9+.-]*:/i.test(to)) return <a href={to} className={className}>{children}</a>;
    return <Link to={to} className={className}>{children}</Link>;
}

export default ResetPassword;
