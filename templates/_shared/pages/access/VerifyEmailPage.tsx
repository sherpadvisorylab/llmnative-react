import React from 'react';
import { useLocation } from 'react-router-dom';
import { Brand, VerifyEmail, linkCode, useAuthFlows } from '@llmnative/react';
import { ACCESS_FLOWS } from './paths';

/** Opened by the confirmation link of a new account: it activates the account at once. */
export default function VerifyEmailPage() {
    const flows = useAuthFlows(undefined, ACCESS_FLOWS);
    const code = linkCode(useLocation().search);

    return (
        <VerifyEmail
            {...flows.verifyEmail}
            code={code}
            brand={<Brand label="[projectname]" />}
            continueLink="/"
            signInLink="/"
        />
    );
}
