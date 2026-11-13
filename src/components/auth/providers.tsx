import React from 'react';
import { cn } from '../../libs/cn';
import { interpolate } from '../../I18n';
import { buttonBaseClass } from '../ui/Buttons';
import { Spinner, useAccessText } from './shared';

/** A way in through another service: its id (`google`, `apple`, `github`, `microsoft`, …), or the whole option. */
export type AuthProviderOption = string | {
    id: string;
    /** The name shown, "Continue with <label>". Default: the known name of the id. */
    label?: string;
    /** The mark of the service. Default: the one of a known id. */
    icon?: React.ReactNode;
};

const NAMES: Record<string, string> = {
    google: 'Google',
    apple: 'Apple',
    github: 'GitHub',
    microsoft: 'Microsoft',
    facebook: 'Facebook',
    twitter: 'X',
    x: 'X',
    gitlab: 'GitLab',
    linkedin: 'LinkedIn',
};

const GoogleMark = () => (
    <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
);

const AppleMark = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
        <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
    </svg>
);

const GitHubMark = () => (
    <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
);

const MicrosoftMark = () => (
    <svg viewBox="0 0 21 21" width="18" height="18" aria-hidden="true">
        <rect x="0" y="0" width="10" height="10" fill="#F25022" />
        <rect x="11" y="0" width="10" height="10" fill="#7FBA00" />
        <rect x="0" y="11" width="10" height="10" fill="#00A4EF" />
        <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
    </svg>
);

const MARKS: Record<string, () => React.ReactElement> = {
    google: GoogleMark,
    apple: AppleMark,
    github: GitHubMark,
    microsoft: MicrosoftMark,
};

export function resolveProvider(option: AuthProviderOption) {
    const value = typeof option === 'string' ? { id: option } : option;
    const id = value.id;
    const Mark = MARKS[id.toLowerCase()];
    return {
        id,
        label: value.label ?? NAMES[id.toLowerCase()] ?? id.charAt(0).toUpperCase() + id.slice(1),
        icon: value.icon ?? (Mark ? <Mark /> : null),
    };
}

/** The buttons "Continue with …", one per provider, one under the other. */
export function ProviderButtons({
    providers,
    onSelect,
    pending,
    disabled,
}: {
    providers: AuthProviderOption[];
    onSelect: (id: string) => void;
    /** The id of the provider being opened. */
    pending?: string | null;
    disabled?: boolean;
}) {
    const t = useAccessText();
    return (
        <div className="grid gap-2.5">
            {providers.map((option) => {
                const provider = resolveProvider(option);
                const busy = pending === provider.id;
                return (
                    <button
                        key={provider.id}
                        type="button"
                        onClick={() => onSelect(provider.id)}
                        disabled={disabled || !!pending}
                        aria-busy={busy || undefined}
                        className={cn(
                            buttonBaseClass,
                            'h-11 w-full gap-2.5 border border-input bg-background text-base text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground sm:h-10 sm:text-sm',
                        )}
                    >
                        {busy ? <Spinner /> : provider.icon}
                        <span>{interpolate(t.continueWith, { provider: provider.label })}</span>
                    </button>
                );
            })}
        </div>
    );
}
