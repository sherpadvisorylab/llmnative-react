import { createConfigurationState, getMissingKeys, type ProviderConfigurationState } from '../../ProviderConfiguration';
import { authConfig } from '../../auth/google/auth';
import { googleGetAccessToken } from '../../auth/google/GoogleAuth';
import { GMAIL_SCOPES } from './gmailApi';
import { GmailEmailSender } from './GmailEmailSender';

/**
 * The `gmail` driver of the `google` provider (CR-130): sends as the user signed in with Google in the
 * browser, so it is configured when `google.oAuth2.clientId` is.
 */
export class BrowserGmailEmailSender extends GmailEmailSender {
    constructor() {
        super({ auth: { accessToken: () => googleGetAccessToken([GMAIL_SCOPES.send]) } });
    }

    override getConfigurationState(): ProviderConfigurationState {
        return createConfigurationState(
            'GmailEmailSender',
            getMissingKeys(authConfig('oAuth2') as Record<string, unknown> | undefined, ['clientId'], 'google.oAuth2.'),
        );
    }
}
