const config = {
  mapbox: {
    token:
      "pk.eyJ1IjoiY29ycmVjdGl2LW1hcGJveCIsImEiOiJjbDllOGhsdDIxa3oyM3dxdDkwajJ4dmh4In0.aRVZgaXG7AwgWyLDvNCYLg",
    style: "mapbox://styles/correctiv-mapbox/cl9efy1v3005c15lapfnrulyk",
    center: [10.565834, 51.145661],
    // bounds: [5.86625035, 47.2701236, 15.04181566, 55.05877772],
    bounds: [-0.7, 46.3, 22, 55.5],
    zoom: 6,
    layers: ["messstellen-trends-timeseries", "districts"],
    districtLayer: "districts",
    districtLayerOutline: "districts-outline",
    districtSource: "mapbox://correctiv-mapbox.3drmx64j",
    districtSourceLayer: "districts-6s4e28",
    stationLayer: "messstellen-trends-timeseries",
  },
};

export default config;
