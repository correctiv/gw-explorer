export const breakpoints = {
  s: 300,
  m: 768,
  l: 1024,
};

export const device = {
  phone: `@media screen and (min-width: ${breakpoints.s}px)`,
  tablet: `@media screen and (min-width: ${breakpoints.m}px)`,
  desktop: `@media screen and (min-width: ${breakpoints.l}px)`,
};

export const rgba = (hex, alpha) => {
  const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

export const px = (val) => `${val}px`;

export default {
  breakpoints,
  device,
  rgba,
  px,
};
