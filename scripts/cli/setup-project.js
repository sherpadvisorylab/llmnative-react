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
        '.env.example',
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

        const aiProviderInput = await question('Which AI provider? (none, openai, openrouter, opencode, gemini, anthropic, deepseek, mistral; default: none) ');
        const aiProvider = ['none', 'openai', 'openrouter', 'opencode', 'gemini', 'anthropic', 'deepseek', 'mistral'].includes(aiProviderInput.trim())
            ? aiProviderInput.trim()
            : 'none';

        const proxyProviderInput = await question('Which proxy provider? (none, vite, express, nextjs-app, nextjs-pages, cloudflare; default: none) ');
        const proxyProvider = ['none', 'vite', 'express', 'nextjs-app', 'nextjs-pages', 'cloudflare'].includes(proxyProviderInput.trim())
            ? proxyProviderInput.trim()
            : 'none';

        const iconProviderInput = await question('Which icon provider? (lucide, phosphor; default: lucide) ');
        const iconProvider = ['lucide', 'phosphor'].includes(iconProviderInput.trim())
            ? iconProviderInput.trim()
            : 'lucide';

        const themeInput = await question('Which theme? (default, flat, cyber; default: default) ');
        const theme = ['default', 'flat', 'cyber'].includes(themeInput.trim())
            ? themeInput.trim()
            : 'default';

        const localeInput = await question('Default locale? (en, it, fr, de, es; default: en) ');
        const locale = localeInput.trim() || 'en';

        const templateInput = await question('Which app template? (blank, crm, admin, inventory, project; default: blank) ');
        const template = ['blank', 'crm', 'admin', 'inventory', 'project'].includes(templateInput.trim())
            ? templateInput.trim()
            : 'blank';

        let hosting = 'n';
        const firebase = {};
        const supabase = {};
        const ai = {};

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

        if (aiProvider === 'openai') {
            ai.openaiApiKey = (await question('OpenAI API key: ')).trim();
        }
        if (aiProvider === 'openrouter') {
            ai.openRouterApiKey = (await question('OpenRouter API key: ')).trim();
        }
        if (aiProvider === 'opencode') {
            ai.openCodeApiKey = (await question('OpenCode API key: ')).trim();
        }
        if (aiProvider === 'gemini') {
            ai.geminiApiKey = (await question('Gemini API key: ')).trim();
        }
        if (aiProvider === 'anthropic') {
            ai.anthropicApiKey = (await question('Anthropic API key: ')).trim();
        }
        if (aiProvider === 'deepseek') {
            ai.deepSeekApiKey = (await question('DeepSeek API key: ')).trim();
        }
        if (aiProvider === 'mistral') {
            ai.mistralApiKey = (await question('Mistral API key: ')).trim();
        }

        rl.close();
        callback({ projectname, provider, aiProvider, proxyProvider, iconProvider, theme, locale, template, hosting, firebase, supabase, ai });
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
        name: normalizeFirebaseProjectId(params.projectname) || 'llmnative-app',
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
            '@llmnative/react': `^${version}`,
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
    const proxyEnabled = params.proxyProvider && params.proxyProvider !== 'none' ? 'true' : 'false';
    const env = [
        '# --- Core ---',
        `VITE_PROVIDER=${params.provider}`,
        `VITE_AI_PROVIDER=${params.aiProvider ?? 'none'}`,
        `VITE_ICON_PROVIDER=${params.iconProvider}`,
        `VITE_THEME=${params.theme}`,
        `VITE_LOCALE=${params.locale ?? 'en'}`,
        '',
        '# --- Proxy (required for AI calls from the browser) ---',
        `VITE_PROXY_PROVIDER=${params.proxyProvider ?? 'none'}`,
        `VITE_PROXY_ENABLED=${proxyEnabled}`,
        '',
        '# --- Firebase ---',
        `VITE_FIREBASE_APIKEY=${params.firebase.apikey ?? ''}`,
        `VITE_FIREBASE_AUTH_DOMAIN=${params.firebase.authDomain ?? ''}`,
        `VITE_FIREBASE_DATABASE_URL=${params.firebase.dbUrl ?? ''}`,
        `VITE_FIREBASE_PROJECT_ID=${params.firebase.projId ?? ''}`,
        `VITE_FIREBASE_STORAGE_BUCKET=${params.firebase.storageBucket ?? ''}`,
        `VITE_FIREBASE_MESSAGING_SENDER_ID=${params.firebase.messSenderId ?? ''}`,
        `VITE_FIREBASE_APP_ID=${params.firebase.appId ?? ''}`,
        `VITE_FIREBASE_MEASUREMENT_ID=${params.firebase.measurementId ?? ''}`,
        '',
        '# --- Google OAuth ---',
        `VITE_GOOGLE_CLIENT_ID=${params.firebase.googleClientId ?? ''}`,
        'VITE_GOOGLE_SCOPE=',
        '',
        '# --- Supabase ---',
        `VITE_SUPABASE_URL=${params.supabase.url ?? ''}`,
        `VITE_SUPABASE_ANON_KEY=${params.supabase.anonKey ?? ''}`,
        '',
        '# --- Dropbox ---',
        'VITE_DROPBOX_CLIENT_ID=',
        'VITE_DROPBOX_ROOT_PATH=',
        '',
        '# --- AI providers ---',
        `VITE_OPENAI_API_KEY=${params.ai.openaiApiKey ?? ''}`,
        `VITE_OPENROUTER_API_KEY=${params.ai.openRouterApiKey ?? ''}`,
        `VITE_OPENCODE_API_KEY=${params.ai.openCodeApiKey ?? ''}`,
        `VITE_GEMINI_API_KEY=${params.ai.geminiApiKey ?? ''}`,
        `VITE_ANTHROPIC_API_KEY=${params.ai.anthropicApiKey ?? ''}`,
        `VITE_DEEPSEEK_API_KEY=${params.ai.deepSeekApiKey ?? ''}`,
        `VITE_MISTRAL_API_KEY=${params.ai.mistralApiKey ?? ''}`,
        '',
        '# --- OpenAI-compatible (leave BASE_URL empty to disable) ---',
        'VITE_OPENAI_COMPATIBLE_BASE_URL=',
        'VITE_OPENAI_COMPATIBLE_API_KEY=',
    ].join('\n');

    ensureFile(path.join(root, '.env'), `${env}\n`);

    const example = env
        .split('\n')
        .map(line => (line && !line.startsWith('#') && line.includes('=') ? line.split('=')[0] + '=' : line))
        .join('\n');
    ensureFile(path.join(root, '.env.example'), `${example}\n`);
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
@import "@llmnative/react/dist/index.css";

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
import type { AIConfig, AppProvidersConfig } from '@llmnative/react';
import { mockData } from '../data/mockData';

