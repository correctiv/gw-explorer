import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import config from "~/config";
import Geocoder from "~/components/Geocoder";
import * as actions from "./actions";
import { selectDistrictFromData } from "./reducer";

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
  { mapContainerRef, mapRef, onClick, onMove, handleDistrictChange }
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
      const district = selectDistrictFromData({ id: districtId });
      mapRef.current.flyTo({ center: district.center });
      const [s, w, n, e] = district.bbox;
      mapRef.current.fitBounds([
        [s, w],
        [n, e],
      ]);
      handleDistrictChange(district);
    }
  });

  // Add zoom and rotation controls to the map.
  mapRef.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

  // update current point on click
  mapRef.current.on("click", ({ point }) => onClick(point));

  // update current point on move
  mapRef.current.on("mousemove", ({ point }) => onMove(point));

  // update map state in url
  mapRef.current.on("moveend", () => actions.updateUrlMapState(mapRef.current));

  // add geocoder to sidebar element
  const geocoder = Geocoder({ mapboxgl });
  geocoder.on("result", ({ result }) => {
    const { id } = result.properties;
    if (id) handleDistrictChange(selectDistrictFromData({ id }));
  });

  document
    .getElementById("gw-explorer-geocoder")
    .appendChild(geocoder.onAdd(mapRef.current));

  return mapRef.current;
};

function Mapbox({
  // activeKreis,
  setActiveKreis,
  activeStation,
  setActiveStation,
  resetStation,
  setTooltipPosition,
  mapRef,
  mapContainerRef,
}) {
  const [clickPoint, onClick] = useState(null);
  const [movePoint, onMove] = useState(null);

  const handleDistrictChange = (newDistrict) => {
    if (newDistrict) {
      setActiveKreis((oldDistrict) => {
        // apply highlight
        actions.handleDistrictHighlight(mapRef.current, {
          currentId: oldDistrict?.id,
          newId: newDistrict.id,
        });
        return newDistrict;
      });
    }
  };

  // click
  useEffect(() => {
    if (clickPoint) {
      const district = actions.getCurrentDistrict(mapRef.current, {
        point: clickPoint,
      });
      handleDistrictChange(district);
    }
  }, [clickPoint]);

  // move
  useEffect(() => {
    if (movePoint) {
      // nudge tooltip in view always
      const containerWidthMidpoint = mapContainerRef.current.clientWidth / 2;
      const containerHeightMidpoint = mapContainerRef.current.clientHeight / 2;
      const x =
        movePoint.x < containerWidthMidpoint ? movePoint.x + 380 : movePoint.x;
      const y =
        movePoint.y > containerHeightMidpoint ? movePoint.y - 300 : movePoint.y;
      setTooltipPosition([x, y]);
      const station = actions.getCurrentStation(mapRef.current, {
        point: movePoint,
      });
      if (!station) resetStation();
      if (station && station.id !== activeStation?.id) {
        setActiveStation(station);
      }
    }
  }, [movePoint]);

  // on mount
  useEffect(() => {
    if (mapRef.current) return;
    initMap("mapbox-map", {
      onClick,
      onMove,
      handleDistrictChange,
      resetStation,
      mapContainerRef,
      mapRef,
    });
  }, []);
  return <MapElement id="mapbox-map" ref={mapContainerRef} />;
}

export default Mapbox;
