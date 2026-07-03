const fs = require("fs");
const path = require("path");
const ts = require("typescript");
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

function readVSCodeThemeSources() {
    if (!fs.existsSync(SOURCES_DIR)) return [];

    const manifestPath = path.join(SOURCES_DIR, SOURCE_MANIFEST_FILE);
    const sourceFiles = fs.existsSync(manifestPath)
        ? parseThemeSource(fs.readFileSync(manifestPath, "utf8"), manifestPath)
        : fs.readdirSync(SOURCES_DIR).filter((fileName) => isThemeJsonFile(fileName) && fileName !== SOURCE_MANIFEST_FILE);

    return sourceFiles
        .map((fileName) => {
            const absolutePath = path.join(SOURCES_DIR, fileName);
            const { raw, parsed } = loadThemeSource(absolutePath);

            return {
                absolutePath,
                fileName,
                raw,
                parsed,
            };
        })
        .filter((source) => typeof source.parsed?.name === "string" && source.parsed.name.trim().length > 0);
}

module.exports = {
    readVSCodeThemeSources,
};
