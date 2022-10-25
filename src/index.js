import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@emotion/react";

import theme from "style/theme";

import NormalizeStyle from "style/normalize";
import GlobalStyle from "style/global";
import App from "components/App";
import "bootstrap/dist/css/bootstrap.min.css";

function AppWrapper({ renderScreenshotButton }) {
  return (
    <ThemeProvider theme={theme}>
      <NormalizeStyle />
      <GlobalStyle />
      <App renderScreenshotButton={renderScreenshotButton} />
    </ThemeProvider>
  );
}

const render = () => {
  const element = document.getElementById("gw-explorer-app");
  const renderScreenshotButton =
    Object.keys(element.dataset).indexOf("screenshot") > -1;
  ReactDOM.render(
    <AppWrapper renderScreenshotButton={renderScreenshotButton} />,
    element
  );
};

render();
