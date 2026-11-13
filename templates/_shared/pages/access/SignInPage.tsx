import React from 'react';
import { Brand, SignIn, useAuthFlows } from '@llmnative/react';
import { ACCESS_FLOWS, ACCESS_PATHS } from './paths';

/**
 * The sign-in, shown by the gate of `index.tsx` in place of any page opened without a session:
 * the address does not change, and once signed in the page appears.
 */
export default function SignInPage() {
    const flows = useAuthFlows(undefined, ACCESS_FLOWS);

    return (
        <SignIn
            {...flows.signIn}
            appName="[projectname]"
            brand={<Brand label="[projectname]" />}
            signUpLink={flows.signUp ? ACCESS_PATHS.signUp : undefined}
            forgotPasswordLink={flows.forgotPassword ? ACCESS_PATHS.forgotPassword : undefined}
        />
    );
}
