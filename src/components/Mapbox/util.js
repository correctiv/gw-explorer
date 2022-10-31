import config from "config";
import { updateUrl } from "utils/url";
import { statesByIso } from "utils/labels";

import { breakpoints } from "utils/css-utils";
import { DistrictStyle, StationStyle } from "./layers";

const selectStation = (features) => {
  const feature = features[0];
  if (feature) {
    const { authority, state, data, ...rest } = feature.properties;
    return {
      state: statesByIso[state],
      authority: statesByIso[authority],
      data: JSON.parse(data.replaceAll("nan", "null")), // FIXME
      coordinates: feature.geometry.coordinates,
      ...rest,
    };
  }
  return null;
};

export function highlightStation(map, id) {
  if (id) map.setFeatureState({ ...StationStyle, id }, { highlight: true });
}

export function unhighlightStation(map, id) {
  if (id) {
    map.setFeatureState({ ...StationStyle, id }, { highlight: false });
  }
}

export function highlightDistrict(map, id, status) {
  if (id) map.setFeatureState({ ...DistrictStyle, id }, { [status]: true });
}

export function unhighlightDistrict(map, id, status) {
  if (id) {
    map.setFeatureState({ ...DistrictStyle, id }, { [status]: false });
  }
}

export function getCurrentDistrictId(map, point) {
  const features = map.queryRenderedFeatures(point, {
    layers: [config.mapbox.districtLayer],
  });
  return features[0]?.properties.id;
}

export function getCurrentStation(map, point) {
  const features = map.queryRenderedFeatures(point, {
    layers: [config.mapbox.stationLayer],
  });
  return selectStation(features);
}

export function findStation(map, stationId) {
  const features = map
    .queryRenderedFeatures(null, {
      layers: [config.mapbox.stationLayer],
    })
    .filter(({ id }) => id === stationId);
  return selectStation(features);
}

export function getMapStateFromUrl() {
  const url = new URL(window.location);
  const bbox = url.searchParams.get("bbox")?.split(",").map(parseFloat);
  const zoom = url.searchParams.get("zoom");
  const districtId = url.searchParams.get("district");
  const stationId = url.searchParams.get("station");
  return { bbox, zoom, districtId, stationId };
}

export function updateUrlMapState(map) {
  const bbox = map.getBounds().toArray().flat().join(",");
  const zoom = map.getZoom();
  updateUrl({ bbox, zoom });
}

export function getTooltipPosition({ point, element }) {
  const isMobile = window.innerWidth < breakpoints.m;
  if (isMobile) {
    return [0, 0];
  }
  const containerWidthMidpoint = element.clientWidth / 2;
  const containerHeightMidpoint = element.clientHeight / 2;
  const x = point.x > containerWidthMidpoint ? point.x - 390 : point.x;
  const y = point.y > containerHeightMidpoint ? point.y - 310 : point.y;
  return [x, y];
}

export function getMapReadyState(map) {
  const layers = map.getStyle().layers.map((l) => l.id);
  return (
    map.isStyleLoaded() &&
    layers.indexOf(config.mapbox.districtLayer) > -1 &&
    layers.indexOf(config.mapbox.districtLayerOutline) > -1 &&
    layers.indexOf(config.mapbox.stationLayer) > -1
  );
}
