function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/** Parses #RGB, #RGBA, #RRGGBB and #RRGGBBAA into { r, g, b, a } (a in 0..1). */
function parseHex(hex) {
    const trimmed = String(hex || "").trim();
    if (!trimmed.startsWith("#")) return null;

    let raw = trimmed.slice(1);
    if (raw.length === 3 || raw.length === 4) {
        raw = raw.split("").map((part) => part + part).join("");
    }
    if (raw.length !== 6 && raw.length !== 8) return null;
    if (!/^[0-9a-f]+$/i.test(raw)) return null;

    return {
        r: Number.parseInt(raw.slice(0, 2), 16),
        g: Number.parseInt(raw.slice(2, 4), 16),
        b: Number.parseInt(raw.slice(4, 6), 16),
        a: raw.length === 8 ? Number.parseInt(raw.slice(6, 8), 16) / 255 : 1,
    };
}

function toHex({ r, g, b, a = 1 }) {
    const part = (value) => Math.round(clamp(value, 0, 255)).toString(16).padStart(2, "0").toUpperCase();
    return `#${part(r)}${part(g)}${part(b)}${a < 1 ? part(a * 255) : ""}`;
}

/** Multiplies the alpha of a color, as VS Code's `transparent(color, factor)`. */
function withAlpha(hex, factor) {
    const color = parseHex(hex);
    if (!color) return null;
    return toHex({ ...color, a: color.a * factor });
}

/** Paints a (possibly translucent) color over an opaque backdrop, as the screen shows it. */
function composite(hex, backdropHex) {
    const color = parseHex(hex);
    if (!color) return null;
    if (color.a >= 1) return toHex(color);

    const backdrop = parseHex(backdropHex);
    if (!backdrop) return null;
    const mix = (top, bottom) => top * color.a + bottom * (1 - color.a);
    return toHex({ r: mix(color.r, backdrop.r), g: mix(color.g, backdrop.g), b: mix(color.b, backdrop.b) });
}

function isTransparent(hex) {
    const color = parseHex(hex);
    return Boolean(color) && color.a === 0;
}

/** WCAG relative luminance of an opaque color. */
function luminance(hex) {
    const color = parseHex(hex);
    if (!color) return null;
    const channel = (value) => {
        const v = value / 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
}

function rgbToHsl({ r, g, b }) {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;

    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (delta !== 0) {
        s = delta / (1 - Math.abs(2 * l - 1));

        switch (max) {
            case rn:
                h = 60 * (((gn - bn) / delta) % 6);
                break;
            case gn:
                h = 60 * ((bn - rn) / delta + 2);
                break;
            default:
                h = 60 * ((rn - gn) / delta + 4);
                break;
        }
    }

    if (h < 0) h += 360;

    return {
        h: clamp(Number(h.toFixed(1)), 0, 360),
        s: clamp(Number((s * 100).toFixed(1)), 0, 100),
        l: clamp(Number((l * 100).toFixed(1)), 0, 100),
    };
}

/** Opaque hex → the framework's `H S% L%` token format. Translucent colors must be composited first. */
function hexToHslString(hex) {
    const color = parseHex(hex);
    if (!color || color.a < 1) return null;
    const hsl = rgbToHsl(color);
    return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
}

module.exports = {
    parseHex,
    withAlpha,
    composite,
    isTransparent,
    luminance,
    hexToHslString,
};
