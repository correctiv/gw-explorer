import React, { useState } from "react";
import styled from "@emotion/styled";

// import Spinner from "components/Spinner";
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
  const [activeKreis, setActiveKreis] = useState();
  const [activeStation, setActiveStation] = useState();
  console.log(activeStation, activeKreis); // need to do something here or eslint is mad

  return (
    <Wrapper>
      {/* <h1>Grundwasser</h1>
      <Spinner /> */}
      <Container>
        <Sidebar onKreisChange={setActiveKreis} />
        <Mapbox onStationChange={setActiveStation} />
      </Container>
    </Wrapper>
  );
}

export default App;
