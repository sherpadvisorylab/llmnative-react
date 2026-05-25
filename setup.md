# LLM Native - Local Development And CLI Guide

This guide helps you:

- work on `@llmnative/react` locally
- link it into another project with `npm link`
- verify the current CLI commands
- reset the environment when local linking gets messy

## 1. Clean The Local Package

```bash
cd llmnative-react
npm unlink @llmnative/react --no-save
rm -rf node_modules package-lock.json
```

## 2. Reinstall Dependencies

```bash
npm install --no-package-lock
```

## 3. Build The Library

```bash
npm run build
```

Expected outputs:

- `dist/index.js`
- `dist/index.mjs`
- `dist/index.css`
- `dist/types`

## 4. Link The Package Globally

```bash
npm link
```

## 5. Link It From A Consumer Project

```bash
cd ../d2uno.app
npm unlink @llmnative/react --no-save
npm link @llmnative/react
```

At this point `@llmnative/react` is available in the consumer project's `node_modules` as a symlink.

## 6. Verify The CLI

```bash
npx @llmnative/react help
npx @llmnative/react create --help
```

Current top-level commands are `create`, `devtools`, `version`, and `help`.

## 7. CLI Structure

```text
llmnative-react/
  bin/
    cli.js
  scripts/
    cli/
      setup-project.js
      setup-devtools.js
  src/
  dist/
  package.json
```

Current `package.json` CLI binding:

```json
"bin": {
  "llmnative": "./bin/cli.js"
}
```

## 8. Unlink / Reset

From the consumer project:

```bash
npm unlink @llmnative/react --no-save
```

From the local framework repo:

```bash
npm unlink
```

## 9. Published Usage

Once published, the scaffold command is:

```bash
npx @llmnative/react create
```
