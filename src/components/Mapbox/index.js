import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import config from "~/config";
import Geocoder from "~/components/Geocoder";
import { updateUrl } from "utils/url";
import * as actions from "./actions";

const MapElement = styled.div`
  height: 100%;
`;

const initMap = (elementId, { onMouseMove, resetStation }) => {
  // init map
  mapboxgl.accessToken = config.mapbox.token;

  // try to get url state
  const { bbox, zoom, districtId } = actions.getMapStateFromUrl();

  const map = new mapboxgl.Map({
    container: elementId, // container ID
    style: config.mapbox.style, // style URL
    center: config.mapbox.center, // starting position [lng, lat]
    bounds: bbox || config.mapbox.bounds,
    maxBounds: config.mapbox.bounds, // restrict to germany
    zoom: zoom || config.mapbox.zoom, // starting zoom
  });

  map.on("load", () => {
    // add districts layer
    actions.addDistrictsLayer(map);

    // if initial district via url, activate it
    if (districtId) {
      actions.findDistrict(map, districtId);
    }
  });

  // Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

  // update current point
  map.on("mousemove", ({ point }) => onMouseMove(point));

  // hide tooltip on map click
  map.on("click", resetStation);
  map.on("mouseleave", resetStation);

  // update url state
  map.on("moveend", () => actions.updateUrlMapState(map));

  // add geocoder to sidebar element
  const geocoder = Geocoder({ mapboxgl });
  document
    .getElementById("gw-explorer-geocoder")
    .appendChild(geocoder.onAdd(map));

  return map;
};

function Mapbox({
  activeKreis,
  setActiveKreis,
  activeStation,
  setActiveStation,
  setTooltipPosition,
}) {
  // avoid race conditions on mouse move
  const [map, setMap] = useState(null);
  const [point, onMouseMove] = useState(null);

  const resetStation = () => {
    setActiveStation(null);
    updateUrl({ station: null });
  };

  // mousemove
  useEffect(() => {
    if (point) {
      setTooltipPosition([point.x, point.y]);
      const [district, station] = actions.getCurrentFeatures(map, { point });
      if (station && station.id !== activeStation?.id) {
        setActiveStation(station);
      }
      if (district && district.id !== activeKreis?.id) {
        actions.handleDistrictHighlight(map, {
          currentId: activeKreis?.id,
          newId: district.id,
        });
        setActiveKreis(district);
      }
    }
  }, [point]);

  // on mount
  useEffect(
    () => setMap(initMap("mapbox-map", { onMouseMove, resetStation })),
    []
  );
  return <MapElement id="mapbox-map" />;
}

export default Mapbox;
