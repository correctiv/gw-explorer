import React, { useEffect, useState, useRef } from "react";
import styled from "@emotion/styled";
import "mapbox-gl/dist/mapbox-gl.css";
import StationTooltip from "components/StationTooltip";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import { BsShareFill } from "react-icons/bs";

import { actions } from "store";
import theme from "style/theme";
import { device } from "utils/css-utils";
import { Button } from "components/common";

import initMap from "./init";

const MapWrapper = styled.div`
  position: relative;
  ${device.phone} {
    width: 100%;
    height: 90vh;
  }
  ${device.tablet} {
    flex-grow: 1;
    height: 100%;
  }
`;

const MapElement = styled.div`
  width: 100%;
  height: 100%;
`;

const ShareButton = styled(Button)`
  color: ${theme.colors.text};
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
  &:hover {
    transition: 0.2s;
    background: ${(props) => (props.highlighted ? "white" : "#333")};
    color: ${(props) => (props.highlighted ? "black" : "#f8f8f8")};
    border: 1px solid ${(props) => (props.highlighted ? "#cecece" : "#333")};
  }
`;

const ButtonText = styled.span`
  margin-right: 7px;
`;

function Mapbox({ standaloneMode }) {
  const [showShareOverlay, setShowShareOverlay] = useState(false);
  const shareButtonRef = useRef(null);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  const copyCurrentURL = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareOverlay(true);
    setTimeout(() => setShowShareOverlay(false), 1000);
  };

  // on mount
  useEffect(() => {
    if (mapRef.current) return;
    const { map, geocoder } = initMap({
      container: mapContainerRef.current,
      standaloneMode,
    });
    mapRef.current = map;
    actions.setRefs({ geocoder, mapRef, mapContainerRef });
  }, []);

  return (
    <MapWrapper id="map-wrapper">
      <ShareButton
        highlighted
        id="teilen"
        ref={shareButtonRef}
        onClick={copyCurrentURL}
      >
        <ButtonText>Aktuelle Ansicht teilen</ButtonText>
        <BsShareFill size={16} />
      </ShareButton>
      <Overlay
        target={shareButtonRef.current}
        show={showShareOverlay}
        placement="bottom"
      >
        {(props) => (
          /* eslint-disable react/jsx-props-no-spreading */
          <Tooltip id="teilen-confirm" {...props}>
            Link in Zwischenablage kopiert
          </Tooltip>
        )}
      </Overlay>
      <StationTooltip />
      <MapElement id="mapbox-map" ref={mapContainerRef} />
    </MapWrapper>
  );
}

export default Mapbox;
