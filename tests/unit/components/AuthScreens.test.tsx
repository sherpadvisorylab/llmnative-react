/**
 * CR-127 — the access screens, the gate without a redirect, the mock provider and the flows.
 */
import React, { useState } from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '../../../src/I18n';
import { AuthProvider } from '../../../src/providers/auth/AuthProviderContext';
import { AuthFlowError, type AuthProviderAdapter, type UserProfile } from '../../../src/providers/auth/AuthProvider';
import { MockAuthProvider } from '../../../src/providers/auth/mock/MockAuthProvider';
import {
    AuthGate,
    ForgotPassword,
    OneTimeCodeInput,
    ResetPassword,
    SignIn,
    SignUp,
    VerifyEmail,
    authErrorReason,
    linkCode,
    useAuthFlows,
} from '../../../src/components/auth';
import App from '../../../src/App';

const wrap = ({ children }: { children: React.ReactNode }) => (
    <I18nProvider>
        <MemoryRouter>{children}</MemoryRouter>
    </I18nProvider>
);
const view = (ui: React.ReactElement) => render(ui, { wrapper: wrap });

const withAuth = (adapter: AuthProviderAdapter, ui: React.ReactElement) => view(
    <AuthProvider registry={{ main: adapter }} defaultKey="main">{ui}</AuthProvider>,
);

