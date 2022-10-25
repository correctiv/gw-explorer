import React, {
  useReducer,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";
import config from "~/config";
import * as util from "components/Mapbox/util";
import { selectDistrictFromData } from "utils/data";
import { updateUrl } from "utils/url";
import events, { publish, subscribe } from "./events";

const actionTypes = {
  setMapReady: "set_map_ready",
  selectInitialStation: "select_initial_station",
  selectStation: "select_station",
  resetStation: "reset_station",
  selectDistrict: "select_district",
  hoverDistrict: "hover_district",
  resetDistrict: "reset_district",
  adjustDistrictView: "adjust_district_view",
  updateTooltipPosition: "update_tooltip_position",
  resetMapView: "reset_map_view",
};

const getInitialState = () => {
  const { bbox, zoom, districtId, stationId } = util.getMapStateFromUrl();
  return {
    mapReady: false,
    initialDistrictId: districtId,
    initialStationId: stationId,
    hoverDistrictId: null,
    activeDistrict: null,
    districtIsAdjusted: false,
    activeStation: null,
    stationLock: false,
    tooltipPosition: [0, 0],
    bbox: bbox || config.mapbox.bounds,
    zoom: zoom || config.mapbox.zoom,
    mapContainerRef: useRef(null),
    mapRef: useRef(null),
  };
};

const reducer = (state, { action, payload }) => {
  switch (action) {
    // set map ready on initial load
    case actionTypes.setMapReady: {
      // first time it is ready:
      if (!state.mapReady) publish(events.mapFirstReady);
      return {
        ...state,
        initialStationId: null,
        initialDistrictId: null,
        mapReady: true,
      };
    }
    // select initial station based on url
    case actionTypes.selectInitialStation: {
      const map = state.mapRef.current;
      const { id } = payload;
      const activeStation = util.findStation(map, id);
      let tooltipPosition = [0, 0];
      if (activeStation) {
        const point = map.project(activeStation.coordinates);
        tooltipPosition = util.getTooltopPosition({
          point,
          element: state.mapContainerRef.current,
        });
        util.handleStationHighlight(map, { newId: activeStation.id });
      }
      return {
        ...state,
        activeStation,
        stationLock: true,
        tooltipPosition,
      };
    }
    // select station
    case actionTypes.selectStation: {
      const map = state.mapRef.current;
      const { activeStation } = state;
      const { station, lock } = payload;
      updateUrl({ station: station.id });
      util.handleStationHighlight(map, {
        currentId: activeStation?.id,
        newId: station.id,
      });
      return { ...state, activeStation: station, stationLock: lock };
    }
    // reset station
    case actionTypes.resetStation: {
      const map = state.mapRef.current;
      const { activeStation } = state;
      if (activeStation) {
        util.handleStationHighlight(map, { currentId: activeStation.id });
        updateUrl({ station: null });
      }
      return { ...state, activeStation: null, stationLock: false };
    }
    // select district
    case actionTypes.selectDistrict: {
      const currentId = state.activeDistrict?.id;
      const { id, adjusted } = payload;
      if (currentId !== id) {
        const map = state.mapRef.current;
        const district = selectDistrictFromData({ id });
        if (district) {
          util.handleDistrictHighlight(map, {
            currentId,
            newId: id,
            status: "highlight",
          });
          util.handleStationHighlight(map, {
            currentId: state.activeStation?.id,
          });
          updateUrl({
            district: district.id,
            station: null,
          });
          return {
            ...state,
            activeDistrict: district,
            districtIsAdjusted: !!adjusted,
            activeStation: null,
            stationLock: false,
          };
        }
        return state;
      }
      return state;
    }
    // highlight district
    case actionTypes.hoverDistrict: {
      const map = state.mapRef.current;
      const currentId = state.hoverDistrictId;
      const newId = payload.id;
      util.handleDistrictHighlight(map, { currentId, newId, status: "hover" });
      return { ...state, hoverDistrictId: newId };
    }
    // fit map to district bounds
    case actionTypes.adjustDistrictView: {
      const map = state.mapRef.current;
      const { activeDistrict } = state;
      if (activeDistrict) {
        const [s, e, n, w] = activeDistrict.bbox;
        map.fitBounds([
          [s, e],
          [n, w],
        ]);
        return { ...state, districtIsAdjusted: true };
      }
      return state;
    }
    // reset active district
    case actionTypes.resetDistrict: {
      const map = state.mapRef.current;
      const { activeDistrict } = state;
      util.handleDistrictHighlight(map, {
        currentId: activeDistrict?.id,
        status: "highlight",
      });
      updateUrl({ district: null, station: null });
      return { ...state, activeDistrict: null, activeStation: null };
    }
    // track tooltip
    case actionTypes.updateTooltipPosition: {
      const { point } = payload;
      const [x, y] = util.getTooltopPosition({
        point,
        element: state.mapContainerRef.current,
      });
      return { ...state, tooltipPosition: [x, y] };
    }
    case actionTypes.resetMapView: {
      const map = state.mapRef.current;
      const [s, e, n, w] = config.mapbox.germanyBbox;
      map.fitBounds([
        [s, e],
        [n, w],
      ]);
      return state;
    }
    default: {
      throw Error(`Unknown action: ${action}`);
    }
  }
};

const StateContext = createContext(null);
const DispatchContext = createContext(null);

export default function ContextProvider({ children }) {
  const initialState = getInitialState();
  const [state, dispatch] = useReducer(reducer, initialState);

  // subscribe global events
  useEffect(() => {
    subscribe(events.resetMapView, () => {
      dispatch({ action: actionTypes.resetMapView });
      dispatch({ action: actionTypes.resetStation });
    });
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function useStore() {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  return {
    state,
    actions: {
      setMapReady: () => dispatch({ action: actionTypes.setMapReady }),
      selectInitialStation: (payload) =>
        dispatch({ action: actionTypes.selectInitialStation, payload }),
      selectStation: (payload) =>
        dispatch({ action: actionTypes.selectStation, payload }),
      resetStation: () => dispatch({ action: actionTypes.resetStation }),
      selectDistrict: (payload) =>
        dispatch({
          action: actionTypes.selectDistrict,
          payload,
        }),
      hoverDistrict: (payload) =>
        dispatch({ action: actionTypes.hoverDistrict, payload }),
      adjustDistrictView: () =>
        dispatch({ action: actionTypes.adjustDistrictView }),
      resetDistrict: () => dispatch({ action: actionTypes.resetDistrict }),
      updateTooltipPosition: (payload) =>
        dispatch({
          action: actionTypes.updateTooltipPosition,
          payload,
        }),
    },
  };
}

export { actionTypes };
