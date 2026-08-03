import React, { createContext, useContext } from 'react';
import type { GoogleMapsConfig } from './loadGoogleMaps';

const GoogleMapsConfigContext = createContext<GoogleMapsConfig | undefined>(undefined);

export function GoogleMapsProvider({ config, children }: { config?: GoogleMapsConfig; children: React.ReactNode }) {
    return <GoogleMapsConfigContext.Provider value={config}>{children}</GoogleMapsConfigContext.Provider>;
}

/** `undefined` when `<App>`/`<GoogleMapsProvider>` was not given a `googleMaps` config. */
export function useGoogleMapsConfig(): GoogleMapsConfig | undefined {
    return useContext(GoogleMapsConfigContext);
}
