import React from "react";
import { useTheme, Global, css } from "@emotion/react";

function GlobalStyle() {
  const theme = useTheme();

  const globalStyles = css`
    html,
    body {
      font-family: ${theme.fonts.sans};
      font-weight: 400;
      letter-spacing: 0.5px;
      line-height: 1.5;
      font-size: 16px;
      padding: 0;
      margin: 0;
      height: 100%;
      color: ${theme.colors.text};
    }
    a {
      color: ${theme.colors.text};
      text-decoration: none;
    }
    a:visited,
    a:focus,
    a:active {
      color: ${theme.colors.text};
      text-decoration: none;
    }
    a:hover {
      color: ${theme.colors.text};
      text-decoration: none;
    }
    code,
    pre {
      font-family: ${theme.fonts.mono};
    }
    #gw-explorer-app {
      margin: 0;
      height: 100%;
    }
    .mapboxgl-ctrl-geocoder {
      box-shadow: 0 0 10px 1px #e6e6e6;
      min-width: 100%;
      padding: 4px 5px;
    }
    .mapboxgl-ctrl-geocoder--input {
      transition: 0.2s ease-out;
      &:focus {
        outline: none;
      }
    }
    .mapboxgl-ctrl-geocoder--icon-search {
      top: 12px;
      left: 12px;
    }
    .mapboxgl-ctrl-geocoder--button {
      top: 0px !important;
      background-color: transparent;
      &:hover {
        background-color: transparent !important;
      }
    }
    .mapboxgl-ctrl-geocoder--icon-close {
      margin-top: 14px;
    }
  `;

  return <Global styles={globalStyles} />;
}

export default GlobalStyle;
