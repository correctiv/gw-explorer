/* eslint-disable no-underscore-dangle */
import mapboxgl from "mapbox-gl";
import { createStore, action, actionOn, thunk, thunkOn } from "easy-peasy";

import config from "config";
import * as mapUtil from "components/Mapbox/util";
import { selectDistrictFromData } from "utils/data";
import { updateUrl } from "utils/url";

// accessible in app
const publicState = {
  activeDistrict: null,
  districtIsAdjusted: false,
  activeStation: null,
  tooltipPosition: [0, 0],
  mapContainerRef: null,
  mapRef: null,
};

// triggered by user interaction / by app
const publicActions = {
  // track initial ready state
  setMapReady: thunk((actions, payload, { getState }) => {
    const state = getState();
    const map = state.mapRef.current;
    const ready = mapUtil.getMapReadyState(map);
    if (ready && !state._mapReady) {
      // map is ready first time and we initialize it
      actions._setMapIsReady();
      actions._initializeMap();
    }
  }),

  // handle moving around: change districts outline and display stations
  handleMove: thunk((actions, { point }, { getState }) => {
    const state = getState();
    const map = state.mapRef.current;
    if (!state._stationLock) {
      // update station
      const station = mapUtil.getCurrentStation(map, point);
      if (station) {
        actions._setActiveStation({ station });
      } else {
        actions.resetStation();
      }
    }
    const id = mapUtil.getCurrentDistrictId(map, point);
    actions._hoverDistrict({ id });
  }),

  // handle clicks: change districts data and lock station tooltip
  handleClick: thunk((actions, { point }, { getState }) => {
    const state = getState();
    const map = state.mapRef.current;
    const station = mapUtil.getCurrentStation(map, point);
    if (station) {
      actions._setActiveStation({ station, lock: true });
    }
    const id = mapUtil.getCurrentDistrictId(map, point);
    actions._setActiveDistrict({ id });
  }),

  // on geocoder search result
  handleSearchResult: thunk((actions, { result }, { getState }) => {
    actions.resetDistrict();
    const { id } = result;
    actions._setActiveDistrict({ id, adjusted: true });
    const state = getState();
    const map = state.mapRef.current;
    const marker = map._markers[0];
    if (state.activeDistrict) {
      marker.remove();
      actions._setCurrentMarker({ marker: null });
    } else {
      marker
        .setPopup(new mapboxgl.Popup().setText(result.place_name_de))
        .togglePopup();
      actions._setCurrentMarker({ marker });
    }
  }),

  // update things after map was moving around
  handleMoveEnd: thunk((actions, target, { getState }) => {
    const state = getState();
    const map = state.mapRef.current;
    mapUtil.updateUrlMapState(map);
    if (state._currentMarker && !state.activeDistrict) {
      // we had a search result we flew to, now we check for underlying district
      const point = state._currentMarker._pos;
      const id = mapUtil.getCurrentDistrictId(map, point);
      actions._setActiveDistrict({ id });
    }
    if (state.activeStation) {
      // replace tooltip position
      const element = state.mapContainerRef.current;
      const point = map.project(state.activeStation.coordinates);
      const position = mapUtil.getTooltipPosition({ element, point });
      actions._setTooltipPosition({ position });
    }
  }),

  // reset active station (hide tooltip)
  resetStation: action((state) => {
    const map = state.mapRef.current;
    const id = state._stationId;
    if (id) {
      mapUtil.unhighlightStation(map, id);
      state.activeStation = null;
      state._stationId = null;
      state._stationLock = false;
      updateUrl({ station: null });
    }
  }),

  // reset active district
  resetDistrict: action((state) => {
    const map = state.mapRef.current;
    const districtId = state._districtId;
    mapUtil.unhighlightDistrict(map, districtId, "highlight");
    mapUtil.unhighlightDistrict(map, districtId, "hover");
    state.activeDistrict = null;
    state.districtIsAdjusted = false;
    state._districtId = null;
    state._hoverDistrictId = null;
    state._stationLock = false;
    updateUrl({ district: null });
  }),

  // fit map to active district
  adjustDistrictView: action((state) => {
    if (!state._districtIsAdjusted && state.activeDistrict) {
      const map = state.mapRef.current;
      map.fitBounds(state.activeDistrict.bounds);
      state.districtIsAdjusted = true;
    }
  }),

  // reset map view (zoom out)
  resetMapView: action((state) => {
    const map = state.mapRef.current;
    map.fitBounds(config.mapbox.germanyBbox);
  }),

  // apply elements after creation to reference globally
  setRefs: action((state, { mapRef, mapContainerRef, geocoder }) => {
    state._geocoder = geocoder;
    state.mapRef = mapRef;
    state.mapContainerRef = mapContainerRef;
  }),

  // fired on map zoom
  onZoom: thunk((actions) => {
    actions.resetStation();
  }),
};

