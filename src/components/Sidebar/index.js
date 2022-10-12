import React from "react";
import styled from "@emotion/styled";

import DataOverview from "~/components/DataOverview";
import Toolbar from "~/components/Toolbar";

const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 40px 30px 30px 30px;
  width: 380px;
  height: 100%;
  @media (max-width: 768px) {
    width: 100%;
    height: max-content;
  }
  flex: none;
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
  margin-bottom: 30px;
`;

function Sidebar({ activeKreis, mapRef }) {
  // geocoder is added in `components/Mapbox/index.js`
  return (
    <SidebarWrapper id="sidebar">
      <SidebarHeader id="sidebar-header">
        Der Grundwasserspiegel in Ihrem Kreis
      </SidebarHeader>
      <Searchbar id="gw-explorer-geocoder" />
      <DataOverview id="infobox" activeKreis={activeKreis} />
      <Toolbar mapRef={mapRef} />
    </SidebarWrapper>
  );
}

export default Sidebar;
