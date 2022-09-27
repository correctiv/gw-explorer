import React, { useState } from "react";
import styled from "@emotion/styled";

import DataExportModal from "components/DataExportModal";

import { BsReplyFill, BsCameraFill, BsDownload } from "react-icons/bs";

const ToolbarWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  width: max-content;
  padding: 13px 10px;
  background: ${(props) => (props.highlighted ? "#fde162" : "transparent")};
  border-radius: 2px;
  color: #33333;
  border: 1px solid
    ${(props) => (props.highlighted ? "#fde162" : "transparent")};
  font-size: 15px;
  line-height: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
  &:hover {
    transition: 0.2s;
    background: ${(props) => (props.highlighted ? "transparent" : "#333")};
    color: ${(props) => (props.highlighted ? "black" : "#f8f8f8")};
    border: 1px solid ${(props) => (props.highlighted ? "#cecece" : "#333")};
  }
`;

const ButtonText = styled.span`
  margin-left: 7px;
`;

function Toolbar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <ToolbarWrapper id="toolbar-wrapper">
        <Button highlighted id="teilen">
          <BsReplyFill size={16} />
          <ButtonText>Teilen</ButtonText>
        </Button>
        <Button id="screenshot">
          <BsCameraFill size={16} />
          <ButtonText>Screenshot</ButtonText>
        </Button>
        <Button id="export" onClick={handleShow}>
          <BsDownload size={16} />
          <ButtonText>Rohdaten</ButtonText>
        </Button>
      </ToolbarWrapper>
      <DataExportModal show={show} handleClose={handleClose} />
    </>
  );
}

export default Toolbar;