const env = import.meta.env;
const selectedProvider = env.VITE_PROVIDER ?? '${params.provider}';
const selectedAIProvider = env.VITE_AI_PROVIDER ?? '${params.aiProvider ?? 'none'}';

const dataDriver =
  selectedProvider === 'firebase' ? 'dbRealtime'
    : selectedProvider === 'supabase' ? 'supabaseDb'
      : 'mock';

const storageDriver =
  selectedProvider === 'firebase' ? 'firestorage'
    : selectedProvider === 'supabase' ? 'supabaseStorage'
      : undefined;

const aiDriver = selectedAIProvider !== 'none'
  ? selectedAIProvider
  : undefined;

export const appConfig = {
  provider:     selectedProvider,
  aiProvider:   selectedAIProvider,
  iconProvider: env.VITE_ICON_PROVIDER ?? '${params.iconProvider}',
  theme:        env.VITE_THEME        ?? '${params.theme}',
  locale:       env.VITE_LOCALE       ?? '${params.locale}',
};

export const aiConfig: AIConfig = {
  openaiApiKey:    env.VITE_OPENAI_API_KEY ?? '',
  openRouterApiKey: env.VITE_OPENROUTER_API_KEY ?? '',
  openCodeApiKey:  env.VITE_OPENCODE_API_KEY ?? '',
  geminiApiKey:    env.VITE_GEMINI_API_KEY ?? '',
  anthropicApiKey: env.VITE_ANTHROPIC_API_KEY ?? '',
  deepSeekApiKey:  env.VITE_DEEPSEEK_API_KEY ?? '',
  mistralApiKey:   env.VITE_MISTRAL_API_KEY ?? '',
  ...(env.VITE_OPENAI_COMPATIBLE_BASE_URL ? {
    openAICompatible: {
      apiKey:  env.VITE_OPENAI_COMPATIBLE_API_KEY ?? '',
      baseUrl: env.VITE_OPENAI_COMPATIBLE_BASE_URL,
    },
  } : {}),
};

