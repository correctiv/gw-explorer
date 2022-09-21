import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@emotion/react";

import theme from "style/theme";

import NormalizeStyle from "style/normalize";
import GlobalStyle from "style/global";
import App from "components/App";

function AppWrapper() {
  return (
    <ThemeProvider theme={theme}>
      <NormalizeStyle />
      <GlobalStyle />
      <App />
    </ThemeProvider>
  );
}

ReactDOM.render(<AppWrapper />, document.getElementById("gw-explorer-app"));
