# VS Code Theme Compiler

This folder contains the build-time toolchain that compiles VS Code-compatible
theme sources into runtime framework themes.

## Structure

- `sources/`: original VS Code theme JSON files. Keep them as close as possible
  to the upstream source format.
- `lib/`: compiler helpers used by `scripts/themes/compile-vscode-themes.js`.

## Output

Compiled themes are written to the runtime `themes/` folder as regular
`ThemeDefinition` modules that the framework can import directly.
