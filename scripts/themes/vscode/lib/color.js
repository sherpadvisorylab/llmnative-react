function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function normalizeHex(hex) {
    const trimmed = String(hex || "").trim();
    if (!trimmed.startsWith("#")) return null;

    const raw = trimmed.slice(1);
    if (raw.length === 3) {
        return raw.split("").map((part) => part + part).join("");
    }

    if (raw.length === 6) return raw;
    return null;
}

function hexToRgb(hex) {
    const normalized = normalizeHex(hex);
    if (!normalized) return null;

    const value = Number.parseInt(normalized, 16);
    return {
        r: (value >> 16) & 255,
        g: (value >> 8) & 255,
        b: value & 255,
    };
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

function hexToHslString(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    const hsl = rgbToHsl(rgb);
    return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
}

module.exports = {
    hexToHslString,
};
