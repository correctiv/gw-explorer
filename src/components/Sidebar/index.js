import React from "react";
import styled from "@emotion/styled";

import Searchbar from "../Searchbar";

const SidebarElement = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 40px 30px 30px;
  gap: 40px;
  width: 380px;
  height: 791px;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
`;

const Infobox = styled.div`
  width: 100%;
`;

function Sidebar() {
  return (
    <SidebarElement id="sidebar">
      <h2>Der Grundwasserspiegel in Ihrem Kreis</h2>
      <Searchbar />
      <Infobox id="infobox">
        <div>Here some information about the tool.</div>
      </Infobox>
    </SidebarElement>
  );
}

export default Sidebar;
