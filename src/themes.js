import { aquaticTheme } from "./themes/aquatic.js";
import { aquaticGlowTheme } from "./themes/aquaticGlow.js";
import { classicTheme } from "./themes/classic.js";
import { colorfulTheme } from "./themes/colorful.js";
import { defaultTheme } from "./themes/default.js";
import { natureTheme } from "./themes/nature.js";
import { vanillaTheme } from "./themes/vanilla.js";
export function getTheme(index) {
    let themes = [
        defaultTheme,
        defaultTheme,
        aquaticTheme,
        colorfulTheme,
        vanillaTheme,
        natureTheme,
        aquaticGlowTheme,
        classicTheme,
    ];
    let theme = themes[index];
    return theme;
}
