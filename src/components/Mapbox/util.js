import config from "config";
import { updateUrl } from "utils/url";
import { statesByIso } from "utils/labels";

const DISTRICTS = {
  source: `${config.mapbox.districtLayer}-source`,
  sourceLayer: config.mapbox.districtSourceLayer,
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

export function handleDistrictHighlight(map, { currentId, newId }) {
  if (newId !== currentId) {
    if (currentId)
      map.setFeatureState(
        { ...DISTRICTS, id: currentId },
        { highlight: false }
      );
    map.setFeatureState({ ...DISTRICTS, id: newId }, { highlight: true });
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
  const [authority, ms_nr] = stationId.split("-"); // eslint-disable-line
  const features = map
    .queryRenderedFeatures(null, {
      layers: [config.mapbox.stationLayer],
    })
    .filter(
      ({ properties }) =>
        properties.authority === authority && properties.ms_nr === ms_nr // eslint-disable-line
    );
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

export function addDistrictsLayer(map) {
  map.addSource(DISTRICTS.source, {
    type: "vector",
    url: config.mapbox.districtSource,
    promoteId: "id",
  });
  map.addLayer({
    id: config.mapbox.districtLayer,
    type: "fill",
    source: DISTRICTS.source,
    "source-layer": DISTRICTS.sourceLayer,
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
    source: DISTRICTS.source,
    "source-layer": DISTRICTS.sourceLayer,
    layout: {},
    paint: {
      "line-color": "#ffffff",
      "line-width": [
        "case",
        ["boolean", ["feature-state", "highlight"], false],
        3,
        1,
      ],
    },
  });
}

export function getTooltopPosition({ point, element }) {
  const containerWidthMidpoint = element.clientWidth / 2;
  const containerHeightMidpoint = element.clientHeight / 2;
  const x = point.x < containerWidthMidpoint ? point.x + 380 : point.x;
  const y = point.y > containerHeightMidpoint ? point.y - 300 : point.y;
  return [x, y];
}
