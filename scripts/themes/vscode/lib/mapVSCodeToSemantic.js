const { hexToHslString } = require("./color");

function pickColor(colors, keys) {
    for (const key of keys) {
        const value = colors[key];
        if (typeof value === "string" && value.trim()) {
            const converted = hexToHslString(value);
            if (converted) return converted;
        }
    }

    return null;
}

function resolveThemeMode(source) {
    const parsed = source.parsed || {};
    const inferredName = [
        parsed.name,
        source.fileName,
    ]
        .filter((value) => typeof value === "string")
        .join(" ")
        .toLowerCase();

    if (inferredName.includes("light")) return "light";
    if (inferredName.includes("dark")) return "dark";

    const explicitType = typeof parsed.type === "string" ? parsed.type.toLowerCase() : "";

    if (explicitType === "light") return "light";
    if (explicitType === "dark") return "dark";

    return "dark";
}

function mapVSCodeToSemantic(source) {
    const parsed = source.parsed || {};
    const colors = parsed.colors || {};
    const mode = resolveThemeMode(source);

    const palette = {
        background: pickColor(colors, ["editor.background", "sideBar.background", "panel.background"]),
        foreground: pickColor(colors, ["editor.foreground", "sideBar.foreground", "foreground"]),
        card: pickColor(colors, ["editorWidget.background", "panel.background", "sideBar.background"]),
        cardForeground: pickColor(colors, ["editorWidget.foreground", "editor.foreground", "sideBar.foreground"]),
        popover: pickColor(colors, ["dropdown.background", "menu.background", "editorWidget.background"]),
        popoverForeground: pickColor(colors, ["dropdown.foreground", "menu.foreground", "editor.foreground"]),
        primary: pickColor(colors, ["button.background", "focusBorder", "textLink.foreground"]),
        primaryForeground: pickColor(colors, ["button.foreground", "button.secondaryForeground", "editor.background"]),
        secondary: pickColor(colors, ["sideBar.background", "panel.background", "editorWidget.background"]),
        secondaryForeground: pickColor(colors, ["sideBar.foreground", "panelTitle.activeForeground", "editor.foreground"]),
        muted: pickColor(colors, ["list.inactiveSelectionBackground", "editor.lineHighlightBackground", "sideBar.background"]),
        mutedForeground: pickColor(colors, ["descriptionForeground", "disabledForeground", "sideBar.foreground"]),
        accent: pickColor(colors, ["list.activeSelectionBackground", "list.hoverBackground", "button.secondaryBackground"]),
        accentForeground: pickColor(colors, ["list.activeSelectionForeground", "button.secondaryForeground", "editor.foreground"]),
        border: pickColor(colors, ["panel.border", "editorWidget.border", "input.border", "contrastBorder"]),
        input: pickColor(colors, ["input.background", "editorWidget.background", "sideBar.background"]),
        ring: pickColor(colors, ["focusBorder", "editorCursor.foreground", "button.background"]),
    };

    return {
        mode,
        palette,
    };
}

module.exports = {
    mapVSCodeToSemantic,
};
