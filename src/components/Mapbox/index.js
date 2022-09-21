import React, { useEffect } from "react";
import styled from "@emotion/styled";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

import config from "~/config";

const MapElement = styled.div`
  width: 100%;
  height: 1000px;
`;

const initMap = (elementId) => {
  mapboxgl.accessToken = config.mapbox.token;
  const map = new mapboxgl.Map({
    container: elementId, // container ID
    style: config.mapbox.style, // style URL
    center: config.mapbox.center, // starting position [lng, lat]
    zoom: config.mapbox.zoom, // starting zoom
    projection: "globe", // display the map as a 3D globe
  });
  map.on("style.load", () => {
    map.setFog({}); // Set the default atmosphere style
  });
  return map;
};

function Mapbox() {
  // on mount
  useEffect(() => initMap("mapbox-map"), []);

  return <MapElement id="mapbox-map" />;
}

export default Mapbox;
