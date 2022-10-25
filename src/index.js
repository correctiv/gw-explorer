import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@emotion/react";

import theme from "style/theme";

import GlobalStyle from "style/global";
import App from "components/App";

import "style/bootstrap.scss";

function AppWrapper({ appConfig }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <App appConfig={appConfig} />
    </ThemeProvider>
  );
}

const render = () => {
  const element = document.getElementById("gw-explorer-app");
  const appConfig = {
    renderScreenshotButton:
      Object.keys(element.dataset).indexOf("screenshot") > -1,
    standaloneMode: Object.keys(element.dataset).indexOf("standalone") > -1,
  };
  ReactDOM.render(<AppWrapper appConfig={appConfig} />, element);
};

render();
