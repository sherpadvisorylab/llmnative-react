const fs = require("fs");
const path = require("path");
const { THEMES_DIR } = require("./paths");

function toTsObject(value) {
    return JSON.stringify(value, null, 4)
        .replace(/"([^"]+)":/g, "$1:")
        .replace(/"/g, "'");
}

function emitFrameworkThemeFile(compiledTheme) {
    const outputPath = path.join(THEMES_DIR, `${compiledTheme.outputFileName}.ts`);
    const { mode, colors, dark } = compiledTheme.frameworkTheme;

    const fileContent = `import baseTheme from './default';
import type { ThemeDefinition } from '../src/Theme';

const definition: ThemeDefinition = {
    ...baseTheme,
    preset: {
        ...baseTheme.preset,
        mode: '${mode}',
        colors: {
            ...baseTheme.preset.colors,
            ...${toTsObject(colors)},
        },
        dark: {
            ...baseTheme.preset.dark,
            ...${toTsObject(dark)},
        },
    },
};

export default definition;
`;

    fs.writeFileSync(outputPath, fileContent, "utf8");
}

module.exports = {
    emitFrameworkThemeFile,
};
