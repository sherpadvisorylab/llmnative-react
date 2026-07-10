import React from 'react';
import { AuthButton } from '@llmnative/react';
import { Link } from 'react-router-dom';
import PageLayout from '../../showcase/page';
import { Section } from '../../docs-kit/page';
import { useShowcaseGoogleAuthI18n, useShowcaseCommonI18n } from '../../showcase/i18n';

const AUTHBUTTON_CODE = `import { AuthButton } from '@llmnative/react';

<AuthButton
  provider="googleAuth"
  intent="signIn"
  aspect="button"
  options={{ label: 'Sign in with Google' }}
/>`;

export default function GoogleAuthPage() {
    const common = useShowcaseCommonI18n();
    const t = useShowcaseGoogleAuthI18n();
    return (
        <PageLayout title={t.page.title} description={t.page.description}>
            <Section
                title={t.sections.authButton.title}
                description={t.sections.authButton.description}
                preview={
                    <div className="flex flex-wrap gap-4 items-center">
                        <AuthButton
                            provider="googleAuth"
                            intent="signIn"
                            aspect="button"
                            options={{
                                label: 'Sign in with Google',
                                className: 'btn-primary',
                                disabled: true,
                            }}
                        />
                        <AuthButton
                            provider="googleAuth"
                            intent="signIn"
                            aspect="avatar"
                            iconLogout="log-out"
                        />
                    </div>
                }
                code={AUTHBUTTON_CODE}
            />
            <Section
                title={t.sections.configuration.title}
                description={t.sections.configuration.description}
                code={`<App
  providers={{
    google: {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: 'openid email profile',
    },
    services: { auth: 'googleAuth' },
  }}
/>`}
            />
            <div className="rounded-lg border bg-card p-5">
                <h2 className="font-semibold text-foreground">{t.sections.relatedPages.title}</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">{t.sections.relatedPages.description}</p>
                <div className="mt-3">
                    <Link to="/components/auth" className="btn btn-outline-primary">{common.sections.liveDemo}</Link>
                </div>
            </div>
        </PageLayout>
    );
}
