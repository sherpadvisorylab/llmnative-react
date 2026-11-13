const { composite, isTransparent, luminance, hexToHslString } = require("./color");
const { createWorkbenchColorResolver } = require("./resolveWorkbenchColors");

/**
 * Maps the workbench colors of one VS Code theme (light or dark) to the framework's color tokens.
 *
 * Every key is resolved as VS Code does (theme first, then the color registry default), so no token
 * falls back to the framework's own palette. Translucent colors are painted over the surface they
 * sit on. Status colors (destructive/success/warning/info) are not mapped: VS Code has no button or
 * badge colors for them, they stay the framework's.
 */
function mapVSCodeToSemantic(source, mode) {
    const colors = source.parsed?.colors || {};
    const resolve = createWorkbenchColorResolver(colors, mode);

    // First key with a visible color; fully transparent values count as "not set"
    // (e.g. Dark Modern's `button.secondaryBackground` is #00000000: the button is drawn by its border).
    const pick = (keys, backdrop) => {
        for (const key of keys) {
            const value = resolve(key);
            if (!value || isTransparent(value)) continue;
            const opaque = composite(value, backdrop);
            if (opaque) return opaque;
        }
        throw new Error(`${source.fileName}: none of ${keys.join(", ")} resolves to a color.`);
    };

    const background = pick(["editor.background"], "#000000");
    // Page floor and cards come from the two main workbench surfaces: the editor and the side bar.
    // The darker one is the floor and the lighter one the card, in both modes, so cards always read
    // as raised (Dark+ has a lighter side bar than its editor, Dark Modern a darker one).
    const sideBar = pick(["sideBar.background"], background);
    const [canvas, card] = luminance(sideBar) <= luminance(background)
        ? [sideBar, background]
        : [background, sideBar];

    const hex = {
        background,
        foreground: pick(["editor.foreground", "foreground"], background),
        canvas,
        card,
        cardForeground: pick(["editor.foreground", "foreground"], card),
        popover: pick(["menu.background", "dropdown.background", "editorWidget.background"], background),
        popoverForeground: pick(["menu.foreground", "dropdown.foreground", "foreground"], background),
        primary: pick(["button.background"], background),
        primaryForeground: pick(["button.foreground"], background),
        secondary: pick(["button.secondaryBackground", "list.hoverBackground"], background),
        secondaryForeground: pick(["button.secondaryForeground", "foreground"], background),
        // Same surface as `accent`, as in the Tailwind/shadcn palette the framework follows.
        muted: pick(["list.hoverBackground"], background),
        mutedForeground: pick(["descriptionForeground"], card),
        accent: pick(["list.hoverBackground"], background),
        accentForeground: pick(["list.hoverForeground", "foreground"], background),
        border: pick(["panel.border", "widget.border", "editorGroup.border"], card),
        // `input` is the border of form fields (`border-input`), not their background.
        input: pick(["input.border", "dropdown.border", "checkbox.border", "panel.border"], background),
        ring: pick(["focusBorder"], background),
    };

    // The frame of the app (CR-126): the title bar, the side bar and the status bar of the IDE. Their borders
    // default to none in VS Code (the bars stand apart by color): then the line takes the bar's own color.
    const optional = (keys, backdrop, otherwise) => {
        for (const key of keys) {
            const value = resolve(key);
            if (!value || isTransparent(value)) continue;
            const opaque = composite(value, backdrop);
            if (opaque) return opaque;
        }
        return otherwise;
    };
    hex.header = pick(["titleBar.activeBackground"], background);
    hex.headerForeground = pick(["titleBar.activeForeground", "foreground"], hex.header);
    hex.headerBorder = optional(["titleBar.border"], hex.header, hex.header);
    hex.sidebar = sideBar;
    hex.sidebarForeground = pick(["sideBar.foreground", "foreground"], sideBar);
    hex.sidebarBorder = optional(["sideBar.border"], sideBar, sideBar);
    hex.sidebarAccent = pick(["list.inactiveSelectionBackground", "list.hoverBackground"], sideBar);
    hex.sidebarAccentForeground = pick(["list.inactiveSelectionForeground", "sideBar.foreground", "foreground"], hex.sidebarAccent);
    hex.footer = pick(["statusBar.background"], background);
    hex.footerForeground = pick(["statusBar.foreground", "foreground"], hex.footer);
    hex.footerBorder = optional(["statusBar.border"], hex.footer, hex.footer);

    return {
        mode,
        palette: Object.fromEntries(Object.entries(hex).map(([token, value]) => [token, hexToHslString(value)])),
    };
}

module.exports = {
    mapVSCodeToSemantic,
};
