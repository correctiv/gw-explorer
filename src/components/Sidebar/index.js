import React from "react";
import styled from "@emotion/styled";
import { BsInfoCircle } from "react-icons/bs";

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
  overflow: scroll;
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

const Methodology = styled.div`
  margin-top: 12px;
  color: #707070;
  font-size: 12px;
  width: 100%;
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
      <Methodology id="methodology">
        <BsInfoCircle size={12} style={{ marginRight: 5, marginBottom: 2 }} />
        Mehr über unsere Methodik finden Sie
        <a
          href="https://docs.google.com/document/d/1KBkkQWtV4j7D486uRdF6k3QwJfkysG7U9UrT6VfaOG0/edit#heading=h.r3fpt61lzy2c"
          target="_blank"
          rel="noreferrer"
          style={{ marginLeft: 2 }}
        >
          hier
        </a>
        .
      </Methodology>
      <Toolbar mapRef={mapRef} />
    </SidebarWrapper>
  );
}

export default Sidebar;
