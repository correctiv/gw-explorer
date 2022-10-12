import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { districtBez } from "~/utils/labels";
import districts from "~/data/districts_search.csv";

const districtsData = {
  features: districts.map((f) => ({
    type: "Feature",
    properties: {
      id: f.id,
      name: f.name,
    },
    geometry: {
      coordinates: f.center.split(",").map(parseFloat),
      type: "Point",
    },
    text: f.name,
    text_de: f.name,
    place_name: `${f.name} (${districtBez[f.bez]})`,
    place_name_de: `${f.name} (${districtBez[f.bez]})`,
    place_type: ["district"],
    center: f.center.split(",").map(parseFloat),
    bbox: f.bbox.split(",").map(parseFloat),
    search: f.search,
  })),
};

// https://docs.mapbox.com/mapbox-gl-js/example/forward-geocode-custom-data/
const localGeocoder = (query) =>
  districtsData.features.filter(({ search }) =>
    search.includes(query.toLowerCase())
  );

export default function Geocoder({ mapboxgl }) {
  return new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl,
    countries: "de",
    language: "de",
    types: "district,postcode,place",
    zoom: 12,
    marker: false,
    localGeocoderOnly: true,
    localGeocoder,
  });
}
