import React from "react";
import styled from "@emotion/styled";
import Modal from "react-bootstrap/Modal";

const ModalHeader = styled(Modal.Header)`
  flex-wrap: wrap;
  flex-direction: row;
`;

const ModalTitle = styled.h2`
  font-weight: 700;
  font-size: 23px;
  line-height: 120%;
  margin-bottom: 4px;
`;

const ModalSubtitle = styled.div`
  font-weight: 400;
  margin-top: 5px;
  font-size: 17px;
  line-height: 24px;
  width: 100%;
  order: 3;
`;

const ModalSection = styled(Modal.Body)`
  border-bottom: 1px solid #e6e6e6;
`;

const ModalSectionHeader = styled.h3`
  font-weight: 700;
  font-size: 15px;
  line-height: 150%;
  margin-bottom: 12px;
`;

const ModalText = styled.h3`
  font-size: 15px;
  line-height: 22px;
`;

const ModalFooter = styled(Modal.Footer)`
  border-top: none;
  justify-content: flex-start;
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

const ImageWrapper = styled.img`
  width: 100%;
  height: auto;
`;

function ImageExportModal({ dataURL, handleClose, show }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <ModalHeader closeButton>
        <ModalTitle>Image Export</ModalTitle>
        <ModalSubtitle>
          Laden Sie eine PNG-Datei mit Ihrer aktuellen Kartenansicht herunter.
        </ModalSubtitle>
      </ModalHeader>
      <ModalSection id="export-preview">
        <ImageWrapper src={dataURL} />
      </ModalSection>
      <ModalSection id="image-attribute">
        <ModalSectionHeader>
          Bei der Veröffentlichung des folgenden Bildes verwenden Sie bitte das
          folgende Attribut:
        </ModalSectionHeader>
        <ModalText>
          © Mapbox, © OpenStreetMap / Datenauswertung von CORRECTIV.Lokal
        </ModalText>
      </ModalSection>
      <ModalFooter>
        <a href={dataURL} download="gw-explorer-screenshot">
          <Button id="herunterladen" highlighted onClick={handleClose}>
            Herunterladen
          </Button>
        </a>
        <Button bordered id="abbrechen" onClick={handleClose}>
          Abbrechen
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ImageExportModal;
