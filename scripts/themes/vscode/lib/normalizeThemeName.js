function toKebabCase(value) {
    return value
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();
}

function normalizeThemeName(sourceFileName, declaredName) {
    const baseName = sourceFileName.replace(/\.json$/i, "");
    const strippedBaseName = baseName
        .replace(/-color-theme$/i, "")
        .replace(/\.color-theme$/i, "");
    const normalizedDeclaredName = toKebabCase(declaredName || "");
    const normalizedSourceName = toKebabCase(strippedBaseName || "vscode-theme");
    const genericDeclaredNames = new Set(["dark", "light", "default", "theme"]);

    if (!normalizedDeclaredName || genericDeclaredNames.has(normalizedDeclaredName)) {
        return normalizedSourceName;
    }

    return normalizedDeclaredName;
}

module.exports = {
    normalizeThemeName,
};
