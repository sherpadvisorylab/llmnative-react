const fs = require("fs");
const path = require("path");
const ts = require("@typescript/typescript6");
const { SOURCES_DIR } = require("./paths");
const SOURCE_MANIFEST_FILE = "index.json";

function isThemeJsonFile(fileName) {
    return fileName.toLowerCase().endsWith(".json");
}

function parseThemeSource(raw, absolutePath) {
    try {
        return JSON.parse(raw);
    } catch {
        const parsed = ts.parseConfigFileTextToJson(absolutePath, raw);

        if (parsed.error || !parsed.config) {
            const errorMessage = parsed.error?.messageText || "Unknown JSONC parse error.";
            throw new Error(`Unable to parse theme source ${absolutePath}: ${errorMessage}`);
        }

        return parsed.config;
    }
}

function mergeThemeSource(baseTheme, extensionTheme) {
    return {
        ...baseTheme,
        ...extensionTheme,
        colors: {
            ...(baseTheme.colors || {}),
            ...(extensionTheme.colors || {}),
        },
        tokenColors: [
            ...(baseTheme.tokenColors || []),
            ...(extensionTheme.tokenColors || []),
        ],
        semanticTokenColors: {
            ...(baseTheme.semanticTokenColors || {}),
            ...(extensionTheme.semanticTokenColors || {}),
        },
    };
}

function loadThemeSource(absolutePath, seen = new Set()) {
    const normalizedPath = path.normalize(absolutePath);

    if (seen.has(normalizedPath)) {
        throw new Error(`Circular theme include detected for ${absolutePath}`);
    }

    const nextSeen = new Set(seen);
    nextSeen.add(normalizedPath);

    const raw = fs.readFileSync(absolutePath, "utf8");
    const parsed = parseThemeSource(raw, absolutePath);

    if (!parsed.include) {
        return {
            raw,
            parsed,
        };
    }

    const includePath = path.resolve(path.dirname(absolutePath), parsed.include);
    const includedTheme = loadThemeSource(includePath, nextSeen);
    const extensionTheme = { ...parsed };
    delete extensionTheme.include;

    return {
        raw,
        parsed: mergeThemeSource(includedTheme.parsed, extensionTheme),
    };
}

function readSource(fileName) {
    if (!isThemeJsonFile(fileName)) throw new Error(`Theme source "${fileName}" is not a .json file.`);
    const absolutePath = path.join(SOURCES_DIR, fileName);
    const { raw, parsed } = loadThemeSource(absolutePath);
    return { absolutePath, fileName, raw, parsed };
}

/**
 * Reads the theme pairs listed in `index.json`: each entry is `{ id, mode, light, dark }`, where
 * `light` and `dark` are the VS Code sources of the two modes and `mode` the one the theme starts in.
 */
function readVSCodeThemeSources() {
    const manifestPath = path.join(SOURCES_DIR, SOURCE_MANIFEST_FILE);
    if (!fs.existsSync(manifestPath)) return [];

    const entries = parseThemeSource(fs.readFileSync(manifestPath, "utf8"), manifestPath);

    return entries.map((entry) => {
        if (!entry || typeof entry.id !== "string" || !["light", "dark"].includes(entry.mode)
            || typeof entry.light !== "string" || typeof entry.dark !== "string") {
            throw new Error(`Invalid entry in ${manifestPath}: ${JSON.stringify(entry)}`);
        }
        return {
            id: entry.id,
            mode: entry.mode,
            light: readSource(entry.light),
            dark: readSource(entry.dark),
        };
    });
}

module.exports = {
    readVSCodeThemeSources,
};
