import React, { useEffect } from "react";
import styled from "@emotion/styled";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

import config from "~/config";
import Geocoder from "./Geocoder";

const MapElement = styled.div`
  flex-grow: 1;
  height: 100%;
`;

const selectFeature = (map, { point }) => {
  const features = map.queryRenderedFeatures(point, {
    layers: config.mapbox.layers,
  });
  if (!features.length) {
    return false;
  }
  return features[0];
};

const initMap = (elementId, { onStationChange }) => {
  // init map
  mapboxgl.accessToken = config.mapbox.token;
  const map = new mapboxgl.Map({
    container: elementId, // container ID
    style: config.mapbox.style, // style URL
    center: config.mapbox.center, // starting position [lng, lat]
    zoom: config.mapbox.zoom, // starting zoom
    projection: "globe", // display the map as a 3D globe
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
  map.on("click", ({ point }) => {
    const feature = selectFeature(map, { point });
    return feature && onStationChange(feature); // is this correct?
  });
};

function Mapbox({ onStationChange }) {
  // on mount
  useEffect(() => initMap("mapbox-map", { onStationChange }), []);

  return <MapElement id="mapbox-map" />;
}

export default Mapbox;
