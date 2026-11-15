// Keys and paths as plain strings: pure, so the server entry can use them (no React).

export const trimSlash = (path?: string | number | boolean): string => {
    if (typeof path === "number") return String(path);
    if (typeof path === "boolean") return path ? "true" : "false";
    if(!path) return '';

    return (path.startsWith('/')
            ? path.substring(1)
            : path
    );
};

export const normalizeKey = (key?: string | number | boolean): string => {
    return trimSlash(key)
        .replaceAll("/", "|")
        .replaceAll(" ", "-")
        .replaceAll("'", "-")
        .replaceAll('"', "-")
        .replaceAll(".", "-")
        .replaceAll("@", "-")
        .replaceAll("#", "-")
        .replaceAll("$", "-")
        .replaceAll("[", "-")
        .replaceAll("]", "-")
        .replaceAll("_", "-")
        .toLowerCase()
        .replace(/[^a-z0-9\-|]+/g, "")
        .replace(/^-+|-+$/g, "")
        .replace(/-+/g, "-");
};
