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

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  line-height: 1.8em;
`;

const RadioLabel = styled.label`
  font-size: 15px;
  &.disabled {
    color: #707070;
  }
`;

const RadioInput = styled.input`
  margin-right: 8px;
`;

const DataElementWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
`;

const DataElement = styled.div`
  width: 50%;
  font-size: 15px;
  line-height: 1.8em;
`;

function RadioButton({ option, disabled, text }) {
  const exportDescription = text ? `(${text})` : "";

  return (
    <RadioLabel
      htmlFor={option.toLowerCase()}
      className={disabled ? "disabled" : ""}
    >
      <RadioInput
        type="radio"
        name="select-export-geography"
        id={`radio-option-${option.toLowerCase()}`}
        disabled={disabled}
      />
      {option} {exportDescription}
    </RadioLabel>
  );
}

function DataExportModal({ activeKreis, handleClose, show }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <ModalHeader closeButton>
        <ModalTitle>Download</ModalTitle>
        <ModalSubtitle>Rohdaten als CSV-Datei</ModalSubtitle>
      </ModalHeader>
      <ModalSection id="export-geography">
        <ModalSectionHeader>Datensatz</ModalSectionHeader>
        <Form>
          <RadioButton
            option="Kreis"
            disabled={activeKreis === null}
            text={activeKreis === null ? "keine Auswahl" : activeKreis.name}
          />
          <RadioButton
            option="Bundesland"
            disabled={activeKreis === null}
            text={activeKreis === null ? "keine Auswahl" : activeKreis.name}
          />
          <RadioButton option="Deutschland" disabled={false} />
        </Form>
      </ModalSection>
      <ModalSection id="data-description">
        <ModalSectionHeader>Einträge</ModalSectionHeader>
        <DataElementWrapper id="export-item-wrapper">
          <DataElement>Messstelle-ID</DataElement>
          <DataElement>Messstelle-Name</DataElement>
          <DataElement>Längengrad (EPSG:4326)</DataElement>
          <DataElement>Breitengrad (EPSG:4326)</DataElement>
          <DataElement>Bundesland</DataElement>
          <DataElement>Behörde</DataElement>
          <DataElement>Kreis</DataElement>
          <DataElement>Trend (Prozent/Jahr)</DataElement>
          <DataElement>Klassifizierung</DataElement>
        </DataElementWrapper>
      </ModalSection>
      <ModalFooter>
        <Button highlighted onClick={handleClose}>
          Download
        </Button>
        <Button bordered id="abbrechen" onClick={handleClose}>
          Abbrechen
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default DataExportModal;
