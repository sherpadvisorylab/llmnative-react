import {decodeJWT} from "../../../libs/utils";
import {GoogleAuthProvider} from "firebase/auth";
import {Config, getConfig, GoogleConfig, onConfigChange} from "../../../Config";

let config: GoogleConfig | undefined = getConfig?.()?.google;
if (typeof onConfigChange === 'function') {
    onConfigChange((newConfig: Config) => {
        config = newConfig.google;
    });
}

export const authConfig = <K extends keyof GoogleConfig>(
    key: K
): GoogleConfig[K] | undefined => {
    return config?.[key];
};

export const getGoogleCredential = () => {
    const googleCredentialToken = localStorage.getItem("googleCredentialToken");
    if (!googleCredentialToken) {
        console.error("Google credential token not found");
        return null;
    }
    const decodedToken = decodeJWT(googleCredentialToken) as { exp?: number } | null;
    if ((decodedToken?.exp ?? 0) < Date.now() / 1000) {
        console.error("Google credential token expired");
        return null;
    }

    try {
        return GoogleAuthProvider.credential(googleCredentialToken);
    } catch (error) {
        console.error(error);
    }

    return null;
}
