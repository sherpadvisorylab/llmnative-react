function compactObject(value) {
    return Object.fromEntries(
        Object.entries(value).filter(([, entryValue]) => entryValue !== null && entryValue !== undefined),
    );
}

function mapSemanticToFrameworkTheme(semanticTheme) {
    const palette = compactObject(semanticTheme.palette);

    if (semanticTheme.mode === "light") {
        return {
            mode: "light",
            colors: palette,
            dark: {},
        };
    }

    return {
        mode: "dark",
        colors: {},
        dark: palette,
    };
}

module.exports = {
    mapSemanticToFrameworkTheme,
};
