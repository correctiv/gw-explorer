import React, { useState } from "react";
import styled from "@emotion/styled";
import { BsInfoCircle, BsCameraFill } from "react-icons/bs";
import config from "config";
import { Button } from "components/common";
import ImageExportModal from "components/ImageExportModal";

const ToolbarWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const ButtonText = styled.span`
  margin-right: 7px;
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
  });
  const [dataURL, setDataURL] = useState(null);

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

  return (
    <>
      <ToolbarWrapper id="toolbar-wrapper">
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
