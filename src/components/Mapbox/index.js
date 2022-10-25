import React, { useEffect, useState, useRef } from "react";
import styled from "@emotion/styled";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import Geocoder from "~/components/Geocoder";
import StationTooltip from "components/StationTooltip";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import { BsShareFill } from "react-icons/bs";

import config from "config";
import { useStore } from "reducer";
import events, { subscribe } from "reducer/events";
import { device } from "utils/css-utils";
import { Button } from "components/common";
import { ResetControl } from "./controls";
import * as util from "./util";

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

const initMap = (
  elementId,
  { onClick, onMove, store: { state, actions }, standaloneMode }
) => {
  // init map
  mapboxgl.accessToken = config.mapbox.token;

  const {
    mapRef,
    mapContainerRef,
    bbox,
    zoom,
    initialDistrictId,
    initialStationId,
  } = state;

  mapRef.current = new mapboxgl.Map({
    container: mapContainerRef.current, // container ID
    style: config.mapbox.style, // style URL
    center: config.mapbox.center, // starting position [lng, lat]
    bounds: bbox,
    maxBounds: config.mapbox.bounds, // restrict to germany
    zoom,
    preserveDrawingBuffer: true,
    cooperativeGestures: !standaloneMode,
  });

  // global event
  subscribe(events.mapFirstReady, () => {
    // update current point on click
    mapRef.current.on("click", ({ point }) => onClick(point));

    // update current point on move
    mapRef.current.on("mousemove", ({ point }) => onMove(point));

    // if initial district and station via url, activate it
    if (initialDistrictId) actions.selectDistrict({ id: initialDistrictId });
    if (initialStationId)
      actions.selectInitialStation({ id: initialStationId });
  });

  mapRef.current.on("data", () => {
    const ready = util.getMapReadyState(mapRef.current);
    if (ready) actions.setMapReady();
  });

  mapRef.current.on("load", () => {
    // add districts and station layer for highlighting
    util.addLayers(mapRef.current);
  });

  // Add zoom and rotation controls to the map.
  mapRef.current.addControl(new ResetControl(), "bottom-right");
  mapRef.current.addControl(
    new mapboxgl.NavigationControl({ showCompass: false }),
    "bottom-right"
  );

  // update map state in url
  mapRef.current.on("moveend", () => util.updateUrlMapState(mapRef.current));

  // add geocoder to sidebar element
  const geocoder = Geocoder({ mapboxgl });
  geocoder.on("result", ({ result }) => {
    const { id } = result.properties;
    if (id) {
      actions.selectDistrict({ id, adjusted: true });
      geocoder.clear();
    }
  });

  document
    .getElementById("gw-explorer-geocoder")
    .appendChild(geocoder.onAdd(mapRef.current));

  return mapRef.current;
};

function Mapbox({ standaloneMode }) {
  const { state, actions } = useStore();

  const {
    activeDistrict,
    activeStation,
    stationLock,
    mapRef,
    mapContainerRef,
  } = state;

  const [clickPoint, onClick] = useState(null);
  const [movePoint, onMove] = useState(null);
  const [showShareOverlay, setShowShareOverlay] = useState(false);

  const shareButtonRef = useRef(null);

  const copyCurrentURL = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareOverlay(true);
    setTimeout(() => setShowShareOverlay(false), 1000);
  };

  // click
  useEffect(() => {
    if (clickPoint) {
      const districtId = util.getCurrentDistrictId(mapRef.current, {
        point: clickPoint,
      });
      if (activeDistrict?.id !== districtId) {
        actions.selectDistrict({ id: districtId });
      }
      const station = util.getCurrentStation(mapRef.current, {
        point: clickPoint,
      });
      if (station) {
        actions.updateTooltipPosition({ point: clickPoint });
        actions.selectStation({ station, lock: true });
      }
    }
  }, [clickPoint]);

  // move
  useEffect(() => {
    if (movePoint) {
      if (!stationLock) {
        const station = util.getCurrentStation(mapRef.current, {
          point: movePoint,
        });
        if (!station) actions.resetStation();
        if (station && station.id !== activeStation?.id) {
          actions.updateTooltipPosition({ point: movePoint });
          actions.selectStation({ station });
        }
      }
      // highlight districts on hover
      const districtId = util.getCurrentDistrictId(mapRef.current, {
        point: movePoint,
      });
      if (districtId) actions.hoverDistrict({ id: districtId });
    }
  }, [movePoint]);

  // on mount
  useEffect(() => {
    if (mapRef.current) return;
    initMap("mapbox-map", {
      onClick,
      onMove,
      store: { state, actions },
      standaloneMode,
    });
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
