import React from "react";
import styled from "@emotion/styled";

import { BsReplyFill, BsCameraFill, BsDownload } from "react-icons/bs";

const ToolbarWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
`;

const Button = styled.button`
  flex: 1 1 0;
  padding: 13px 0px;
  background: ${(props) => (props.highlighted ? "#fde162" : "none")};
  border-radius: 2px;
  border: none;
  font-size: 15px;
  line-height: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: space-between;
  justify-content: center;
`;

const ButtonText = styled.span`
  margin-left: 7px;
`;

function Toolbar() {
  return (
    <ToolbarWrapper id="toolbar-wrapper">
      <Button highlighted id="teilen">
        <BsReplyFill size={16} />
        <ButtonText>Teilen</ButtonText>
      </Button>
      <Button id="screenshot">
        <BsCameraFill size={16} />
        <ButtonText>Screenshot</ButtonText>
      </Button>
      <Button id="export">
        <BsDownload size={16} />
        <ButtonText>Rohdaten</ButtonText>
      </Button>
    </ToolbarWrapper>
  );
}

export default Toolbar;
