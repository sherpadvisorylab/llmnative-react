/**
 * Builds the framework preset of a theme pair: the light source fills `colors`, the dark source
 * `dark`, and `mode` is the one the theme starts in.
 */
function mapSemanticToFrameworkTheme({ mode, light, dark }) {
    return {
        mode,
        colors: light.palette,
        dark: dark.palette,
    };
}

module.exports = {
    mapSemanticToFrameworkTheme,
};
