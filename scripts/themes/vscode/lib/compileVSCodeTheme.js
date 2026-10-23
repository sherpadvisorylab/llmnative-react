const { mapVSCodeToSemantic } = require("./mapVSCodeToSemantic");
const { mapSemanticToFrameworkTheme } = require("./mapSemanticToFrameworkTheme");

function compileVSCodeTheme(pair) {
    const light = mapVSCodeToSemantic(pair.light, "light");
    const dark = mapVSCodeToSemantic(pair.dark, "dark");
    const frameworkTheme = mapSemanticToFrameworkTheme({ mode: pair.mode, light, dark });

    return {
        themeId: pair.id,
        sourceFileName: `${pair.light.fileName} + ${pair.dark.fileName}`,
        sourceNames: { light: pair.light.parsed?.name, dark: pair.dark.parsed?.name },
        frameworkTheme,
        outputFileName: pair.id,
    };
}

module.exports = {
    compileVSCodeTheme,
};
