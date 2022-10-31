import React from "react";
import styled from "@emotion/styled";
import { StoreProvider } from "easy-peasy";

import { device } from "utils/css-utils";
import Sidebar from "components/Sidebar";
import Mapbox from "components/Mapbox";

import store from "store";

const Wrapper = styled.div`
  padding: 0;
  margin: 0;
  ${device.phone} {
    height: max-content;
  }
  ${device.tablet} {
    height: 100%;
  }
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  ${device.phone} {
    flex-direction: column;
  }
  ${device.tablet} {
    flex-direction: row;
  }
  align-items: flex-start;
  padding: 0;
  margin: 0;
`;

function App({ appConfig }) {
  const { renderScreenshotButton, standaloneMode } = appConfig;
  return (
    <Wrapper>
      <Container>
        <StoreProvider store={store}>
          <Sidebar renderScreenshotButton={renderScreenshotButton} />
          <Mapbox standaloneMode={standaloneMode} />
        </StoreProvider>
      </Container>
    </Wrapper>
  );
}

export default App;
