# VS Code Theme Sources

Put original VS Code theme JSON files in this folder.

Examples:

- `dark-plus-color-theme.json`
- `light-plus-color-theme.json`
- `dracula.json`

The compiler keeps these files as the canonical source and generates
framework themes in `../../../../themes/`.

Use `index.json` as the manifest of top-level themes to compile. Helper files
referenced via `include` can stay in this folder without being emitted as
standalone runtime themes.
