// The pages the links of the access emails open: the provider puts them in the emails it sends.
export const ACCESS_PATHS = {
    signUp: '/sign-up',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    verifyEmail: '/verify-email',
};

export const ACCESS_FLOWS = {
    verifyEmailPath: ACCESS_PATHS.verifyEmail,
    resetPasswordPath: ACCESS_PATHS.resetPassword,
};
