import React, { useCallback, useId, useState } from 'react';
import { interpolate } from '../../I18n';
import { AuthFrame } from './AuthLayout';
import { OneTimeCodeInput } from './OneTimeCodeInput';
import {
    FormError,
    FormNotice,
    LinkButton,
    SubmitButton,
    useAccessText,
    useAuthAction,
    useCooldown,
    type AuthScreenProps,
} from './shared';

export interface VerifyCodeProps extends AuthScreenProps {
    /** Where the code was sent: shown to the person. */
    email?: string;
    /** Checks the code; throw to refuse it (`AuthFlowError('invalidCode')`). */
    onVerify: (code: string) => Promise<unknown>;
    /** Sends a new code. Without it there is no "Send it again". */
    onResend?: () => Promise<unknown>;
    /** Goes back to type another email. */
    onChangeEmail?: () => void;
    /** Default `6`. */
    length?: number;
    mode?: 'numeric' | 'alphanumeric';
    /** Seconds before a new code can be asked. Default `30`. */
    resendSeconds?: number;
    title?: React.ReactNode;
    description?: React.ReactNode;
    /** Called after the code was accepted. */
    onVerified?: () => void;
}

/**
 * The screen of a one-time code (CR-127): where it was sent, the boxes, sent as soon as it is complete,
 * a new code after a wait, another email.
 */
export function VerifyCode({
    email,
    onVerify,
    onResend,
    onChangeEmail,
    length = 6,
    mode = 'numeric',
    resendSeconds = 30,
    title,
    description,
    onVerified,
    errorMessage,
    brand,
    toolbar,
    footer,
    bare,
    className,
}: VerifyCodeProps) {
    const t = useAccessText();
    const [code, setCode] = useState('');
    const [notice, setNotice] = useState<string | null>(null);
    const verify = useAuthAction(errorMessage);
    const resend = useAuthAction(errorMessage);
    const [left, startCooldown] = useCooldown(resendSeconds);
    const descriptionId = useId();

    const submit = useCallback(async (value: string) => {
        if (value.length < length || verify.pending) return;
        setNotice(null);
        const result = await verify.run(() => onVerify(value));
        if (result.ok) onVerified?.();
        else setCode('');
    }, [length, onVerify, onVerified, verify]);

    const sendAgain = async () => {
        if (!onResend) return;
        setNotice(null);
        const result = await resend.run(onResend);
        if (result.ok) {
            setCode('');
            setNotice(t.resent);
            startCooldown();
        }
    };

    const text = description ?? (email ? interpolate(t.codeDescription, { length, email }) : undefined);

    return (
        <AuthFrame
            bare={bare}
            brand={brand}
            toolbar={toolbar}
            footer={footer}
            className={className}
            icon="mail-open"
            title={title ?? t.codeTitle}
            description={text && (
                <span id={descriptionId}>{email && typeof text === 'string' ? <EmailIn text={text} email={email} /> : text}</span>
            )}
        >
            <form
                className="space-y-5"
                noValidate
                onSubmit={(event) => {
                    event.preventDefault();
                    void submit(code);
                }}
            >
                <OneTimeCodeInput
                    value={code}
                    onChange={(next) => {
                        verify.clear();
                        setCode(next);
                    }}
                    onComplete={(complete) => void submit(complete)}
                    length={length}
                    mode={mode}
                    disabled={verify.pending}
                    invalid={!!verify.error}
                    autoFocus
                    describedBy={text ? descriptionId : undefined}
                />
                <FormError message={verify.error ?? resend.error} />
                <FormNotice message={notice} />
                <SubmitButton pending={verify.pending} disabled={code.length < length}>{t.codeSubmit}</SubmitButton>
            </form>
            {(onResend || onChangeEmail) && (
                <div className="mt-6 flex flex-col items-center gap-2 text-sm text-muted-foreground">
                    {onResend && (
                        <p>
                            {t.codeNotReceived}{' '}
                            <LinkButton onClick={sendAgain} disabled={left > 0 || resend.pending}>
                                {left > 0 ? interpolate(t.resendIn, { seconds: left }) : t.resend}
                            </LinkButton>
                        </p>
                    )}
                    {onChangeEmail && <LinkButton onClick={onChangeEmail}>{t.useOtherEmail}</LinkButton>}
                </div>
            )}
        </AuthFrame>
    );
}

/** A sentence with the email in it, the email in bold. */
export function EmailIn({ text, email }: { text: string; email: string }) {
    const at = text.indexOf(email);
    if (at < 0) return <>{text}</>;
    return (
        <>
            {text.slice(0, at)}
            <strong className="break-words font-medium text-foreground">{email}</strong>
            {text.slice(at + email.length)}
        </>
    );
}

export default VerifyCode;
