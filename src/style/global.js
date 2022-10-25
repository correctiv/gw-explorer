import React from "react";
import { useTheme, Global, css } from "@emotion/react";
import { device } from "utils/css-utils";

function GlobalStyle() {
  const theme = useTheme();

  const globalStyles = css`
    html,
    body {
      padding: 0;
      margin: 0;
      height: 100%;
    }
    #gw-explorer-app a,
    #gw-explorer-app a:visited,
    #gw-explorer-app a:focus,
    #gw-explorer-app a:active,
    #gw-explorer-app a:hover {
      text-decoration: none;
    }
    #gw-explorer-app a.correctiv-link {
      color: ${theme.colors.emphasis};
      border-bottom: 1px solid ${theme.colors.emphasis};
    }
    #gw-explorer-app {
      margin: 0;
      padding: 0;
      height: 100%;
      width: 100%;
      font-family: ${theme.fonts.sans};
      font-weight: 400;
      letter-spacing: 0.5px;
      line-height: 1.5;
      font-size: 16px;
      color: ${theme.colors.textL};
    }
    #gw-explorer-app .mapboxgl-ctrl-geocoder {
      box-shadow: 0 0 10px 1px #e6e6e6;
      min-width: 100%;
      padding: 4px 5px;
    }
    #gw-explorer-app .mapboxgl-ctrl-geocoder--input {
      transition: 0.2s ease-out;
      &:focus {
        outline: none;
      }
      ${device.phone} {
        font-size: 16px;
        height: max-content;
      }
      ${device.tablet} {
        font-size: 18px;
        height: 40px;
      }
    }
    #gw-explorer-app .mapboxgl-ctrl-geocoder--icon-search {
      top: 50%;
      transform: translateY(-50%);
      left: 12px;
    }
    #gw-explorer-app .mapboxgl-ctrl-geocoder--button {
      top: 0px !important;
      background-color: transparent;
      &:hover {
        background-color: transparent !important;
      }
    }
    #gw-explorer-app .mapboxgl-ctrl-geocoder--icon-close {
      ${device.phone} {
        margin-top: 12px;
      }
      ${device.tablet} {
        margin-top: 16px;
      }
    }
    #gw-explorer-app #gw-explorer-geocoder {
      margin-bottom: 0px;
    }
  `;

  return <Global styles={globalStyles} />;
}

export default GlobalStyle;
