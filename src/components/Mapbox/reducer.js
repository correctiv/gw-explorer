import config from "~/config";
import { statesByIso, statesById } from "~/utils/labels";

const getFeatureFromLayer = (features, layer) => {
  const layerFeatures = features.filter((f) => f.layer.id === layer);
  return layerFeatures.length ? layerFeatures[0] : null;
};

export function selectDistrict(features) {
  const feature = getFeatureFromLayer(features, config.mapbox.districtLayer);
  if (feature) {
    const { id, bez, name, data } = feature.properties;
    return {
      id,
      name,
      // bez: districtBez[bez],
      bez,
      state: statesById[id.slice(0, 2)],
      data: JSON.parse(data),
    };
  }
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
