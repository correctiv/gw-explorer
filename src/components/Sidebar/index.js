import React from "react";
import styled from "@emotion/styled";
import { device } from "utils/css-utils";

import DataOverview from "~/components/DataOverview";
import Toolbar from "~/components/Toolbar";
import { useStore } from "reducer";

const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: wrap;
  flex: 0 0 auto;
  ${device.phone} {
    width: 100%;
    height: max-content;
    overflow: auto;
    padding: 25px;
  }
  ${device.tablet} {
    padding: 30px;
    width: 380px;
    height: 100%;
    overflow: scroll;
  }
  order: 0;
`;

const SidebarHeader = styled.h2`
  font-size: 23px;
  font-weight: 700;
  margin: 0px 0px 30px 0px;
  padding: 0;
`;

const Searchbar = styled.div`
  width: 100%;
  padding-bottom: 30px;
`;

function Sidebar({ renderScreenshotButton }) {
  // geocoder is added in `components/Mapbox/index.js`
  const {
    state: { activeDistrict, mapRef },
  } = useStore();

  return (
    <SidebarWrapper id="sidebar">
      <SidebarHeader id="sidebar-header">
        Der Grundwasserspiegel in Ihrem Kreis
      </SidebarHeader>
      <Searchbar id="gw-explorer-geocoder" />
      <DataOverview id="infobox" activeDistrict={activeDistrict} />
      <Toolbar
        mapRef={mapRef}
        renderScreenshotButton={renderScreenshotButton}
      />
    </SidebarWrapper>
  );
}

export default Sidebar;
