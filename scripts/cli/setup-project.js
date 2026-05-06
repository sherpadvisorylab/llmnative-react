const fs = require('fs');
const path = require('path');
const readline = require('readline');

const root = process.cwd();
const args = process.argv.slice(2);
const shouldReset = args.includes('--reset');

function getArg(name, fallback = '') {
    const prefix = `--${name}=`;
    const arg = args.find((item) => item.startsWith(prefix));
    return arg ? arg.slice(prefix.length) : fallback;
}

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    }
}

function ensureFile(filePath, content) {
    ensureDir(path.dirname(filePath));
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content.trimStart());
        console.log(`Created file: ${filePath}`);
    }
}

function resetProjectDirectory() {
    console.log('Resetting scaffold files...');
    [
        'src',
        'public',
        'dist',
        '.env',
        '.firebaserc',
        'database.rules.json',
        'firebase.json',
        'storage.rules',
        'index.html',
        'vite.config.ts',
        'tsconfig.json',
        'tsconfig.node.json',
        'postcss.config.js',
    ].forEach((entry) => {
        const entryPath = path.join(root, entry);
        if (fs.existsSync(entryPath)) {
            fs.rmSync(entryPath, { recursive: true, force: true });
            console.log(`Removed: ${entryPath}`);
        }
    });
}

async function askInteractive(callback) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const question = (text) => new Promise((resolve) => rl.question(text, resolve));
    const defaultName = path.basename(root);

    try {
        const projectnameInput = await question(`What is your project name? (default: ${defaultName}) `);
        const projectname = projectnameInput.trim() || defaultName;

        const providerInput = await question('Which data provider? (firebase, supabase, mock, custom; default: mock) ');
        const provider = ['firebase', 'supabase', 'mock', 'custom'].includes(providerInput.trim())
            ? providerInput.trim()
            : 'mock';

        const iconProviderInput = await question('Which icon provider? (lucide, phosphor; default: lucide) ');
        const iconProvider = ['lucide', 'phosphor'].includes(iconProviderInput.trim())
            ? iconProviderInput.trim()
            : 'lucide';

        const themeProviderInput = await question('Which theme preset? (default, flat, cyber; default: default) ');
        const themeProvider = ['default', 'flat', 'cyber'].includes(themeProviderInput.trim())
            ? themeProviderInput.trim()
            : 'default';

        let hosting = 'n';
        const firebase = {};
        const supabase = {};

        if (provider === 'firebase') {
            const hostingInput = await question(`Firebase Hosting site? Leave blank to use "${defaultName}", type 'n' to disable: `);
            hosting = hostingInput.trim();

            firebase.apikey = (await question('Firebase API key: ')).trim();
            firebase.authDomain = (await question('Firebase Auth Domain: ')).trim();
            firebase.dbUrl = (await question('Firebase Database URL: ')).trim();
            firebase.projId = (await question('Firebase Project ID: ')).trim();
            firebase.storageBucket = (await question('Firebase Storage Bucket: ')).trim();
            firebase.messSenderId = (await question('Firebase Messaging Sender ID: ')).trim();
            firebase.appId = (await question('Firebase App ID: ')).trim();
            firebase.measurementId = (await question('Firebase Measurement ID: ')).trim();
            firebase.googleClientId = (await question('Google Client ID: ')).trim();
        }

        if (provider === 'supabase') {
            supabase.url = (await question('Supabase URL: ')).trim();
            supabase.anonKey = (await question('Supabase anon key: ')).trim();
        }

        rl.close();
        callback({ projectname, provider, iconProvider, themeProvider, hosting, firebase, supabase });
    } catch (error) {
        rl.close();
        console.error('Error during interactive prompt:', error);
    }
}

