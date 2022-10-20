import React, { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react";
import theme from "style/theme";

import Sidebar from "components/Sidebar";
import Mapbox from "components/Mapbox";
import Tooltip from "components/Tooltip";

import { updateUrl } from "utils/url";

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
  const [tooltipPosition, setTooltipPosition] = useState([0, 0]);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const resetStation = () => {
    setActiveStation(null);
    updateUrl({ station: null });
  };

  // update url params on station change
  useEffect(
    () => activeStation && updateUrl({ station: activeStation.id }),
    [activeStation]
  );
  useEffect(() => {
    setActiveStation(null); // reset active station on kreis change
    updateUrl({ station: null, district: activeKreis?.id });
  }, [activeKreis]);

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <Container>
          <Sidebar activeKreis={activeKreis} mapRef={mapRef} />
          <Mapbox
            activeKreis={activeKreis}
            activeStation={activeStation}
            setActiveStation={setActiveStation}
            setActiveKreis={setActiveKreis}
            resetStation={resetStation}
            setTooltipPosition={setTooltipPosition}
            mapContainerRef={mapContainerRef}
            mapRef={mapRef}
          />
          <Tooltip
            position={tooltipPosition}
            activeStation={activeStation}
            resetStation={resetStation}
          />
        </Container>
      </Wrapper>
    </ThemeProvider>
  );
}

export default App;
