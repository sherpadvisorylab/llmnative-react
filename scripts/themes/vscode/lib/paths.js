const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "../../../../");
const SOURCES_DIR = path.join(ROOT_DIR, "scripts/themes/vscode/sources");
const THEMES_DIR = path.join(ROOT_DIR, "themes");

module.exports = {
    ROOT_DIR,
    SOURCES_DIR,
    THEMES_DIR,
};