export const providers: AppProvidersConfig = {
  proxy: {
    enabled: env.VITE_PROXY_ENABLED === 'true',
  },
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
  dropbox: {
    clientId: env.VITE_DROPBOX_CLIENT_ID ?? '',
    rootPath: env.VITE_DROPBOX_ROOT_PATH ?? '',
  },
  services: {
    data: dataDriver,
    ...(storageDriver ? { storage: storageDriver } : {}),
    auth: 'googleAuth',
    ...(aiDriver ? { ai: aiDriver } : {}),
  },
};
    `);

    ensureFile(path.join(root, 'src/index.tsx'), `
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@llmnative/react';
import './styles/globals.css';

import { aiConfig, appConfig, providers } from './conf/app';
import { menu } from './conf/menu';

const env = import.meta.env;

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App
      importPage={(pageSource) => import(/* @vite-ignore */ pageSource)}
      menuConfig={menu}
      providers={providers}
      aiConfig={aiConfig}
      iconProvider={appConfig.iconProvider}
      themeProvider={{
        theme: appConfig.theme,
        // themeOverride: {
        //   Modal: { size: 'xl' },
        //   ActionButton: { className: 'btn-primary font-semibold' },
        // },
      }}
      i18n={{
        locale: appConfig.locale,
        // translations: {
        //   it: { common: { save: 'Salva', cancel: 'Annulla' }, form: { buttonSave: 'Salva' } },
        // },
      }}
    />
  </React.StrictMode>
);
    `);
}

function scaffoldProject() {
    const nonInteractive = args.includes('--yes')
        || args.some((arg) => arg.startsWith('--provider='))
        || args.some((arg) => arg.startsWith('--ai-provider='));
    if (nonInteractive) {
        const defaultName = path.basename(root);
        const params = {
            projectname:  getArg('name', defaultName),
            provider:     getArg('provider', 'mock'),
            aiProvider:   getArg('ai-provider', 'none'),
            proxyProvider: getArg('proxy-provider', 'none'),
            iconProvider: getArg('icon-provider', 'lucide'),
            theme:        getArg('theme', getArg('theme-provider', 'default')),
            locale:       getArg('locale', 'en'),
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
            ai: {
                openaiApiKey:    getArg('openai-api-key'),
                openRouterApiKey: getArg('openrouter-api-key'),
                openCodeApiKey:  getArg('opencode-api-key'),
                geminiApiKey:    getArg('gemini-api-key'),
                anthropicApiKey: getArg('anthropic-api-key'),
                deepSeekApiKey:  getArg('deepseek-api-key'),
                mistralApiKey:   getArg('mistral-api-key'),
            },
        };

        if (shouldReset) resetProjectDirectory();

        console.log(`\nCreating project: ${params.projectname} | theme: ${params.theme} | template: ${params.template}\n`);
        createPackageJson(params);
        require('./setup-devtools').setupDevTools({ proxyProvider: params.proxyProvider });
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
        require('./setup-devtools').setupDevTools({ proxyProvider: params.proxyProvider });
        createIndexHtml(params);
        createEnvFile(params);
        createFirebaseConfig(params);
        createSourceFiles(params);
        console.log(`\nDone. Run: npm install && npm run dev\n`);
    });
}

module.exports = { scaffoldProject };