const privateState = {
  _mapReady: false,
  _districtId: null,
  _stationId: null,
  _hoverDistrictId: null,
  _stationLock: false,
  _currentMarker: null,
};

// listeners to public ations
const privateActions = {
  // reset station on district / view reset
  _onReset: thunkOn(
    (a) => [a.resetDistrict, a.adjustDistrictView, a.resetMapView],
    (actions) => actions.resetStation()
  ),

  // triggered by logic

  _setActiveDistrict: action((state, { id, adjusted }) => {
    const district = selectDistrictFromData({ id });
    const oldId = state._districtId;
    if (district && oldId !== district.id) {
      state.activeDistrict = district;
      state.districtIsAdjusted = !!adjusted;
      state._districtId = district.id;
      const map = state.mapRef.current;
      mapUtil.unhighlightDistrict(map, oldId, "highlight");
      mapUtil.highlightDistrict(map, id, "highlight");
      updateUrl({ district: id });
    }
  }),

  _setActiveStation: action((state, { station, lock }) => {
    const map = state.mapRef.current;
    const oldId = state._stationId;
    const { id } = station;
    if (oldId !== id || !!lock) {
      const point = map.project(station.coordinates);
      state.tooltipPosition = mapUtil.getTooltipPosition({
        point,
        element: state.mapContainerRef.current,
      });
      state.activeStation = station;
      state._stationId = id;
      state._stationLock = !!lock;
      mapUtil.unhighlightStation(map, oldId);
      mapUtil.highlightStation(map, id);
      updateUrl({ station: id });
    }
  }),

  // handling map state
  _hoverDistrict: action((state, { id }) => {
    const map = state.mapRef.current;
    const oldId = state._hoverDistrictId;
    if (oldId !== id) {
      mapUtil.unhighlightDistrict(map, oldId, "hover");
      mapUtil.highlightDistrict(map, id, "hover");
      state._hoverDistrictId = id;
    }
  }),

  _setCurrentMarker: action((state, { marker }) => {
    state._currentMarker = marker;
  }),

  _setTooltipPosition: action((state, { position }) => {
    state.tooltipPosition = position;
  }),

  // listeners for state changes
  _handleDistrictIsAdjusted: actionOn(
    (a) => [a.onZoom, a.resetDistrict, a.resetMapView],
    (state) => {
      state.districtIsAdjusted = false;
    }
  ),

  // map initialization
  _setMapIsReady: action((state) => {
    state._mapReady = true;
  }),
  _initializeMap: thunk((actions, payload, { getState }) => {
    const state = getState();
    const map = state.mapRef.current;
    const { stationId, districtId } = mapUtil.getMapStateFromUrl();
    if (districtId) {
      actions._setActiveDistrict({ id: districtId });
    }
    if (stationId) {
      const station = mapUtil.findStation(map, stationId);
      if (station) {
        actions._setActiveStation({ station, lock: true });
      }
    }
  }),
};

const store = createStore({
  ...publicState,
  ...publicActions,
  ...privateState,
  ...privateActions,
});

export default store;

const actions = { ...store.getActions() };
export { actions };
