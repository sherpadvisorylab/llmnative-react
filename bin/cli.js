#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const SCRIPT_PATH = '../scripts/cli';
const [,, cmd] = process.argv;

switch (cmd) {
    case 'create':
        require(`${SCRIPT_PATH}/setup-project`).scaffoldProject();
        break;

    case 'devtools':
        require(`${SCRIPT_PATH}/setup-devtools`).setupDevTools();
        break;

    case 'version':
    case '--version':
    case '-v':
        const pkg = require(path.join(__dirname, '../package.json'));
        console.log(`🧩 react-firestrap version: ${pkg.version}`);
        break;

    case 'help':
    default:
        console.log(`
✨ React FireStrap CLI ✨

Available commands:

  create     - Generates the full project structure (src/, public/, .env, etc.)
  devtools   - Generates Vite, TypeScript, and PostCSS config only
  version    - Prints the installed react-firestrap version
  help       - Displays this help message

Examples:
  npx react-firestrap create
  npx react-firestrap create --yes --provider=mock
  npx react-firestrap devtools
  npx react-firestrap version
    `);
        break;
}
