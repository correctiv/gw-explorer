import React, { useReducer, useRef, createContext, useContext } from "react";
import config from "~/config";
import * as util from "components/Mapbox/util";
import { selectDistrictFromData } from "utils/data";
import { updateUrl } from "utils/url";

const actionTypes = {
  selectInitialStation: "select_initial_station",
  selectStation: "select_station",
  resetStation: "reset_station",
  selectDistrict: "select_district",
  hoverDistrict: "hover_district",
  updateTooltipPosition: "update_tooltip_position",
};

const getInitialState = () => {
  const { bbox, zoom, districtId, stationId } = util.getMapStateFromUrl();
  return {
    initialDistrictId: districtId,
    initialStationId: stationId,
    activeDistrict: null,
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
    // select initial station based on url
    case actionTypes.selectInitialStation: {
      const map = state.mapRef.current;
      const { id } = payload;
      const activeStation = util.findStation(map, id);
      const point = map.project(activeStation.coordinates);
      const [x, y] = util.getTooltopPosition({
        point,
        element: state.mapContainerRef.current,
      });
      return {
        ...state,
        activeStation,
        stationLock: true,
        tooltipPosition: [x, y],
      };
    }
    // select station on hover or click
    case actionTypes.selectStation: {
      const { station, lock } = payload;
      updateUrl({ station: station.id });
      return { ...state, activeStation: station, stationLock: lock };
    }
    case actionTypes.resetStation: {
      return { ...state, activeStation: null, stationLock: false };
    }
    case actionTypes.selectDistrict: {
      const currentId = state.activeDistrict?.id;
      const { id, flyTo } = payload;
      if (currentId !== id) {
        const map = state.mapRef.current;
        const district = selectDistrictFromData({ id });
        util.handleDistrictHighlight(map, { currentId, newId: id });
        if (flyTo) {
          const [s, w, n, e] = district.bbox;
          map.fitBounds([
            [s, w],
            [n, e],
          ]);
        }
        updateUrl({ district: district.id });
        return {
          ...state,
          activeDistrict: district,
          activeStation: null,
          stationLock: false,
        };
      }
      return state;
    }
    case actionTypes.updateTooltipPosition: {
      const { point } = payload;
      const [x, y] = util.getTooltopPosition({
        point,
        element: state.mapContainerRef.current,
      });
      return { ...state, tooltipPosition: [x, y] };
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
      updateTooltipPosition: (payload) =>
        dispatch({
          action: actionTypes.updateTooltipPosition,
          payload,
        }),
    },
  };
}

export { actionTypes };
