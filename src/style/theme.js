import { px, breakpoints } from "utils/css-utils";

const space = [0, 4, 8, 16, 32, 48, 64, 96, 128];
const spacePx = space.map(px);

const fontSizes = [12, 16, 20, 24, 36, 48, 54];
const fontSizesPx = fontSizes.map(px);
const breakpointsPx = Object.values(breakpoints).map(px);

const theme = {
  fonts: {
    sans: "'Source Sans Pro', Roboto, 'Helvetica Neue', Ubuntu, Arial, sans-serif",
    mono: "monospace",
  },
  space,
  spacePx,
  fontSizes,
  fontSizesPx,
  breakpoints: breakpointsPx,
  boxShadow: "0px 16px 64px rgba(26, 25, 43, 0.32);",
  colors: {
    text: "#1A192B",
    textLight: "#808080",
    lightGrey: "#B3B3B3",
    lightLightGrey: "#eee",
    emphasis: "#FF5064",
    // data coloring
    stark_sinkend: "#E9650E",
    leicht_sinkend: "#FFB727",
    kein_starker_trend: "#eeeeee",
    leicht_steigend: "#71B5FE",
    stark_steigend: "#0163CB",
  },
};

export default theme;
