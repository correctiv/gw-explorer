import React, { useState, useRef } from "react";
import styled from "@emotion/styled";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";

import config from "~/config";

import ImageExportModal from "components/ImageExportModal";

import { BsInfoCircle, BsReplyFill, BsCameraFill } from "react-icons/bs";

const ToolbarWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
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
  @media (max-width: 768px) {
    display: ${(props) => (props.hideOnMobile ? "none" : "flex")};
  }
`;

const ShareButton = styled(Button)`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
  &:hover {
    transition: 0.2s;
    background: ${(props) => (props.highlighted ? "white" : "#333")};
    color: ${(props) => (props.highlighted ? "black" : "#f8f8f8")};
    border: 1px solid ${(props) => (props.highlighted ? "#cecece" : "#333")};
  }
`;

const ButtonText = styled.span`
  margin-left: 7px;
`;

const Methodology = styled.div`
  margin-top: 12px;
  color: #707070;
  font-size: 12px;
  width: 100%;
`;

function Toolbar({ mapRef, renderScreenshotButton }) {
  const [show, setShow] = useState({
    screenshot: false,
    teilen: false,
  });
  const [dataURL, setDataURL] = useState(null);
  const teilenRef = useRef(null);

  function handleClose(eventId) {
    setShow((prevState) => ({
      ...prevState,
      [eventId]: false,
    }));
  }

  function handleShow(eventId) {
    setShow((prevState) => ({
      ...prevState,
      [eventId]: true,
    }));
  }

  function screenshot(eventId) {
    /* eslint no-underscore-dangle: 0 */
    const canvas = mapRef.current._canvas;
    const url = canvas.toDataURL("png");
    setDataURL(url);
    handleShow(eventId);
  }

  function copyCurrentURL(eventId) {
    navigator.clipboard.writeText(window.location.href);
    handleShow(eventId);
    setTimeout(() => handleClose(eventId), 1000);
  }

  return (
    <>
      <ToolbarWrapper id="toolbar-wrapper">
        <ShareButton
          highlighted
          id="teilen"
          ref={teilenRef}
          onClick={(e) => copyCurrentURL(e.currentTarget.id)}
        >
          <BsReplyFill size={16} />
          <ButtonText>Teilen</ButtonText>
        </ShareButton>
        <Overlay
          target={teilenRef.current}
          show={show.teilen}
          placement="bottom"
        >
          {(props) => (
            /* eslint-disable react/jsx-props-no-spreading */
            <Tooltip id="teilen-confirm" {...props}>
              Link in Zwischenablage kopiert
            </Tooltip>
          )}
        </Overlay>
        {renderScreenshotButton ? (
          <Button
            id="screenshot"
            onClick={(e) => screenshot(e.currentTarget.id)}
          >
            <BsCameraFill size={16} />
            <ButtonText>Screenshot</ButtonText>
          </Button>
        ) : null}
      </ToolbarWrapper>
      <ImageExportModal
        show={show.screenshot && renderScreenshotButton}
        handleClose={() => handleClose("screenshot")}
        dataURL={dataURL}
        controlledBy="screenshot"
      />
      <Methodology id="methodology">
        <BsInfoCircle size={12} style={{ marginRight: 5, marginBottom: 2 }} />
        Rohdaten und Infos zur Methodik finden Sie
        <a
          className="correctiv-link"
          href={config.infoUrl}
          target="_blank"
          rel="noreferrer"
          style={{ marginLeft: 2 }}
        >
          hier
        </a>
        .
      </Methodology>
    </>
  );
}

export default Toolbar;
