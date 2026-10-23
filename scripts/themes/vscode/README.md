# VS Code Theme Compiler

Build-time toolchain that compiles VS Code theme sources into runtime framework themes
(`npm run themes:compile:vscode`, also run by `npm run build`).

## Structure

- `sources/`: original VS Code theme JSON files, kept as close as possible to upstream
  (`include` chains are followed, e.g. Dark Modern → Dark+ → Dark (Visual Studio)).
- `sources/index.json`: the themes to emit. Each entry is a light/dark pair:
  `{ "id": "vscode-dark-modern", "mode": "dark", "light": "light_modern.json", "dark": "dark_modern.json" }`.
  `mode` is the mode the theme starts in; both modes are always compiled.
- `workbench-defaults.json`: VS Code's color registry defaults for the keys the compiler reads. A
  theme JSON only lists what it changes, VS Code fills the rest from these defaults; the compiler
  does the same, so no token falls back to the framework's own palette.
- `lib/`: compiler helpers. `mapVSCodeToSemantic.js` holds the VS Code key → framework token mapping.

## Output

Compiled themes are written to the runtime `themes/` folder as regular `ThemeDefinition` modules.
Do not edit them by hand. `tests/unit/themeContrast.test.ts` checks their contrast.
