import React, { useState, createRef, useEffect } from "react";
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
  width: 100%;
  height: 100%;
  @media (max-width: 768px) {
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
  const [activeKreis, setActiveKreis] = useState(null);
  const [activeStation, setActiveStation] = useState(null);
  const mapContainer = createRef(null);
  const map = createRef(null);
  console.log(activeStation);

  useEffect(() => {
    console.log(map);
  }, [map]);

  return (
    <Wrapper>
      <Container>
        <Sidebar
          activeKreis={activeKreis}
          setActiveKreis={setActiveKreis}
          map={map}
        />
        <Mapbox
          onStationChange={setActiveStation}
          mapContainer={mapContainer}
          map={map}
        />
      </Container>
    </Wrapper>
  );
}

export default App;
