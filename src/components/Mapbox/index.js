import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import config from "~/config";
import Geocoder from "~/components/Geocoder";
import * as actions from "./actions";

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

const initMap = (
  elementId,
  { mapContainerRef, mapRef, resetStation, onClick }
) => {
  // init map
  mapboxgl.accessToken = config.mapbox.token;

  // try to get url state
  const { bbox, zoom, districtId } = actions.getMapStateFromUrl();

  mapRef.current = new mapboxgl.Map({
    container: mapContainerRef.current, // container ID
    style: config.mapbox.style, // style URL
    center: config.mapbox.center, // starting position [lng, lat]
    bounds: bbox || config.mapbox.bounds,
    maxBounds: config.mapbox.bounds, // restrict to germany
    zoom: zoom || config.mapbox.zoom, // starting zoom
    preserveDrawingBuffer: true,
  });

  mapRef.current.on("load", () => {
    // add districts layer
    actions.addDistrictsLayer(mapRef.current);

    // if initial district via url, activate it
    if (districtId) {
      actions.findDistrict(mapRef.current, { id: districtId });
    }
  });

  // Add zoom and rotation controls to the map.
  mapRef.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

  // update current point on click
  mapRef.current.on("click", ({ point }) => onClick(point));

  // hide tooltip on leave
  mapRef.current.on("mouseleave", resetStation);

  // update url state
  mapRef.current.on("moveend", () => actions.updateUrlMapState(mapRef.current));

  // add geocoder to sidebar element
  const geocoder = Geocoder({ mapboxgl });
  document
    .getElementById("gw-explorer-geocoder")
    .appendChild(geocoder.onAdd(mapRef.current));

  // mapRef.current = map;
  return mapRef.current;
};

function Mapbox({
  activeKreis,
  setActiveKreis,
  activeStation,
  setActiveStation,
  resetStation,
  setTooltipPosition,
  mapRef,
  mapContainerRef,
}) {
  const [point, onClick] = useState(null);

  // click
  useEffect(() => {
    if (point) {
      setTooltipPosition([point.x, point.y]);
      const [district, station] = actions.getCurrentFeatures(mapRef.current, {
        point,
      });
      if (!station) resetStation();
      if (station && station.id !== activeStation?.id) {
        setActiveStation(station);
      }
      if (district && district.id !== activeKreis?.id) {
        actions.handleDistrictHighlight(mapRef.current, {
          currentId: activeKreis?.id,
          newId: district.id,
        });
        setActiveKreis(district);
      }
    }
  }, [point]);

  // on mount
  useEffect(() => {
    if (mapRef.current) return;
    initMap("mapbox-map", {
      onClick,
      resetStation,
      mapContainerRef,
      mapRef,
    });
  }, []);
  return <MapElement id="mapbox-map" ref={mapContainerRef} />;
}

export default Mapbox;
