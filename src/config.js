const config = {
  mapbox: {
    token:
      "pk.eyJ1Ijoic2ltb253b2VycGVsIiwiYSI6ImNqMHA0cGY4eDAwd3QzMm1yZm9yY3c0cWUifQ.78weiiM4vcLanNNg-v7EBA",
    style: "mapbox://styles/simonwoerpel/cl7um4n0u007i14kbdlzl0f2x",
    center: [10.565834, 51.145661],
    bounds: [5.86625035, 47.2701236, 15.04181566, 55.05877772],
    zoom: 6,
    layers: ["messstellen-trends-timeseries", "districts"],
    districtLayer: "districts",
    districtSource: "mapbox://simonwoerpel.1swa7nuo",
    districtSourceLayer: "VG250_KRS_with_summaries-b3rb6g",
    stationLayer: "messstellen-trends-timeseries",
  },
};

export default config;
