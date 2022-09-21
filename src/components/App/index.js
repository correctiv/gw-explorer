import React from "react";
import styled from "@emotion/styled";

import Spinner from "components/Spinner";
import Mapbox from "components/Mapbox";

const Wrapper = styled.div`
  padding: 20px;
`;

function App() {
  return (
    <Wrapper>
      <h1>Grundwasser</h1>
      <Spinner />
      <Mapbox />
    </Wrapper>
  );
}

export default App;
