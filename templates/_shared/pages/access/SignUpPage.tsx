import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Brand, SignUp, useAuthFlows } from '@llmnative/react';
import { ACCESS_FLOWS } from './paths';

/** Creates an account; the confirmation link of the email opens `/verify-email`. */
export default function SignUpPage() {
    const flows = useAuthFlows(undefined, ACCESS_FLOWS);
    const navigate = useNavigate();

    // A provider without accounts of its own (Google, GitHub): its sign-in creates them.
    if (!flows.signUp) return <Navigate to="/" replace />;

    return (
        <SignUp
            {...flows.signUp}
            terms
            brand={<Brand label="[projectname]" />}
            signInLink="/"
            onSignedUp={() => navigate('/')}
        />
    );
}
