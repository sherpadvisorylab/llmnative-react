import React, { useEffect, useRef } from 'react';
import { cn } from '../../libs/cn';
import { interpolate } from '../../I18n';
import { useAccessText } from './shared';

export interface OneTimeCodeInputProps {
    /** The code typed so far (digits or letters, without spaces). */
    value: string;
    onChange: (value: string) => void;
    /** Called once every box is filled (typed, pasted or filled by the phone). */
    onComplete?: (code: string) => void;
    /** How many characters. Default `6`. */
    length?: number;
    /** `numeric` (default) shows the number keyboard on a phone; `alphanumeric` takes letters too. */
    mode?: 'numeric' | 'alphanumeric';
    disabled?: boolean;
    /** The code was refused: the boxes say it. */
    invalid?: boolean;
    autoFocus?: boolean;
    /** The name of the group for a screen reader. Default: "Sign-in code". */
    label?: string;
    /** The id of the text that describes the code (where it was sent), or of its error. */
    describedBy?: string;
    className?: string;
}

/**
 * A one-time code in boxes (CR-127): typing moves to the next box, Backspace to the previous one, a
 * pasted code (or the one the phone suggests from an SMS or email, `one-time-code`) fills them all.
 */
export function OneTimeCodeInput({
    value,
    onChange,
    onComplete,
    length = 6,
    mode = 'numeric',
    disabled,
    invalid,
    autoFocus,
    label,
    describedBy,
    className,
}: OneTimeCodeInputProps) {
    const t = useAccessText();
    const boxes = useRef<Array<HTMLInputElement | null>>([]);
    const allowed = mode === 'numeric' ? /[0-9]/ : /[0-9a-z]/i;
    const clean = (text: string) => Array.from(text).filter((char) => allowed.test(char)).join('').slice(0, length);
    const chars = Array.from({ length }, (_, index) => value[index] ?? '');
    const completed = useRef<string | null>(null);

    useEffect(() => {
        if (autoFocus) boxes.current[Math.min(value.length, length - 1)]?.focus();
        // Only on mount: the focus then follows the typing.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (value.length === length && completed.current !== value) {
            completed.current = value;
            onComplete?.(value);
        }
        if (value.length < length) completed.current = null;
    }, [value, length, onComplete]);

    const focusBox = (index: number) => {
        const box = boxes.current[Math.max(0, Math.min(index, length - 1))];
        box?.focus();
        box?.select();
    };

    /** Writes `text` from box `index` on, and moves to the box after it. */
    const write = (index: number, text: string) => {
        const typed = clean(text);
        if (!typed) return;
        const next = (value.slice(0, index) + typed).slice(0, length);
        const keep = typed.length === 1 ? value.slice(index + 1) : '';
        const result = clean(next + keep.slice(0, Math.max(0, length - next.length)));
        onChange(result);
        // A box past the code typed so far fills the first empty one: the focus follows the code.
        focusBox(Math.min(index + typed.length, result.length));
    };

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace') {
            event.preventDefault();
            if (chars[index]) {
                onChange(value.slice(0, index) + value.slice(index + 1));
            } else if (index > 0) {
                onChange(value.slice(0, index - 1) + value.slice(index));
                focusBox(index - 1);
            }
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            focusBox(index - 1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            focusBox(index + 1);
        } else if (event.key === 'Home') {
            event.preventDefault();
            focusBox(0);
        } else if (event.key === 'End') {
            event.preventDefault();
            focusBox(value.length);
        }
    };

    const groupLabel = label ?? t.codeLabel;
    const half = length % 2 === 0 && length >= 6 ? length / 2 : -1;

    return (
        <div
            role="group"
            aria-label={groupLabel}
            aria-describedby={describedBy}
            dir="ltr"
            className={cn('flex items-center justify-center gap-2', className)}
        >
            {chars.map((char, index) => (
                <React.Fragment key={index}>
                    {index === half && <span aria-hidden="true" className="h-px w-2 shrink-0 bg-muted-foreground/60 sm:w-3" />}
                    <input
                        ref={(element) => { boxes.current[index] = element; }}
                        value={char}
                        // The first box takes the whole code from the phone or the password manager.
                        autoComplete={index === 0 ? 'one-time-code' : 'off'}
                        inputMode={mode === 'numeric' ? 'numeric' : 'text'}
                        pattern={mode === 'numeric' ? '[0-9]*' : undefined}
                        autoCapitalize="characters"
                        spellCheck={false}
                        maxLength={index === 0 ? length : 1}
                        disabled={disabled}
                        aria-label={interpolate(t.codeDigit, { index: index + 1, length })}
                        aria-invalid={invalid || undefined}
                        onFocus={(event) => event.target.select()}
                        onChange={(event) => {
                            const text = event.target.value;
                            if (!text) {
                                onChange(value.slice(0, index) + value.slice(index + 1));
                                return;
                            }
                            // A box holds one character: what is new is what differs from it.
                            write(index, text.length > 1 && char && text.startsWith(char) ? text.slice(1) : text);
                        }}
                        onKeyDown={(event) => handleKeyDown(index, event)}
                        onPaste={(event) => {
                            event.preventDefault();
                            write(index, event.clipboardData.getData('text'));
                        }}
                        className={cn(
                            'h-12 w-10 min-w-0 rounded-md border bg-background text-center text-xl font-semibold tabular-nums text-foreground shadow-sm transition-colors sm:w-11',
                            'focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            invalid ? 'border-destructive' : 'border-input',
                            mode === 'alphanumeric' && 'uppercase',
                        )}
                    />
                </React.Fragment>
            ))}
        </div>
    );
}

export default OneTimeCodeInput;
