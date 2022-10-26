import React from "react";
import styled from "@emotion/styled";
import { useStoreState } from "easy-peasy";

import { device } from "utils/css-utils";
import DataOverview from "components/DataOverview";
import Toolbar from "components/Toolbar";

const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  // align-items: flex-start;
  align-content: flex-start;
  flex-flow: row wrap;
  flex: 0 0 auto;
  background-color: white;
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
  line-height: 1.2;
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
  const mapRef = useStoreState((s) => s.mapRef);

  return (
    <SidebarWrapper id="sidebar">
      <SidebarHeader id="sidebar-header">
        Der Grundwasserspiegel in Ihrem Kreis
      </SidebarHeader>
      <Searchbar id="gw-explorer-geocoder" />
      <DataOverview id="infobox" />
      <Toolbar
        mapRef={mapRef}
        renderScreenshotButton={renderScreenshotButton}
      />
    </SidebarWrapper>
  );
}

export default Sidebar;
