import React, { useState, createRef, useEffect } from "react";
import styled from "@emotion/styled";

import Sidebar from "components/Sidebar";
import Mapbox from "components/Mapbox";
import Tooltip from "components/Tooltip";

import { updateUrl } from "utils/url";
import { useDebounce } from "utils/hooks";

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

const MapContainer = styled.div`
  position: relative;
  flex-grow: 1;
  height: 100%;
`;

function App() {
  const [activeKreis, setActiveKreis] = useState(null);
  const [activeStation, setActiveStation] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState([0, 0]);
  const delayedKreis = useDebounce(activeKreis, 500);
  const mapContainerRef = createRef(null);
  const mapRef = createRef(null);

  // update url params on station change
  useEffect(
    () => activeStation && updateUrl({ station: activeStation.id }),
    [activeStation]
  );
  useEffect(() => {
    setActiveStation(null); // reset active station on kreis change
    updateUrl({ station: null });
  }, [activeKreis]);
  // avoid race conditions on update url when moving around kreise
  useEffect(
    () => delayedKreis && updateUrl({ district: delayedKreis.id }),
    [delayedKreis]
  );

  return (
    <Wrapper>
      <Container>
        <Sidebar
          activeKreis={activeKreis}
          setActiveKreis={setActiveKreis}
          mapRef={mapRef}
        />
        <MapContainer>
          <Mapbox
            activeKreis={activeKreis}
            activeStation={activeStation}
            setActiveStation={setActiveStation}
            setActiveKreis={setActiveKreis}
            setTooltipPosition={setTooltipPosition}
            mapContainerRef={mapContainerRef}
            mapRef={mapRef}
          />
          <Tooltip position={tooltipPosition} activeStation={activeStation} />
        </MapContainer>
      </Container>
    </Wrapper>
  );
}

export default App;
