import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

export default function Geocoder({ mapboxgl }) {
  return new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl,
    countries: "de",
    language: "de",
    zoom: 12,
    marker: true,
  });
}
