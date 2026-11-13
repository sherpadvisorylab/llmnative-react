import React from 'react';
import { useLocation } from 'react-router-dom';
import { Brand, ResetPassword, linkCode, useAuthFlows } from '@llmnative/react';
import { ACCESS_FLOWS, ACCESS_PATHS } from './paths';

/** Opened by the link of the email: the code of the link sets the new password. */
export default function ResetPasswordPage() {
    const flows = useAuthFlows(undefined, ACCESS_FLOWS);
    const code = linkCode(useLocation().search);

    return (
        <ResetPassword
            {...flows.resetPassword(code)}
            brand={<Brand label="[projectname]" />}
            signInLink="/"
            requestNewLink={ACCESS_PATHS.forgotPassword}
        />
    );
}
