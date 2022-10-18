/* eslint-disable import/prefer-default-export */
export function updateUrl(params) {
  const url = new URL(window.location);
  /* eslint-disable no-restricted-syntax */
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  }
  window.history.pushState(null, "", url.toString());
}
