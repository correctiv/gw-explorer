import React, { useState } from "react";
import styled from "@emotion/styled";

import Sidebar from "components/Sidebar";
import Mapbox from "components/Mapbox";

const Wrapper = styled.div`
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  flex: none;
  order: 1;
  flex-grow: 0;
`;

function App() {
  const [activeKreis, setActiveKreis] = useState(null);
  const [activeStation, setActiveStation] = useState(null);

  console.log(activeStation);

  return (
    <Wrapper>
      <Container>
        <Sidebar activeKreis={activeKreis} setActiveKreis={setActiveKreis} />
        <Mapbox onStationChange={setActiveStation} />
      </Container>
    </Wrapper>
  );
}

export default App;
