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

const ModalSection = styled(Modal.Body)`
  border-bottom: 1px solid #e6e6e6;
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

function DataExportModal({ handleClose, show }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <ModalHeader closeButton>
        <ModalTitle>Daten herunterladen</ModalTitle>
      </ModalHeader>
      <ModalSection>
        In dieser Tabelle findest du die Rohdaten, die als Grundlage für das
        Karten-Tool dienen. Solltest du diese für eine journalistische
        Berichterstattung nutzen wollen, bitten wir dich Mitglied im Netzwerk
        CORRECTIV.Lokal zu werden. Dort erhältst du ein „Rezept“ mit allen
        Informationen, u.a. zur Nennung.
        <br style={{ marginBottom: 10 }} />
        Für Rückfragen: lokal [at] correctiv.org
      </ModalSection>
      <ModalFooter>
        <a
          href="https://docs.google.com/spreadsheets/d/1ij3MpAeL0dYWJ6mfz417XzOe_GNeKZCRQt2HYKTA-ok/edit#gid=1159051681"
          target="_blank"
          rel="noreferrer"
        >
          <Button id="daten" highlighted onClick={handleClose}>
            Zur Tabelle
          </Button>
        </a>
        <a href="https://correctiv.org/lokal/" target="_blank" rel="noreferrer">
          <Button id="mitglied">Mitglied werden</Button>
        </a>
        <Button bordered id="abbrechen" onClick={handleClose}>
          Abbrechen
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default DataExportModal;
