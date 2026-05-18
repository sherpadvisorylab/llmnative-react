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

        const themeInput = await question('Which theme? (default, flat, cyber; default: default) ');
        const theme = ['default', 'flat', 'cyber'].includes(themeInput.trim())
            ? themeInput.trim()
            : 'default';

        const templateInput = await question('Which app template? (blank, crm, admin, inventory, project; default: blank) ');
        const template = ['blank', 'crm', 'admin', 'inventory', 'project'].includes(templateInput.trim())
            ? templateInput.trim()
            : 'blank';

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
        callback({ projectname, provider, iconProvider, theme, template, hosting, firebase, supabase });
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
        `VITE_PROVIDER=${params.provider}`,
        `VITE_ICON_PROVIDER=${params.iconProvider}`,
        `VITE_THEME=${params.theme}`,
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

function copyDir(src, dest) {
    if (!fs.existsSync(src)) return;
    fs.readdirSync(src, { withFileTypes: true }).forEach((entry) => {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            ensureDir(path.dirname(destPath));
            if (!fs.existsSync(destPath)) {
                fs.copyFileSync(srcPath, destPath);
                console.log(`Created file: ${destPath}`);
            }
        }
    });
}

function substituteProjectName(filePath, projectname) {
    const content = fs.readFileSync(filePath, 'utf8');
    const updated = content.replace(/\[projectname\]/g, projectname);
    if (updated !== content) fs.writeFileSync(filePath, updated);
}

function copyTemplateFiles(params) {
    const sharedSrc  = path.resolve(__dirname, '../../templates/_shared');
    const templateSrc = path.resolve(__dirname, `../../templates/${params.template}`);

    // Copy shared layouts and sections
    copyDir(path.join(sharedSrc, 'layouts'),  path.join(root, 'src/layouts'));
    copyDir(path.join(sharedSrc, 'sections'), path.join(root, 'src/sections'));

    // Copy template-specific files (pages, data, conf/menu.ts)
    // layouts and sections from template override shared ones if present
    copyDir(templateSrc, path.join(root, 'src'));

    // Substitute [projectname] in copied files
    ['src/layouts', 'src/sections', 'src/pages'].forEach((dir) => {
        const absDir = path.join(root, dir);
        if (!fs.existsSync(absDir)) return;
        walkFiles(absDir, (file) => substituteProjectName(file, params.projectname));
    });
}

function walkFiles(dir, fn) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walkFiles(full, fn);
        else fn(full);
    });
}

