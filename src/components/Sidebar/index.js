import React from "react";
import styled from "@emotion/styled";

import Searchbar from "../Searchbar";
import DataOverview from "../DataOverview";
import Toolbar from "../Toolbar";

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

function Sidebar({ activeKreis, setActiveKreis }) {
  return (
    <SidebarWrapper id="sidebar">
      <SidebarHeader id="sidebar-header">
        Der Grundwasserspiegel in Ihrem Kreis
      </SidebarHeader>
      <Searchbar activeKreis={activeKreis} setActiveKreis={setActiveKreis} />
      <DataOverview id="infobox" activeKreis={activeKreis} />
      <Toolbar />
    </SidebarWrapper>
  );
}

export default Sidebar;