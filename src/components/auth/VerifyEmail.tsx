import React, { useEffect, useRef, useState } from 'react';
import { interpolate } from '../../I18n';
import { AuthFrame } from './AuthLayout';
import { EmailIn } from './VerifyCode';
import { PrimaryLink } from './ResetPassword';
import {
    FormError,
    FormNotice,
    LinkButton,
    Spinner,
    SubmitButton,
    TextLink,
    useAccessText,
    useAuthAction,
    useCooldown,
    type AuthLink,
    type AuthScreenProps,
} from './shared';

export interface VerifyEmailProps extends AuthScreenProps {
    /** The code of the link (`oobCode`, `token_hash`, …): with `onVerify` the screen confirms it at once. */
    code?: string | null;
    /** Confirms the email with the code of the link. */
    onVerify?: (code: string) => Promise<unknown>;
    /** The address waiting for its confirmation. */
    email?: string;
    /** Sends the link again. */
    onResend?: () => Promise<unknown>;
    /**
     * "I've confirmed it": checks again (e.g. reloads the user). `false` means still not confirmed;
     * anything else calls `onVerified`.
     */
    onContinue?: () => Promise<boolean | void>;
    /** The button after the email is confirmed (the app, or the sign in). */
    continueLink?: AuthLink;
    signInLink?: AuthLink;
    /** Seconds before a new link can be asked. Default `30`. */
    resendSeconds?: number;
    /** Called once the email is confirmed. */
    onVerified?: () => void;
}

/**
 * The activation of an account (CR-127): opened by the link of the email it confirms the code at once
 * (confirming, done, link expired); otherwise it waits for the confirmation, with a new send after a
 * wait and "I've confirmed it".
 */
export function VerifyEmail({
    code,
    onVerify,
    email,
    onResend,
    onContinue,
    continueLink,
    signInLink,
    resendSeconds = 30,
    onVerified,
    errorMessage,
    brand,
    toolbar,
    footer,
    bare,
    className,
}: VerifyEmailProps) {
    const t = useAccessText();
    const verifying = !!code && !!onVerify;
    const [state, setState] = useState<'checking' | 'done' | 'failed' | 'waiting'>(verifying ? 'checking' : 'waiting');
    const [notice, setNotice] = useState<string | null>(null);
    const verify = useAuthAction(errorMessage);
    const resend = useAuthAction(errorMessage);
    const check = useAuthAction(errorMessage);
    const [stillWaiting, setStillWaiting] = useState(false);
    const [left, startCooldown] = useCooldown(resendSeconds);
    const started = useRef<string | null>(null);
    const frame = { brand, toolbar, footer, bare, className };
    const back = signInLink && (
        <p className="text-center text-sm">
            <TextLink to={signInLink}>{t.backToSignIn}</TextLink>
        </p>
    );

    useEffect(() => {
        if (!code || !onVerify || started.current === code) return;
        // Once per code: a link works once, a second call would say it is expired.
        started.current = code;
        setState('checking');
        void verify.run(() => onVerify(code)).then((result) => {
            setState(result.ok ? 'done' : 'failed');
            if (result.ok) onVerified?.();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code, onVerify]);

    const sendAgain = onResend && (
        <LinkButton
            disabled={left > 0 || resend.pending}
            onClick={async () => {
                setNotice(null);
                const result = await resend.run(onResend);
                if (result.ok) {
                    setNotice(t.resent);
                    startCooldown();
                }
            }}
        >
            {left > 0 ? interpolate(t.resendIn, { seconds: left }) : t.resend}
        </LinkButton>
    );

    if (state === 'checking') {
        return (
            <AuthFrame {...frame} title={t.verifyChecking}>
                <div className="flex justify-center py-2 text-muted-foreground" role="status" aria-label={t.verifyChecking}>
                    <Spinner className="h-6 w-6" />
                </div>
            </AuthFrame>
        );
    }

    if (state === 'done') {
        return (
            <AuthFrame {...frame} icon="check-circle" tone="success" title={t.verifyDoneTitle} description={t.verifyDone}>
                {(continueLink ?? signInLink) && <PrimaryLink to={(continueLink ?? signInLink)!}>{t.continue}</PrimaryLink>}
            </AuthFrame>
        );
    }

    if (state === 'failed') {
        const expired = verify.reason === 'expiredLink' || verify.reason === 'invalidCode';
        return (
            <AuthFrame
                {...frame}
                icon="link-break"
                tone="warning"
                title={expired ? t.linkExpiredTitle : t.verifyTitle}
                description={expired ? t.linkExpired : undefined}
                below={back}
            >
                <div className="space-y-4 text-center">
                    {!expired && <FormError message={verify.error} />}
                    <FormError message={resend.error} />
                    <FormNotice message={notice} />
                    {sendAgain}
                </div>
            </AuthFrame>
        );
    }

    return (
        <AuthFrame
            {...frame}
            icon="mail"
            title={t.verifyTitle}
            description={email
                ? <EmailIn text={interpolate(t.verifyPending, { email })} email={email} />
                : t.verifyPendingNoEmail}
            below={back}
        >
            <div className="space-y-4">
                <p className="text-center text-sm text-muted-foreground">{t.checkEmailHint}</p>
                <FormError message={stillWaiting ? t.notVerifiedYet : check.error ?? resend.error} />
                <FormNotice message={notice} />
                {onContinue && (
                    <form
                        noValidate
                        onSubmit={async (event) => {
                            event.preventDefault();
                            setStillWaiting(false);
                            setNotice(null);
                            const result = await check.run(onContinue);
                            if (!result.ok) return;
                            if (result.value === false) setStillWaiting(true);
                            else {
                                setState('done');
                                onVerified?.();
                            }
                        }}
                    >
                        <SubmitButton pending={check.pending}>{t.verifiedContinue}</SubmitButton>
                    </form>
                )}
                {sendAgain && <div className="text-center">{sendAgain}</div>}
            </div>
        </AuthFrame>
    );
}

export default VerifyEmail;