function normalizeFirebaseProjectId(projectName) {
    return String(projectName ?? '')
        .trim()
        .replace(/^[A-Z]/, (m) => m.toLowerCase())
        .replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function createPackageJson(params) {
    const packagePath = path.resolve(__dirname, '../../package.json');
    const version = JSON.parse(fs.readFileSync(packagePath, 'utf8')).version;

    ensureFile(path.join(root, 'package.json'), JSON.stringify({
        name: normalizeFirebaseProjectId(params.projectname) || 'react-firestrap-app',
        version: '0.1.0',
        private: true,
        type: 'module',
        scripts: {
            dev: 'vite',
            build: 'vite build',
            preview: 'vite preview',
            typecheck: 'tsc --noEmit',
        },
        dependencies: {
            '@phosphor-icons/react': '^2.0.0',
            '@vitejs/plugin-react': '^4.3.4',
            firebase: '^10.14.0',
            'lucide-react': '^0.400.0',
            react: '^18.2.0',
            'react-dom': '^18.2.0',
            'react-firestrap': `^${version}`,
            'react-router-dom': '^6.22.0',
        },
        devDependencies: {
            '@tailwindcss/postcss': '^4.2.4',
            '@types/react': '^18.2.0',
            '@types/react-dom': '^18.2.0',
            autoprefixer: '^10.5.0',
            postcss: '^8.5.14',
            typescript: '^5.6.2',
            vite: '^5.4.21',
        },
    }, null, 2));
}

function createDevTools() {
    require('./setup-devtools').setupDevTools();
}

function createIndexHtml(params) {
    ensureFile(path.join(root, 'index.html'), `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${params.projectname}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
    `);
}

function createEnvFile(params) {
    const env = [
        `VITE_DATA_PROVIDER=${params.provider}`,
        `VITE_ICON_PROVIDER=${params.iconProvider}`,
        `VITE_THEME_PROVIDER=${params.themeProvider}`,
        `VITE_FIREBASE_APIKEY=${params.firebase.apikey ?? ''}`,
        `VITE_FIREBASE_AUTH_DOMAIN=${params.firebase.authDomain ?? ''}`,
        `VITE_FIREBASE_DATABASE_URL=${params.firebase.dbUrl ?? ''}`,
        `VITE_FIREBASE_PROJECT_ID=${params.firebase.projId ?? ''}`,
        `VITE_FIREBASE_STORAGE_BUCKET=${params.firebase.storageBucket ?? ''}`,
        `VITE_FIREBASE_MESSAGING_SENDER_ID=${params.firebase.messSenderId ?? ''}`,
        `VITE_FIREBASE_APP_ID=${params.firebase.appId ?? ''}`,
        `VITE_FIREBASE_MEASUREMENT_ID=${params.firebase.measurementId ?? ''}`,
        `VITE_GOOGLE_CLIENT_ID=${params.firebase.googleClientId ?? ''}`,
        'VITE_GOOGLE_SCOPE=',
        `VITE_SUPABASE_URL=${params.supabase.url ?? ''}`,
        `VITE_SUPABASE_ANON_KEY=${params.supabase.anonKey ?? ''}`,
    ].join('\n');

    ensureFile(path.join(root, '.env'), `${env}\n`);
}

function createFirebaseConfig(params) {
    if (params.provider !== 'firebase') return;

    ensureFile(path.join(root, '.firebaserc'), JSON.stringify({
        projects: { default: params.projectname },
    }, null, 2));

    const includeHosting = params.hosting.toLowerCase() !== 'n';
    const hostingSite = params.hosting === '' ? params.projectname : params.hosting;

    ensureFile(path.join(root, 'firebase.json'), JSON.stringify({
        database: { rules: 'database.rules.json' },
        ...(includeHosting && {
            hosting: {
                site: normalizeFirebaseProjectId(hostingSite),
                public: 'dist',
                ignore: ['firebase.json', '**/.*', '**/node_modules/**'],
                predeploy: ['npm run build'],
                rewrites: [{ source: '**', destination: '/index.html' }],
            },
        }),
    }, null, 2));

    ensureFile(path.join(root, 'database.rules.json'), JSON.stringify({
        rules: {
            '.read': 'auth != null',
            '.write': 'auth != null',
        },
    }, null, 2));

    ensureFile(path.join(root, 'storage.rules'), `
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
    `);
}

function createSourceFiles(params) {
    ensureFile(path.join(root, 'src/vite-env.d.ts'), `
/// <reference types="vite/client" />
    `);

    ensureFile(path.join(root, 'src/globals.css'), `
@import 'react-firestrap/dist/index.css';

html,
body,
#root {
  min-height: 100%;
}

body {
  margin: 0;
  background: hsl(var(--background));
  color: hsl(var(--foreground));
}
    `);

    ensureFile(path.join(root, 'src/pages/Home.tsx'), `
import React from 'react';

export default function Home() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Welcome to ${params.projectname}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This app was scaffolded with react-firestrap and Vite.
      </p>
    </section>
  );
}
    `);

    ensureFile(path.join(root, 'src/layout/AppLayout.tsx'), `
import React from 'react';

export default function AppLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-6">
          <span className="font-semibold">${params.projectname}</span>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
    `);

    ensureFile(path.join(root, 'src/conf/menu.ts'), `
import Home from '../pages/Home';

export const menu = {
  main: [
    { path: '/', title: 'Home', page: Home },
  ],
};
    `);

    ensureFile(path.join(root, 'src/index.tsx'), `
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  App,
  MockDataProvider,
  SupabaseDataProvider,
} from 'react-firestrap';
import './globals.css';

import AppLayout from './layout/AppLayout';
import { menu } from './conf/menu';

const env = import.meta.env;
const dataProviderId = env.VITE_DATA_PROVIDER ?? '${params.provider}';

const dataProvider =
  dataProviderId === 'mock'
    ? new MockDataProvider({})
    : dataProviderId === 'supabase'
      ? new SupabaseDataProvider({
          url: env.VITE_SUPABASE_URL ?? '',
          anonKey: env.VITE_SUPABASE_ANON_KEY ?? '',
        })
      : undefined;

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App
      importPage={(pageSource) => import(/* @vite-ignore */ pageSource)}
      LayoutDefault={AppLayout}
      menuConfig={menu}
      dataProvider={dataProvider}
      iconProvider={env.VITE_ICON_PROVIDER ?? '${params.iconProvider}'}
      themeProvider={env.VITE_THEME_PROVIDER ?? '${params.themeProvider}'}
      firebaseConfig={{
        apiKey: env.VITE_FIREBASE_APIKEY ?? '',
        authDomain: env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
        databaseURL: env.VITE_FIREBASE_DATABASE_URL ?? '',
        projectId: env.VITE_FIREBASE_PROJECT_ID ?? '',
        storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
        messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
        appId: env.VITE_FIREBASE_APP_ID ?? '',
        measurementId: env.VITE_FIREBASE_MEASUREMENT_ID ?? '',
      }}
      oAuth2={{
        clientId: env.VITE_GOOGLE_CLIENT_ID ?? '',
        scope: env.VITE_GOOGLE_SCOPE ?? '',
      }}
    />
  </React.StrictMode>
);
    `);
}

function scaffoldProject() {
    const nonInteractive = args.includes('--yes') || args.some((arg) => arg.startsWith('--provider='));
    if (nonInteractive) {
        const defaultName = path.basename(root);
        const params = {
            projectname: getArg('name', defaultName),
            provider: getArg('provider', 'mock'),
            iconProvider: getArg('icon-provider', 'lucide'),
            themeProvider: getArg('theme-provider', 'default'),
            hosting: getArg('hosting', 'n'),
            firebase: {
                apikey: getArg('firebase-api-key'),
                authDomain: getArg('firebase-auth-domain'),
                dbUrl: getArg('firebase-database-url'),
                projId: getArg('firebase-project-id'),
                storageBucket: getArg('firebase-storage-bucket'),
                messSenderId: getArg('firebase-messaging-sender-id'),
                appId: getArg('firebase-app-id'),
                measurementId: getArg('firebase-measurement-id'),
                googleClientId: getArg('google-client-id'),
            },
            supabase: {
                url: getArg('supabase-url'),
                anonKey: getArg('supabase-anon-key'),
            },
        };

        if (shouldReset) {
            resetProjectDirectory();
        }

        console.log(`\nCreating Vite project structure for: ${params.projectname}`);
        createPackageJson(params);
        createDevTools();
        createIndexHtml(params);
        createEnvFile(params);
        createFirebaseConfig(params);
        createSourceFiles(params);
        console.log(`\nProject "${params.projectname}" created with Vite, ${params.provider}, ${params.iconProvider}, and ${params.themeProvider}.\n`);
        return;
    }

    askInteractive((params) => {
        if (shouldReset) {
            resetProjectDirectory();
        }

        console.log(`\nCreating Vite project structure for: ${params.projectname}`);
        createPackageJson(params);
        createDevTools();
        createIndexHtml(params);
        createEnvFile(params);
        createFirebaseConfig(params);
        createSourceFiles(params);
        console.log(`\nProject "${params.projectname}" created with Vite, ${params.provider}, ${params.iconProvider}, and ${params.themeProvider}.\n`);
    });
}

module.exports = { scaffoldProject };
