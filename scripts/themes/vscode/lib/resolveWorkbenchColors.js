const fs = require("fs");
const { WORKBENCH_DEFAULTS_FILE } = require("./paths");
const { withAlpha } = require("./color");

let cachedDefaults = null;

function readWorkbenchDefaults() {
    if (!cachedDefaults) {
        cachedDefaults = JSON.parse(fs.readFileSync(WORKBENCH_DEFAULTS_FILE, "utf8"));
    }
    return cachedDefaults;
}

/**
 * Returns a resolver for the workbench colors of one theme, as VS Code computes them: the theme's
 * own `colors` first, then the color registry default for the theme's mode. Registry defaults that
 * point to another key ({ from, alpha }) follow that key in the same theme, so e.g. Dark+'s
 * `descriptionForeground` is its own `foreground` at 70%.
 */
function createWorkbenchColorResolver(themeColors, mode) {
    const defaults = readWorkbenchDefaults()[mode];
    if (!defaults) throw new Error(`No VS Code workbench defaults for mode "${mode}".`);

    const resolve = (key, seen = new Set()) => {
        const own = themeColors[key];
        if (typeof own === "string" && own.trim()) return own.trim();

        const fallback = defaults[key];
        if (typeof fallback === "string") return fallback;
        if (fallback && typeof fallback === "object" && typeof fallback.from === "string") {
            if (seen.has(key)) throw new Error(`Circular workbench default for "${key}".`);
            const target = resolve(fallback.from, new Set([...seen, key]));
            if (!target) return null;
            return typeof fallback.alpha === "number" ? withAlpha(target, fallback.alpha) : target;
        }
        return null;
    };

    return resolve;
}

module.exports = {
    createWorkbenchColorResolver,
};
