import mapboxgl from "mapbox-gl";

import Geocoder from "components/Geocoder";
import config from "config";
import { actions } from "store";
import { ResetControl } from "./controls";
import addLayers from "./layers";
import { getMapStateFromUrl } from "./util";

export default function initMap({ container, standaloneMode }) {
  // init map
  mapboxgl.accessToken = config.mapbox.token;

  const { bbox, zoom } = getMapStateFromUrl();
  const map = new mapboxgl.Map({
    container,
    style: config.mapbox.style, // style URL
    center: config.mapbox.center, // starting position [lng, lat]
    bounds: bbox || config.mapbox.bounds,
    maxBounds: config.mapbox.bounds, // restrict to germany
    zoom: zoom || config.mapbox.zoom,
    preserveDrawingBuffer: true,
    cooperativeGestures: !standaloneMode,
  });

  // update current point on click
  map.on("click", actions.handleClick);

  // update current point on move
  map.on("mousemove", actions.handleMove);

  // track ready state
  map.on("data", actions.setMapReady);

  map.on("load", () => {
    // add districts and station layer
    addLayers(map);
  });

  // Add zoom and rotation controls to the map.
  map.addControl(new ResetControl(), "bottom-right");
  map.addControl(
    new mapboxgl.NavigationControl({ showCompass: false }),
    "bottom-right"
  );

  // update map state
  map.on("moveend", actions.handleMoveEnd);

  // reset station on zoom change
  map.on("zoomend", actions.onZoom);

  // add geocoder to sidebar element
  const geocoder = Geocoder({ mapboxgl });
  geocoder.on("result", actions.handleSearchResult);
  document
    .getElementById("gw-explorer-geocoder")
    .appendChild(geocoder.onAdd(map));

  return { map, geocoder };
}
