import theme from "style/theme";
import config from "config";

const DistrictStyle = {
  source: `${config.mapbox.districtLayer}-source`,
  sourceLayer: config.mapbox.districtSourceLayer,
};

const StationStyle = {
  source: `${config.mapbox.stationLayer}-source`,
  sourceLayer: config.mapbox.stationSourceLayer,
};

export { DistrictStyle, StationStyle };

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

export default function addLayers(map) {
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
