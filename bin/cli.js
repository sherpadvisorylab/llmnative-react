#!/usr/bin/env node

const path = require('path');

const SCRIPT_PATH = '../scripts/cli';
const [,, cmd] = process.argv;
const args = process.argv.slice(3);

function printGeneralHelp() {
    console.log(`
LLM Native CLI

Available commands:

  create     - Generates a Vite + React project scaffold
  devtools   - Generates Vite, TypeScript, and PostCSS config only
  version    - Prints the installed @llmnative/react version
  help       - Displays this help message

Examples:
  npx @llmnative/react create
  npx @llmnative/react create --yes --provider=mock
  npx @llmnative/react create --yes --provider=mock --ai-provider=openai
  npx @llmnative/react create --help
  npx @llmnative/react devtools
  npx @llmnative/react version
    `);
}

function printCreateHelp() {
    console.log(`
LLM Native create

Usage:
  npx llmnative create
  npx llmnative create --yes --name=my-app --provider=mock

Interactive prompts:
  project name
  data provider: firebase | supabase | mock | custom
  ai provider: none | openai | gemini | anthropic | mistral
  icon provider: lucide | phosphor
  theme: default | flat | cyber
  provider credentials for Firebase, Supabase or the selected AI provider

Options:
  --yes
  --reset
  --name=<name>
  --provider=<firebase|supabase|mock|custom>
  --ai-provider=<none|openai|gemini|anthropic|mistral>
  --icon-provider=<lucide|phosphor>
  --theme=<default|flat|cyber>
  --hosting=<site|n>
  --firebase-api-key=<value>
  --firebase-auth-domain=<value>
  --firebase-database-url=<value>
  --firebase-project-id=<value>
  --firebase-storage-bucket=<value>
  --firebase-messaging-sender-id=<value>
  --firebase-app-id=<value>
  --firebase-measurement-id=<value>
  --google-client-id=<value>
  --supabase-url=<value>
  --supabase-anon-key=<value>
  --openai-api-key=<value>
  --gemini-api-key=<value>
  --anthropic-api-key=<value>
  --mistral-api-key=<value>

Generated env:
  VITE_PROVIDER
  VITE_AI_PROVIDER
  VITE_ICON_PROVIDER
  VITE_THEME
  VITE_FIREBASE_*
  VITE_GOOGLE_CLIENT_ID
  VITE_SUPABASE_URL
  VITE_SUPABASE_ANON_KEY
  VITE_OPENAI_API_KEY
  VITE_GEMINI_API_KEY
  VITE_ANTHROPIC_API_KEY
  VITE_MISTRAL_API_KEY
    `);
}

switch (cmd) {
    case 'create':
        if (args.includes('--help') || args.includes('-h')) {
            printCreateHelp();
        } else {
            require(`${SCRIPT_PATH}/setup-project`).scaffoldProject();
        }
        break;

    case 'devtools':
        require(`${SCRIPT_PATH}/setup-devtools`).setupDevTools();
        break;

    case 'version':
    case '--version':
    case '-v':
        const pkg = require(path.join(__dirname, '../package.json'));
        console.log(`@llmnative/react version: ${pkg.version}`);
        break;

    case 'help':
    default:
        printGeneralHelp();
        break;
}
