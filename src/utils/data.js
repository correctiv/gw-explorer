/* eslint-disable import/prefer-default-export */
import districts from "data/districts.csv";
import { districtBez, statesById, slopeBin } from "./labels";

const NUMERIC_COLS = [...Object.keys(slopeBin), "total"];

export function selectDistrictFromData({ id }) {
  const district = districts.find((d) => d.id === id);
  if (district) {
    const { bez, bbox, center, ...data } = district;
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
  return null;
}
