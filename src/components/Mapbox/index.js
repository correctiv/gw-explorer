import React, { useEffect } from "react";
import styled from "@emotion/styled";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import config from "~/config";
import { selectDistrict, selectStation } from "~/utils/reducer";
import Geocoder from "./Geocoder";

const MapElement = styled.div`
  height: 100%;
`;

const selectFeatures = (map, { point }) => {
  const features = map.queryRenderedFeatures(point, {
    layers: config.mapbox.layers,
  });
  return [selectDistrict(features), selectStation(features)];
};

const initMap = (
  elementId,
  { setActiveStation, setActiveKreis, setTooltipPosition }
) => {
  // init map
  mapboxgl.accessToken = config.mapbox.token;
  const map = new mapboxgl.Map({
    container: elementId, // container ID
    style: config.mapbox.style, // style URL
    center: config.mapbox.center, // starting position [lng, lat]
    zoom: config.mapbox.zoom, // starting zoom
  });

  // Set the default atmosphere style
  map.on("style.load", () => {
    map.setFog({});
  });

  // Add the geocoder to the map
  map.addControl(Geocoder({ mapboxgl }));

  // Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.NavigationControl());

  // on feature click
  map.on("mousemove", ({ point }) => {
    setTooltipPosition([point.x, point.y]);
    const [activeKreis, activeStation] = selectFeatures(map, { point });
    if (activeKreis) setActiveKreis(activeKreis); // eslint-ignore
    if (activeStation) setActiveStation(activeStation); // eslint-ignore
  });

  // hide tooltip on map click
  map.on("click", () => setActiveStation(null));
};

function Mapbox({ setActiveKreis, setActiveStation, setTooltipPosition }) {
  // on mount
  useEffect(
    () =>
      initMap("mapbox-map", {
        setActiveKreis,
        setActiveStation,
        setTooltipPosition,
      }),
    []
  );

  return <MapElement id="mapbox-map" />;
}

export default Mapbox;
