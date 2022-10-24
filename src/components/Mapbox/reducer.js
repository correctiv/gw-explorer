import config from "config";
import { statesByIso, statesById, districtBez, slopeBin } from "utils/labels";
import districts from "data/districts.csv";

const getFeatureFromLayer = (features, layer) => {
  const layerFeatures = features.filter((f) => f.layer.id === layer);
  return layerFeatures.length ? layerFeatures[0] : null;
};

const NUMERIC_COLS = [...Object.keys(slopeBin), "total"];

export function selectDistrictFromData({ id }) {
  const { bez, bbox, center, ...data } = districts.find((d) => d.id === id);
  const state = statesById[id.slice(0, 2)];
  NUMERIC_COLS.map((c) => { // eslint-disable-line
    data[c] = +data[c];
  });
  return {
    id,
    state,
    bez: districtBez[bez],
    bbox: bbox.split(",").map(parseFloat),
    center: center.split(",").map(parseFloat),
    ...data,
  };
}

export function selectDistrict(features) {
  const feature = getFeatureFromLayer(features, config.mapbox.districtLayer);
  if (feature) return selectDistrictFromData(feature.properties);
  return null;
}

export function selectStation(features) {
  const feature = getFeatureFromLayer(features, config.mapbox.stationLayer);
  if (feature) {
    /* eslint-disable camelcase */
    const { authority, state, data, ms_nr, ...rest } = feature.properties;
    return {
      id: `${state}-${ms_nr}`,
      ms_nr,
      state: statesByIso[state],
      authority: statesByIso[authority],
      data: JSON.parse(data.replaceAll("nan", "null")), // FIXME
      ...rest,
    };
  }
  return null;
}
