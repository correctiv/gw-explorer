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
  const features = map.current.queryRenderedFeatures(point, {
    layers: config.mapbox.layers,
  });
  if (!features.length) {
    return false;
  }
  return features[0];
};

const initMap = (elementId, { onStationChange, mapContainer, map }) => {
  // init map
  mapboxgl.accessToken = config.mapbox.token;
  map.current = new mapboxgl.Map({
    container: mapContainer.current, // container ID
    style: config.mapbox.style, // style URL
    center: config.mapbox.center, // starting position [lng, lat]
    zoom: config.mapbox.zoom, // starting zoom
    projection: "globe", // display the map as a 3D globe
    preserveDrawingBuffer: true,
  });

  // Set the default atmosphere style
  map.current.on("style.load", () => {
    map.current.setFog({});
  });

  // Add the geocoder to the map
  map.current.addControl(Geocoder({ mapboxgl }));

  // Add zoom and rotation controls to the map.current.
  map.current.addControl(new mapboxgl.NavigationControl());

  // on feature click
  map.current.on("click", ({ point }) => {
    const feature = selectFeature(map, { point });
    return feature && onStationChange(feature); // is this correct?
  });
};

function Mapbox({ onStationChange, mapContainer, map }) {
  // on mount
  useEffect(() => {
    if (map.current) return;
    initMap("mapbox-map", { onStationChange, mapContainer, map });
  }, []);

  return <MapElement id="mapbox-map" ref={mapContainer} />;
}

export default Mapbox;
