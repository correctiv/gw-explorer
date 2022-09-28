import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import config from "~/config";
import { selectDistrict, selectStation } from "~/utils/reducer";
import Geocoder from "~/components/Geocoder";
import { updateUrlMapState, getMapStateFromUrl } from "~/utils/url";
import { useDebounce } from "~/utils/hooks";

const MapElement = styled.div`
  height: 100%;
`;

const getDistrict = (map, districtId) => {
  // FIXME not working yet
  console.log(districtId);
  console.log(map);
  const features = map.querySourceFeatures(config.mapbox.districtSource, {
    sourceLayer: config.mapbox.districtLayer,
  });
  console.log(features);
  return features;
};

const selectFeatures = (map, { point }) => {
  const features = map.queryRenderedFeatures(point, {
    layers: config.mapbox.layers,
  });
  return [selectDistrict(features), selectStation(features)];
};

const initMap = (elementId, { onMouseMove, resetTooltip }) => {
  // init map
  mapboxgl.accessToken = config.mapbox.token;

  // try to get url state
  const { bbox, zoom, districtId } = getMapStateFromUrl();

  const map = new mapboxgl.Map({
    container: elementId, // container ID
    style: config.mapbox.style, // style URL
    center: config.mapbox.center, // starting position [lng, lat]
    bounds: bbox || config.mapbox.bounds,
    maxBounds: config.mapbox.bounds, // restrict to germany
    zoom: zoom || config.mapbox.zoom, // starting zoom
  });

  map.on("load", () => {
    // if initial district via url, activate it
    if (districtId) {
      getDistrict(map, districtId);
    }
  });

  // Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

  // update current point
  map.on("mousemove", ({ point }) => onMouseMove(point));

  // hide tooltip on map click
  map.on("click", resetTooltip);
  map.on("mouseleave", resetTooltip);

  // update url state
  map.on("moveend", () => updateUrlMapState(map));

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
  const changedPoint = useDebounce(point, 100);
  useEffect(() => {
    if (point) {
      const [district, station] = selectFeatures(map, { point });
      if (station && station.id !== activeStation?.id) {
        setActiveStation(station);
      }
      if (district && district.id !== activeKreis?.id) {
        setActiveKreis(district);
      }
    }
  }, [changedPoint]);

  // update tooltip position always
  useEffect(() => point && setTooltipPosition([point.x, point.y]), [point]);

  // on mount
  useEffect(
    () =>
      setMap(
        initMap("mapbox-map", {
          onMouseMove,
          resetTooltip: () => setActiveStation(null), // reset tooltip
        })
      ),
    []
  );

  return <MapElement id="mapbox-map" />;
}

export default Mapbox;
