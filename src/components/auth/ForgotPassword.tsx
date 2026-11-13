import React, { useRef, useState } from 'react';
import { interpolate } from '../../I18n';
import { AuthFrame } from './AuthLayout';
import { EmailIn } from './VerifyCode';
import {
    AuthField,
    FormError,
    FormNotice,
    LinkButton,
    SubmitButton,
    TextLink,
    emailProblem,
    focusFirstInvalid,
    useAccessText,
    useAuthAction,
    useCooldown,
    type AuthLink,
    type AuthScreenProps,
} from './shared';

export interface ForgotPasswordProps extends AuthScreenProps {
    /** Sends the link to choose a new password. */
    onSendReset: (email: string) => Promise<unknown>;
    /** "Back to sign in". */
    signInLink?: AuthLink;
    defaultEmail?: string;
    /** Seconds before a new link can be asked. Default `30`. */
    resendSeconds?: number;
    title?: React.ReactNode;
    description?: React.ReactNode;
}

/**
 * The screen to recover a password (CR-127): the email, then the same answer whether the account
 * exists or not (it never tells who has an account), a new send after a wait.
 */
export function ForgotPassword({
    onSendReset,
    signInLink,
    defaultEmail = '',
    resendSeconds = 30,
    title,
    description,
    errorMessage,
    brand,
    toolbar,
    footer,
    bare,
    className,
}: ForgotPasswordProps) {
    const t = useAccessText();
    const [email, setEmail] = useState(defaultEmail);
    const [error, setError] = useState<string | undefined>();
    const [sentTo, setSentTo] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);
    const action = useAuthAction(errorMessage);
    const [left, startCooldown] = useCooldown(resendSeconds);
    const form = useRef<HTMLFormElement>(null);
    const frame = { brand, toolbar, footer, bare, className };
    const back = signInLink && (
        <p className="text-center text-sm">
            <TextLink to={signInLink}>{t.backToSignIn}</TextLink>
        </p>
    );

    const send = async (address: string) => {
        setNotice(null);
        const result = await action.run(() => onSendReset(address));
        if (result.ok) {
            startCooldown();
            if (sentTo) setNotice(t.resent);
            setSentTo(address);
        }
    };

    if (sentTo) {
        return (
            <AuthFrame
                {...frame}
                icon="mail"
                title={t.checkEmailTitle}
                description={<EmailIn text={interpolate(t.forgotSent, { email: sentTo })} email={sentTo} />}
                below={back}
            >
                <div className="space-y-4 text-center text-sm text-muted-foreground">
                    <p>{t.checkEmailHint}</p>
                    <FormError message={action.error} />
                    <FormNotice message={notice} />
                    <div className="flex flex-col items-center gap-2">
                        <LinkButton disabled={left > 0 || action.pending} onClick={() => void send(sentTo)}>
                            {left > 0 ? interpolate(t.resendIn, { seconds: left }) : t.resend}
                        </LinkButton>
                        <LinkButton onClick={() => { setSentTo(null); setNotice(null); action.clear(); }}>{t.useOtherEmail}</LinkButton>
                    </div>
                </div>
            </AuthFrame>
        );
    }

    return (
        <AuthFrame
            {...frame}
            title={title ?? t.forgotTitle}
            description={description ?? t.forgotDescription}
            below={back}
        >
            <form
                ref={form}
                className="space-y-4"
                noValidate
                onSubmit={async (event) => {
                    event.preventDefault();
                    const problem = emailProblem(email, t);
                    setError(problem);
                    if (problem) {
                        focusFirstInvalid(form.current);
                        return;
                    }
                    await send(email.trim());
                }}
            >
                <AuthField
                    label={t.email}
                    type="email"
                    name="email"
                    value={email}
                    onChange={(value) => { setEmail(value); setError(undefined); }}
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    error={error}
                    autoFocus
                    required
                />
                <FormError message={action.error} />
                <SubmitButton pending={action.pending}>{t.forgotSubmit}</SubmitButton>
            </form>
        </AuthFrame>
    );
}

export default ForgotPassword;
