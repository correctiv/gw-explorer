import config from "config";
import { updateUrl } from "utils/url";
import { statesByIso } from "utils/labels";
import theme from "style/theme";

import { breakpoints } from "utils/css-utils";

const DistrictStyle = {
  source: `${config.mapbox.districtLayer}-source`,
  sourceLayer: config.mapbox.districtSourceLayer,
};

const StationStyle = {
  source: `${config.mapbox.stationLayer}-source`,
  sourceLayer: config.mapbox.stationSourceLayer,
};

const selectStation = (features) => {
  const feature = features[0];
  if (feature) {
    /* eslint-disable camelcase */
    const { authority, state, data, ms_nr, ...rest } = feature.properties;
    return {
      id: `${state}-${ms_nr}`,
      ms_nr,
      state: statesByIso[state],
      authority: statesByIso[authority],
      data: JSON.parse(data.replaceAll("nan", "null")), // FIXME
      coordinates: feature.geometry.coordinates,
      ...rest,
    };
  }
  return null;
};

export function handleStationHighlight(map, { currentId, newId }) {
  if (newId !== currentId) {
    if (currentId) {
      map.setFeatureState(
        { ...StationStyle, id: currentId },
        { highlight: false }
      );
    }
    if (newId)
      map.setFeatureState({ ...StationStyle, id: newId }, { highlight: true });
  }
  return newId;
}

export function handleDistrictHighlight(map, { currentId, newId, status }) {
  if (newId !== currentId) {
    if (currentId)
      map.setFeatureState(
        { ...DistrictStyle, id: currentId },
        { [status]: false }
      );
    if (newId)
      map.setFeatureState({ ...DistrictStyle, id: newId }, { [status]: true });
  }
  return newId;
}

export function getCurrentDistrictId(map, { point }) {
  const features = map.queryRenderedFeatures(point, {
    layers: [config.mapbox.districtLayer],
  });
  return features[0]?.properties.id;
}

export function getCurrentStation(map, { point }) {
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

const binColors = [
  "step",
  ["get", "slope"],
  theme.colors.stark_sinkend,
  -1,
  theme.colors.leicht_sinkend,
  -0.5,
  theme.colors.kein_starker_trend,
  0.5,
  theme.colors.leicht_steigend,
  1,
  theme.colors.stark_steigend,
];

export function addLayers(map) {
  map.addSource(DistrictStyle.source, {
    type: "vector",
    url: config.mapbox.districtSource,
    promoteId: "id",
  });
  map.addLayer({
    id: config.mapbox.districtLayer,
    type: "fill",
    source: DistrictStyle.source,
    "source-layer": DistrictStyle.sourceLayer,
    layout: {},
    paint: {
      "fill-color": "#ffffff",
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "highlight"], false],
        0,
        0.15,
      ],
    },
  });
  map.addLayer({
    id: config.mapbox.districtLayerOutline,
    type: "line",
    source: DistrictStyle.source,
    "source-layer": DistrictStyle.sourceLayer,
    layout: {},
    paint: {
      "line-color": "#ffffff",
      "line-width": [
        "case",
        ["boolean", ["feature-state", "highlight"], false],
        2,
        ["boolean", ["feature-state", "hover"], false],
        2,
        1,
      ],
      "line-opacity": [
        "case",
        ["boolean", ["feature-state", "highlight"], false],
        1,
        ["boolean", ["feature-state", "hover"], false],
        1,
        0.4,
      ],
    },
  });
  map.addSource(StationStyle.source, {
    type: "vector",
    url: config.mapbox.stationSource,
    promoteId: "id",
  });
  map.addLayer({
    id: config.mapbox.stationLayer,
    type: "circle",
    source: StationStyle.source,
    "source-layer": StationStyle.sourceLayer,
    layout: {},
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0,
        1,
        5,
        2,
        10,
        6,
        22,
        25,
      ],
      "circle-color": binColors,
      "circle-opacity": [
        "case",
        ["boolean", ["feature-state", "highlight"], false],
        0.9,
        0.7,
      ],
      "circle-stroke-color": binColors,
      "circle-stroke-width": 3,
      "circle-stroke-opacity": [
        "case",
        ["boolean", ["feature-state", "highlight"], false],
        1,
        0,
      ],
    },
  });
}

export function getTooltopPosition({ point, element }) {
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
