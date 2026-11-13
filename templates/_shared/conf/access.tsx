import React from 'react';
import type { MenuConfig } from '@llmnative/react';
import SignUpPage from '../pages/access/SignUpPage';
import ForgotPasswordPage from '../pages/access/ForgotPasswordPage';
import ResetPasswordPage from '../pages/access/ResetPasswordPage';
import VerifyEmailPage from '../pages/access/VerifyEmailPage';
import { ACCESS_PATHS } from '../pages/access/paths';

/** The pages of access take the whole screen: no header, no menu. */
const Bare = ({ children }: { children?: React.ReactNode }) => <>{children}</>;

/**
 * The pages open without a session (`public`): the sign-in itself has no page, the gate of
 * `index.tsx` shows it in place of any other page. No title: they are never entries of a menu.
 */
export const accessMenu: MenuConfig = {
    access: [
        { path: ACCESS_PATHS.signUp, page: SignUpPage, layout: Bare, public: true },
        { path: ACCESS_PATHS.forgotPassword, page: ForgotPasswordPage, layout: Bare, public: true },
        { path: ACCESS_PATHS.resetPassword, page: ResetPasswordPage, layout: Bare, public: true },
        { path: ACCESS_PATHS.verifyEmail, page: VerifyEmailPage, layout: Bare, public: true },
    ],
};
