import React from "react";
import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react";
import theme from "style/theme";
import { device } from "utils/css-utils";

import Sidebar from "components/Sidebar";
import Mapbox from "components/Mapbox";
import Tooltip from "components/Tooltip";

import ContextProvider from "reducer";

const Wrapper = styled.div`
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  ${device.tablet} {
    flex-direction: column;
  }
  align-items: flex-start;
  padding: 0;
  margin: 0;
  flex: none;
  order: 1;
  flex-grow: 0;
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <Container>
          <ContextProvider>
            <Sidebar />
            <Mapbox />
            <Tooltip />
          </ContextProvider>
        </Container>
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;