function createSourceFiles(params) {
    copyTemplateFiles(params);

    ensureFile(path.join(root, 'src/vite-env.d.ts'), `
/// <reference types="vite/client" />
    `);

    ensureFile(path.join(root, 'src/styles/globals.css'), `
@import "tailwindcss";
@import "react-firestrap/dist/index.css";

@theme inline {
    --color-background:             hsl(var(--rf-background));
    --color-foreground:             hsl(var(--rf-foreground));
    --color-card:                   hsl(var(--rf-card));
    --color-card-foreground:        hsl(var(--rf-card-foreground));
    --color-popover:                hsl(var(--rf-popover));
    --color-popover-foreground:     hsl(var(--rf-popover-foreground));
    --color-primary:                hsl(var(--rf-primary));
    --color-primary-foreground:     hsl(var(--rf-primary-foreground));
    --color-secondary:              hsl(var(--rf-secondary));
    --color-secondary-foreground:   hsl(var(--rf-secondary-foreground));
    --color-muted:                  hsl(var(--rf-muted));
    --color-muted-foreground:       hsl(var(--rf-muted-foreground));
    --color-accent:                 hsl(var(--rf-accent));
    --color-accent-foreground:      hsl(var(--rf-accent-foreground));
    --color-destructive:            hsl(var(--rf-destructive));
    --color-destructive-foreground: hsl(var(--rf-destructive-foreground));
    --color-success:                hsl(var(--rf-success));
    --color-success-foreground:     hsl(var(--rf-success-foreground));
    --color-warning:                hsl(var(--rf-warning));
    --color-warning-foreground:     hsl(var(--rf-warning-foreground));
    --color-info:                   hsl(var(--rf-info));
    --color-info-foreground:        hsl(var(--rf-info-foreground));
    --color-border:                 hsl(var(--rf-border));
    --color-input:                  hsl(var(--rf-input));
    --color-ring:                   hsl(var(--rf-ring));
    --radius: 0.5rem;
}

html, body, #root {
  min-height: 100%;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  background-color: hsl(var(--rf-background));
  color: hsl(var(--rf-foreground));
}
    `);

    ensureFile(path.join(root, 'src/conf/app.ts'), `
const env = import.meta.env;

export const appConfig = {
  provider:     env.VITE_PROVIDER     ?? '${params.provider}',
  iconProvider: env.VITE_ICON_PROVIDER ?? '${params.iconProvider}',
  theme:        env.VITE_THEME        ?? '${params.theme}',
};
    `);

    ensureFile(path.join(root, 'src/index.tsx'), `
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from 'react-firestrap';
import './styles/globals.css';

import { appConfig } from './conf/app';
import { menu } from './conf/menu';
import { mockData } from './data/mockData';

const env = import.meta.env;
const selectedProvider = appConfig.provider;
const dataDriver =
  selectedProvider === 'firebase' ? 'dbRealtime'
    : selectedProvider === 'supabase' ? 'supabaseDb'
      : 'mock';
const storageDriver =
  selectedProvider === 'firebase' ? 'firestorage'
    : selectedProvider === 'supabase' ? 'supabaseStorage'
      : undefined;

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App
      importPage={(pageSource) => import(/* @vite-ignore */ pageSource)}
      menuConfig={menu}
      providers={{
        mock: {
          data: mockData,
        },
        firebase: {
          apiKey:            env.VITE_FIREBASE_APIKEY ?? '',
          authDomain:        env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
          databaseURL:       env.VITE_FIREBASE_DATABASE_URL ?? '',
          projectId:         env.VITE_FIREBASE_PROJECT_ID ?? '',
          storageBucket:     env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
          messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
          appId:             env.VITE_FIREBASE_APP_ID ?? '',
          measurementId:     env.VITE_FIREBASE_MEASUREMENT_ID ?? '',
        },
        supabase: {
          url:     env.VITE_SUPABASE_URL ?? '',
          anonKey: env.VITE_SUPABASE_ANON_KEY ?? '',
        },
        google: {
          clientId: env.VITE_GOOGLE_CLIENT_ID ?? '',
          scope:    env.VITE_GOOGLE_SCOPE ?? '',
        },
        services: {
          data:    dataDriver,
          storage: storageDriver,
          auth:    'googleAuth',
        },
      }}
      iconProvider={appConfig.iconProvider}
      themeProvider={appConfig.theme}
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
            projectname:  getArg('name', defaultName),
            provider:     getArg('provider', 'mock'),
            iconProvider: getArg('icon-provider', 'lucide'),
            theme:        getArg('theme', getArg('theme-provider', 'default')),
            template:     getArg('template', 'blank'),
            hosting:      getArg('hosting', 'n'),
            firebase: {
                apikey:        getArg('firebase-api-key'),
                authDomain:    getArg('firebase-auth-domain'),
                dbUrl:         getArg('firebase-database-url'),
                projId:        getArg('firebase-project-id'),
                storageBucket: getArg('firebase-storage-bucket'),
                messSenderId:  getArg('firebase-messaging-sender-id'),
                appId:         getArg('firebase-app-id'),
                measurementId: getArg('firebase-measurement-id'),
                googleClientId:getArg('google-client-id'),
            },
            supabase: {
                url:     getArg('supabase-url'),
                anonKey: getArg('supabase-anon-key'),
            },
        };

        if (shouldReset) resetProjectDirectory();

        console.log(`\nCreating project: ${params.projectname} | theme: ${params.theme} | template: ${params.template}\n`);
        createPackageJson(params);
        createDevTools();
        createIndexHtml(params);
        createEnvFile(params);
        createFirebaseConfig(params);
        createSourceFiles(params);
        console.log(`\nDone. Run: npm install && npm run dev\n`);
        return;
    }

    askInteractive((params) => {
        if (shouldReset) resetProjectDirectory();

        console.log(`\nCreating project: ${params.projectname} | theme: ${params.theme} | template: ${params.template}\n`);
        createPackageJson(params);
        createDevTools();
        createIndexHtml(params);
        createEnvFile(params);
        createFirebaseConfig(params);
        createSourceFiles(params);
        console.log(`\nDone. Run: npm install && npm run dev\n`);
    });
}

module.exports = { scaffoldProject };