describe('SignIn', () => {
    it('checks the fields, ties each error to its field and moves the focus to the first one', async () => {
        const onPasswordSignIn = vi.fn(async () => undefined);
        view(<SignIn onPasswordSignIn={onPasswordSignIn} />);

        await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

        const email = screen.getByLabelText('Email');
        expect(email).toHaveAttribute('aria-invalid', 'true');
        expect(email).toHaveAccessibleDescription('Enter your email.');
        expect(screen.getByLabelText('Password')).toHaveAccessibleDescription('Enter your password.');
        await waitFor(() => expect(email).toHaveFocus());
        expect(onPasswordSignIn).not.toHaveBeenCalled();
    });

    it('signs in with email and password, with the autocomplete of a password manager', async () => {
        const onPasswordSignIn = vi.fn(async () => undefined);
        const onSignedIn = vi.fn();
        view(<SignIn onPasswordSignIn={onPasswordSignIn} onSignedIn={onSignedIn} />);

        const email = screen.getByLabelText('Email');
        const password = screen.getByLabelText('Password');
        expect(email).toHaveAttribute('autocomplete', 'username');
        expect(password).toHaveAttribute('autocomplete', 'current-password');
        await userEvent.type(email, ' ada@example.com ');
        await userEvent.type(password, 'secret-pass');
        await userEvent.keyboard('{Enter}');

        await waitFor(() => expect(onSignedIn).toHaveBeenCalledOnce());
        expect(onPasswordSignIn).toHaveBeenCalledWith({ email: 'ada@example.com', password: 'secret-pass' });
    });

    it('shows a refused sign-in translated, never the text of the service, and keeps what was typed', async () => {
        const onPasswordSignIn = vi.fn(async () => {
            throw Object.assign(new Error('Firebase: Error (auth/invalid-credential).'), { code: 'auth/invalid-credential' });
        });
        view(<SignIn onPasswordSignIn={onPasswordSignIn} />);

        await userEvent.type(screen.getByLabelText('Email'), 'ada@example.com');
        await userEvent.type(screen.getByLabelText('Password'), 'wrong-pass');
        await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('The email or the password is not correct.');
        expect(screen.queryByText(/Firebase: Error/)).not.toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toHaveValue('ada@example.com');
        expect(screen.getByLabelText('Password')).toHaveValue('wrong-pass');
    });

    it('signs in with a code by email: the email, then the code, sent once complete', async () => {
        const onRequestCode = vi.fn(async () => undefined);
        const onVerifyCode = vi.fn(async () => undefined);
        const onSignedIn = vi.fn();
        view(
            <SignIn
                onPasswordSignIn={vi.fn()}
                onRequestCode={onRequestCode}
                onVerifyCode={onVerifyCode}
                onSignedIn={onSignedIn}
            />,
        );

        await userEvent.click(screen.getByRole('button', { name: 'Email me a code instead' }));
        expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();
        await userEvent.type(screen.getByLabelText('Email'), 'ada@example.com');
        await userEvent.click(screen.getByRole('button', { name: 'Email me a sign-in code' }));

        expect(onRequestCode).toHaveBeenCalledWith('ada@example.com');
        expect(await screen.findByRole('heading', { name: 'Enter the code' })).toBeInTheDocument();
        expect(screen.getByText('ada@example.com')).toBeInTheDocument();

        const first = screen.getByLabelText('Digit 1 of 6');
        fireEvent.paste(first, { clipboardData: { getData: () => '123456' } });

        await waitFor(() => expect(onVerifyCode).toHaveBeenCalledWith('ada@example.com', '123456'));
        await waitFor(() => expect(onSignedIn).toHaveBeenCalledOnce());
    });

    it('offers the providers, each with its name, and shows a cancelled popup in words', async () => {
        const onProviderSignIn = vi.fn(async () => {
            throw { code: 'auth/popup-closed-by-user' };
        });
        view(<SignIn providers={['google', { id: 'apple' }]} onProviderSignIn={onProviderSignIn} />);

        expect(screen.getByRole('button', { name: 'Continue with Apple' })).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: 'Continue with Google' }));

        expect(onProviderSignIn).toHaveBeenCalledWith('google');
        expect(await screen.findByRole('alert')).toHaveTextContent('Sign-in was cancelled before it finished.');
    });

    it('names the app in the title and links to the other screens', () => {
        view(<SignIn onPasswordSignIn={vi.fn()} appName="Acme" signUpLink="/sign-up" forgotPasswordLink="/forgot-password" />);

        expect(screen.getByRole('heading', { level: 1, name: 'Sign in to Acme' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Forgot password?' })).toHaveAttribute('href', '/forgot-password');
        expect(screen.getByRole('link', { name: 'Create one' })).toHaveAttribute('href', '/sign-up');
    });
});

describe('OneTimeCodeInput', () => {
    const Harness = ({ onComplete }: { onComplete: (code: string) => void }) => {
        const [value, setValue] = useState('');
        return (
            <>
                <OneTimeCodeInput value={value} onChange={setValue} onComplete={onComplete} />
                <output data-testid="value">{value}</output>
            </>
        );
    };

    it('takes a pasted code without its spaces and dashes, and completes once', async () => {
        const onComplete = vi.fn();
        view(<Harness onComplete={onComplete} />);

        fireEvent.paste(screen.getByLabelText('Digit 1 of 6'), { clipboardData: { getData: () => '12 3-456' } });

        expect(screen.getByTestId('value')).toHaveTextContent('123456');
        await waitFor(() => expect(onComplete).toHaveBeenCalledWith('123456'));
        expect(onComplete).toHaveBeenCalledOnce();
        expect(screen.getByLabelText('Digit 1 of 6')).toHaveAttribute('autocomplete', 'one-time-code');
        expect(screen.getByLabelText('Digit 1 of 6')).toHaveAttribute('inputmode', 'numeric');
    });

    it('moves forward while typing and back with Backspace, and ignores letters', async () => {
        view(<Harness onComplete={vi.fn()} />);

        await userEvent.click(screen.getByLabelText('Digit 1 of 6'));
        await userEvent.keyboard('1a2');
        expect(screen.getByTestId('value')).toHaveTextContent(/^12$/);
        expect(screen.getByLabelText('Digit 3 of 6')).toHaveFocus();

        await userEvent.keyboard('{Backspace}');
        expect(screen.getByTestId('value')).toHaveTextContent(/^1$/);
        expect(screen.getByLabelText('Digit 2 of 6')).toHaveFocus();
    });
});

describe('ForgotPassword', () => {
    it('gives the same answer for any email and makes a new send wait', async () => {
        const onSendReset = vi.fn(async () => undefined);
        view(<ForgotPassword onSendReset={onSendReset} resendSeconds={30} signInLink="/" />);

        await userEvent.type(screen.getByLabelText('Email'), 'nobody@example.com');
        await userEvent.click(screen.getByRole('button', { name: 'Send the link' }));

        expect(await screen.findByRole('heading', { name: 'Check your email' })).toBeInTheDocument();
        expect(screen.getByText(/If an account exists for/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Send again in 30 s' })).toBeDisabled();
        expect(screen.getByRole('link', { name: 'Back to sign in' })).toHaveAttribute('href', '/');
        expect(onSendReset).toHaveBeenCalledWith('nobody@example.com');
    });
});

describe('SignUp', () => {
    it('shows what the password needs, refuses a short one and asks to accept the terms', async () => {
        const onSignUp = vi.fn(async () => ({ needsEmailVerification: true }));
        view(<SignUp onSignUp={onSignUp} terms passwordRules={{ minLength: 10, number: true }} />);

        await userEvent.type(screen.getByLabelText('Full name'), 'Ada Lovelace');
        await userEvent.type(screen.getByLabelText('Email'), 'ada@example.com');
        await userEvent.type(screen.getByLabelText('Password'), 'short1');
        expect(screen.getByText('at least 10 characters').parentElement).toHaveTextContent('missing');
        expect(screen.getByText('a number').parentElement).toHaveTextContent('done');

        await userEvent.click(screen.getByRole('button', { name: 'Create account' }));
        expect(screen.getByLabelText('Password')).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByText('Accept the terms to continue.')).toBeInTheDocument();
        expect(onSignUp).not.toHaveBeenCalled();

        await userEvent.type(screen.getByLabelText('Password'), 'long-enough');
        await userEvent.click(screen.getByRole('checkbox'));
        await userEvent.click(screen.getByRole('button', { name: 'Create account' }));

        expect(onSignUp).toHaveBeenCalledWith({ name: 'Ada Lovelace', email: 'ada@example.com', password: 'short1long-enough' });
        expect(await screen.findByRole('heading', { name: 'Check your email' })).toBeInTheDocument();
        expect(screen.getByText('ada@example.com')).toBeInTheDocument();
    });
});

describe('ResetPassword', () => {
    it('says the link expired when the service refuses its code, and offers a new one', async () => {
        const onResetPassword = vi.fn(async () => {
            throw { code: 'auth/expired-action-code' };
        });
        view(<ResetPassword onResetPassword={onResetPassword} requestNewLink="/forgot-password" />);

        await userEvent.type(screen.getByLabelText('New password'), 'a-long-password');
        await userEvent.click(screen.getByRole('button', { name: 'Save the password' }));

        expect(await screen.findByRole('heading', { name: 'This link no longer works' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Ask for a new link' })).toHaveAttribute('href', '/forgot-password');
    });

    it('saves the new password and says so', async () => {
        const onResetPassword = vi.fn(async () => undefined);
        view(<ResetPassword onResetPassword={onResetPassword} email="ada@example.com" signInLink="/" />);

        await userEvent.type(screen.getByLabelText('New password'), 'a-long-password');
        await userEvent.click(screen.getByRole('button', { name: 'Save the password' }));

        expect(await screen.findByRole('heading', { name: 'Password changed' })).toBeInTheDocument();
        expect(onResetPassword).toHaveBeenCalledWith('a-long-password');
    });
});

describe('VerifyEmail', () => {
    it('confirms the code of the link once, even in StrictMode', async () => {
        const onVerify = vi.fn(async () => undefined);
        view(<React.StrictMode><VerifyEmail code="abc" onVerify={onVerify} continueLink="/" /></React.StrictMode>);

        expect(await screen.findByRole('heading', { name: 'Email confirmed' })).toBeInTheDocument();
        expect(onVerify).toHaveBeenCalledOnce();
        expect(screen.getByRole('link', { name: 'Continue' })).toHaveAttribute('href', '/');
    });

    it('says the link expired when its code is refused', async () => {
        view(<VerifyEmail code="old" onVerify={async () => { throw new AuthFlowError('expiredLink'); }} onResend={async () => undefined} />);

        expect(await screen.findByRole('heading', { name: 'This link no longer works' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Send it again' })).toBeEnabled();
    });
});

describe('AuthGate', () => {
    const adapter = (initial: UserProfile | null) => {
        let user = initial;
        const listeners = new Set<(user: UserProfile | null) => void>();
        let release: () => void = () => undefined;
        const ready = new Promise<void>((resolve) => { release = resolve; });
        const value: AuthProviderAdapter = {
            getUser: () => user,
            signOut: vi.fn(async () => { user = null; listeners.forEach((l) => l(null)); }),
            onAuthChange: (callback) => { listeners.add(callback); return () => listeners.delete(callback); },
            whenReady: () => ready,
        };
        return {
            value,
            release,
            signIn: (next: UserProfile) => { user = next; listeners.forEach((l) => l(next)); },
        };
    };

    it('waits for the session, then shows the sign-in in place of the page, then the page', async () => {
        const auth = adapter(null);
        withAuth(auth.value, <AuthGate fallback={<p>sign-in here</p>}><p>the page</p></AuthGate>);

        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.queryByText('sign-in here')).not.toBeInTheDocument();
        await act(async () => auth.release());

        expect(screen.getByText('sign-in here')).toBeInTheDocument();
        expect(screen.queryByText('the page')).not.toBeInTheDocument();
        act(() => auth.signIn({ uid: 'u1', email: 'ada@example.com' }));
        expect(screen.getByText('the page')).toBeInTheDocument();
    });

    it('says "No access" to a user who is not allowed, and offers another account', async () => {
        const auth = adapter({ uid: 'u2', email: 'guest@example.com' });
        withAuth(auth.value, <AuthGate allow={async (user) => user.email === 'ada@example.com'}><p>the page</p></AuthGate>);
        await act(async () => auth.release());

        expect(await screen.findByRole('heading', { name: 'No access' })).toBeInTheDocument();
        expect(screen.getByText(/guest@example\.com/)).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: 'Sign in with another account' }));
        expect(auth.value.signOut).toHaveBeenCalledOnce();
    });
});

describe('App authGate', () => {
    const Page = ({ name }: { name: string }) => <p>{name} page</p>;

    it('shows the sign-in in place of a page without changing the address, and leaves a public route open', async () => {
        window.history.pushState({}, '', '/reports');
        render(
            <App
                importPage={async () => ({ default: () => null })}
                providers={{ mock: { auth: { latency: 0, storage: null } }, services: { data: 'mock', auth: 'mockAuth' } }}
                authGate
                menuConfig={{
                    main: [
                        { path: '/reports', title: 'Reports', page: () => <Page name="reports" /> },
                        { path: '/sign-up', public: true, page: () => <Page name="sign-up" /> },
                    ],
                }}
            />,
        );

        expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
        expect(window.location.pathname).toBe('/reports');

        await userEvent.type(screen.getByLabelText('Email'), 'ada@example.com');
        await userEvent.type(screen.getByLabelText('Password'), 'any-password');
        await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
        expect(await screen.findByText('reports page')).toBeInTheDocument();
        expect(window.location.pathname).toBe('/reports');
    });

    it('never covers a public route', async () => {
        window.history.pushState({}, '', '/sign-up');
        render(
            <App
                importPage={async () => ({ default: () => null })}
                providers={{ mock: { auth: { latency: 0, storage: null } }, services: { data: 'mock', auth: 'mockAuth' } }}
                authGate
                menuConfig={{ main: [{ path: '/sign-up', public: true, page: () => <Page name="sign-up" /> }] }}
            />,
        );

        expect(await screen.findByText('sign-up page')).toBeInTheDocument();
    });
});

describe('MockAuthProvider', () => {
    it('with accounts, refuses a wrong password and a wrong code as a real service would', async () => {
        const auth = new MockAuthProvider({ accounts: [{ email: 'ada@example.com', password: 'right-pass' }], latency: 0, storage: null });

        await expect(auth.signIn({ email: 'ada@example.com', password: 'nope' })).rejects.toMatchObject({ reason: 'credentials' });
        await expect(auth.verifyEmailCode('ada@example.com', '000000')).rejects.toMatchObject({ reason: 'invalidCode' });
        await expect(auth.signUp({ email: 'ADA@example.com', password: 'another-pass' })).rejects.toMatchObject({ reason: 'emailInUse' });

        const user = await auth.signIn({ email: 'ada@example.com', password: 'right-pass' });
        expect(user).toMatchObject({ email: 'ada@example.com' });
        expect(auth.isAuthenticated()).toBe(true);
    });
});

describe('useAuthFlows', () => {
    const Probe = ({ onFlows }: { onFlows: (flows: ReturnType<typeof useAuthFlows>) => void }) => {
        onFlows(useAuthFlows(undefined, { resetPasswordPath: '/reset-password' }));
        return null;
    };

    it('binds password, code and reset to an adapter that has them', async () => {
        const adapter = new MockAuthProvider({ latency: 0, storage: null });
        const reset = vi.spyOn(adapter, 'sendPasswordReset');
        let flows!: ReturnType<typeof useAuthFlows>;
        withAuth(adapter, <Probe onFlows={(value) => { flows = value; }} />);

        expect(flows.signIn.onPasswordSignIn).toBeTypeOf('function');
        expect(flows.signIn.onRequestCode).toBeTypeOf('function');
        await flows.forgotPassword!.onSendReset('ada@example.com');
        expect(reset).toHaveBeenCalledWith('ada@example.com', { redirectTo: '/reset-password' });
    });

    it('offers its own button for an adapter without passwords', () => {
        const adapter: AuthProviderAdapter = {
            getUser: () => null,
            signIn: vi.fn(async () => null),
            signOut: async () => undefined,
            onAuthChange: () => () => undefined,
        };
        let flows!: ReturnType<typeof useAuthFlows>;
        view(
            <AuthProvider registry={{ githubAuth: adapter }} defaultKey="githubAuth">
                <Probe onFlows={(value) => { flows = value; }} />
            </AuthProvider>,
        );

        expect(flows.signIn.onPasswordSignIn).toBeUndefined();
        expect(flows.signIn.providers).toEqual(['github']);
        expect(flows.signUp).toBeUndefined();
    });
});

describe('errors and links', () => {
    it('reads the reason of Firebase, Supabase and a refused connection', () => {
        expect(authErrorReason({ code: 'auth/too-many-requests' })).toBe('tooManyRequests');
        expect(authErrorReason({ code: 'otp_expired', status: 403 })).toBe('invalidCode');
        expect(authErrorReason({ status: 429 })).toBe('tooManyRequests');
        expect(authErrorReason(new TypeError('Failed to fetch'))).toBe('network');
        expect(authErrorReason(new Error('boom'))).toBe('generic');
    });

    it('finds the code of a link whatever the service calls it', () => {
        expect(linkCode('?mode=resetPassword&oobCode=fb')).toBe('fb');
        expect(linkCode('?token_hash=sb&type=recovery')).toBe('sb');
        expect(linkCode('?code=123456')).toBe('123456');
        expect(linkCode('')).toBeNull();
    });
});
