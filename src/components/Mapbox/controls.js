import React from "react";
import ReactDOM from "react-dom";
import styled from "@emotion/styled";
import { BsArrowsAngleExpand } from "react-icons/bs";
import events, { publish } from "reducer/events";

const Button = styled.button`
  width: 29px;
  height: 29px;
  display: block;
  padding: 0;
  outline: none;
  border: 0;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: white;
  box-shadow: 0 0 0 2px rgb(0 0 0/10%);
  cursor: pointer;
  overflow: hidden;
  &:hover {
    background-color: #eee !important;
  }
`;

function ResetButton() {
  return (
    <Button onClick={() => publish(events.resetMapView)}>
      <BsArrowsAngleExpand size={20} />
    </Button>
  );
}

/* eslint-disable import/prefer-default-export */
export class ResetControl {
  onAdd(map) {
    this.map = map;
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl mapbox-ctrl-group";
    ReactDOM.render(<ResetButton />, this.container);
    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
}
