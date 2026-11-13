import React from 'react';
import { Navigate } from 'react-router-dom';
import { Brand, ForgotPassword, useAuthFlows } from '@llmnative/react';
import { ACCESS_FLOWS } from './paths';

/** Sends the link to choose a new password; the link opens `/reset-password`. */
export default function ForgotPasswordPage() {
    const flows = useAuthFlows(undefined, ACCESS_FLOWS);

    if (!flows.forgotPassword) return <Navigate to="/" replace />;

    return <ForgotPassword {...flows.forgotPassword} brand={<Brand label="[projectname]" />} signInLink="/" />;
}
