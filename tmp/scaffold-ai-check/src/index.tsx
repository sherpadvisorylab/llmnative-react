import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@llmnative/react';
import './styles/globals.css';

import { aiConfig, appConfig, providers } from './conf/app';
import { menu } from './conf/menu';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App
      importPage={(pageSource) => import(/* @vite-ignore */ pageSource)}
      menuConfig={menu}
      providers={providers}
      aiConfig={aiConfig}
      iconProvider={appConfig.iconProvider}
      themeProvider={appConfig.theme}
    />
  </React.StrictMode>
);
    