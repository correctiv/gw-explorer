import config from "config";
import { updateUrl } from "utils/url";
import { selectDistrict, selectStation } from "./reducer";

const DISTRICTS = {
  source: `${config.mapbox.districtLayer}-source`,
  sourceLayer: config.mapbox.districtSourceLayer,
};

export function handleDistrictHighlight(map, { currentId, newId }) {
  if (newId !== currentId) {
    if (currentId)
      map.setFeatureState({ ...DISTRICTS, id: currentId }, { hover: false });
    map.setFeatureState({ ...DISTRICTS, id: newId }, { hover: true });
  }
  return newId;
}

export function handleDistrictLock(map, { currentId, newId }) {
  if (newId !== currentId) {
    if (currentId)
      map.setFeatureState({ ...DISTRICTS, id: currentId }, { locked: false });
    map.setFeatureState({ ...DISTRICTS, id: newId }, { locked: true });
  }
  return newId;
}

export function findDistrict(map, { id }) {
  // FIXME
  const features = map.querySourceFeatures(DISTRICTS.source, {
    sourceLayer: DISTRICTS.sourceLayer,
  });
  console.log(id, features);
  return features;
}

export function getCurrentFeatures(map, { point }) {
  const features = map.queryRenderedFeatures(point, {
    layers: config.mapbox.layers,
  });
  return [selectDistrict(features), selectStation(features)];
}

export function getMapStateFromUrl() {
  const url = new URL(window.location);
  const bbox = url.searchParams.get("bbox")?.split(",");
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
        ["boolean", ["feature-state", "hover"], false],
        0,
        0.3,
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
        ["boolean", ["feature-state", "locked"], false],
        3,
        1,
      ],
    },
  });
}
