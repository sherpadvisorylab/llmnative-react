const { readVSCodeThemeSources } = require("./vscode/lib/readThemeSources");
const { compileVSCodeTheme } = require("./vscode/lib/compileVSCodeTheme");
const { emitFrameworkThemeFile } = require("./vscode/lib/emitFrameworkThemeFile");

function main() {
    const sources = readVSCodeThemeSources();

    if (sources.length === 0) {
        console.log("[themes] No VS Code theme sources found in scripts/themes/vscode/sources.");
        return;
    }

    const compiledThemes = sources.map((source) => compileVSCodeTheme(source));

    for (const compiledTheme of compiledThemes) {
        emitFrameworkThemeFile(compiledTheme);
        console.log(`[themes] Compiled ${compiledTheme.sourceFileName} -> themes/${compiledTheme.outputFileName}.ts`);
    }
}

main();
