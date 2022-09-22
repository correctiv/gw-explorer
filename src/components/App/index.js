import React, { useState } from "react";
import styled from "@emotion/styled";

import Spinner from "components/Spinner";
import Mapbox from "components/Mapbox";

const Wrapper = styled.div`
  padding: 20px;
`;

function App() {
  const [activeStation, setActiveStation] = useState();

  return (
    <Wrapper>
      <h1>Grundwasser</h1>
      <Spinner />
      <Mapbox onStationChange={setActiveStation} />
    </Wrapper>
  );
}

export default App;
