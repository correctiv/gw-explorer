/* eslint-disable import/prefer-default-export */
import styled from "@emotion/styled";

const Button = styled.button`
  cursor: ${(props) => (props.disabled ? "default" : "pointer")} !important;
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
  ${(props) =>
    props.disabled
      ? ""
      : `&:hover {
    transition: 0.2s;
    background: ${props.highlighted ? "transparent" : "#333"};
    color: ${props.highlighted ? "black" : "#f8f8f8"};
    border: 1px solid ${props.highlighted ? "#cecece" : "#333"};
  }`}
  @media (max-width: 768px) {
    display: ${(props) => (props.hideOnMobile ? "none" : "flex")};
  }
`;

export { Button };
