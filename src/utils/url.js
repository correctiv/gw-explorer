/* eslint-disable import/prefer-default-export */

import config from "config";

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
  url.hash = config.urlHash;
  window.history.replaceState(null, "", url.toString());
}
