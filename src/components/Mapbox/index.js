import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import config from "~/config";
import Geocoder from "~/components/Geocoder";
import { useStore } from "reducer";
import * as util from "./util";

const MapElement = styled.div`
  position: relative;
  flex-grow: 1;
  height: 100%;
  @media (max-width: 768px) {
    width: 100%;
    min-height: 400px;
    height: 80%;
  }
`;

const initMap = (elementId, { onClick, onMove, store: { state, actions } }) => {
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
  });

  mapRef.current.on("data", () => {
    const ready = util.getMapReadyState(mapRef.current);
    if (ready) {
      // if initial district and station via url, activate it
      if (initialDistrictId) actions.selectDistrict({ id: initialDistrictId });
      if (initialStationId)
        actions.selectInitialStation({ id: initialStationId });
    }
  });

  mapRef.current.on("load", () => {
    // add districts and station layer for highlighting
    util.addLayers(mapRef.current);
  });

  // Add zoom and rotation controls to the map.
  mapRef.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

  // update current point on click
  mapRef.current.on("click", ({ point }) => onClick(point));

  // update current point on move
  mapRef.current.on("mousemove", ({ point }) => onMove(point));

  // update map state in url
  mapRef.current.on("moveend", () => util.updateUrlMapState(mapRef.current));

  // add geocoder to sidebar element
  const geocoder = Geocoder({ mapboxgl });
  geocoder.on("result", ({ result }) => {
    const { id } = result.properties;
    if (id) actions.selectDistrict({ id });
  });

  document
    .getElementById("gw-explorer-geocoder")
    .appendChild(geocoder.onAdd(mapRef.current));

  return mapRef.current;
};

function Mapbox() {
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
    initMap("mapbox-map", { onClick, onMove, store: { state, actions } });
  }, []);
  return <MapElement id="mapbox-map" ref={mapContainerRef} />;
}

export default Mapbox;
