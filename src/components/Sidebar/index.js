import React from "react";
import styled from "@emotion/styled";

import DataOverview from "~/components/DataOverview";
import Toolbar from "~/components/Toolbar";

const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 40px 30px 30px;
  width: 380px;
  height: 791px;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
`;

const SidebarHeader = styled.h2`
  font-size: 23px;
  font-weight: 700;
  margin: 0;
  padding: 0;
`;

function Sidebar({ activeKreis }) {
  // geocoder is added in `components/Mapbox/index.js`
  return (
    <SidebarWrapper id="sidebar">
      <SidebarHeader id="sidebar-header">
        Der Grundwasserspiegel in Ihrem Kreis
      </SidebarHeader>
      <div id="gw-explorer-geocoder" />
      <DataOverview id="infobox" activeKreis={activeKreis} />
      <Toolbar />
    </SidebarWrapper>
  );
}

export default Sidebar;
