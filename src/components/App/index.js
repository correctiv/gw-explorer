import React, { useState } from "react";
import styled from "@emotion/styled";

import Sidebar from "components/Sidebar";
import Mapbox from "components/Mapbox";
import Tooltip from "components/Tooltip";

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

const MapContainer = styled.div`
  position: relative;
  flex-grow: 1;
  height: 100%;
`;

function App() {
  const [activeKreis, setActiveKreis] = useState(null);
  const [activeStation, setActiveStation] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState([0, 0]);

  return (
    <Wrapper>
      <Container>
        <Sidebar activeKreis={activeKreis} setActiveKreis={setActiveKreis} />
        <MapContainer>
          <Mapbox
            setActiveStation={setActiveStation}
            setActiveKreis={setActiveKreis}
            setTooltipPosition={setTooltipPosition}
          />
          <Tooltip position={tooltipPosition} activeStation={activeStation} />
        </MapContainer>
      </Container>
    </Wrapper>
  );
}

export default App;
