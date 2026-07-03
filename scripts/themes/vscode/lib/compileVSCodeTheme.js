const { normalizeThemeName } = require("./normalizeThemeName");
const { mapVSCodeToSemantic } = require("./mapVSCodeToSemantic");
const { mapSemanticToFrameworkTheme } = require("./mapSemanticToFrameworkTheme");

function compileVSCodeTheme(source) {
    const parsed = source.parsed || {};
    const themeId = normalizeThemeName(source.fileName, parsed.name);
    const semanticTheme = mapVSCodeToSemantic(source);
    const frameworkTheme = mapSemanticToFrameworkTheme(semanticTheme);

    return {
        themeId,
        sourceName: parsed.name || themeId,
        sourceFileName: source.fileName,
        semanticTheme,
        frameworkTheme,
        outputFileName: themeId,
    };
}

module.exports = {
    compileVSCodeTheme,
};
