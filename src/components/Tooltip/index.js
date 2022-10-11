import React from "react";
import styled from "@emotion/styled";
import Badge from "react-bootstrap/Badge";
import CloseButton from "react-bootstrap/CloseButton";
import { slopeBinColorClass } from "utils/labels";
import * as d3 from "~/lib/d3";

import theme from "style/theme";
import Chart from "./Chart";

const TooltipWrapper = styled.div`
  position: absolute;
  margin-top: -20px;
  margin-left: 20px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  gap: 5px;
  width: 340px;
  min-height: 200px;
  background: #ffffff;
  border: 1px solid #e6e6e6;
  box-shadow: ${theme.boxShadow};
`;

const TooltipHeader = styled.header`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

const StateName = styled.h4`
  font-size: 14px;
  color: grey;
  text-transform: uppercase;
  margin: 0;
`;

const DistrictName = styled.h3`
  font-weight: 700;
  font-size: 20px;
  line-height: 150%;
  color: #333333;
  margin: 0;
`;

const Slope = styled(Badge)`
  background-color: ${(props) =>
    props.theme.colors[slopeBinColorClass[props.bin]]} !important;
  font-size: 18px;
  color: #333; // need to make white above certain saturdation
  height: max-content;
`;

const Close = styled(CloseButton)`
  position: absolute;
  top: 10px;
  right: 10px;
`;

// format locale
d3.formatDefaultLocale({
  decimal: ",",
});

const slopeFormat = d3.format(".2f");

function Tooltip({ activeStation, resetStation, position }) {
  const [left, top] = position;

  return activeStation ? (
    <TooltipWrapper style={{ top, left }}>
      <Close onClick={resetStation} />
      <StateName>{activeStation.state}</StateName>
      <TooltipHeader>
        <DistrictName>{activeStation.district}</DistrictName>
        <Slope bin={activeStation.bin}>
          {slopeFormat(activeStation.slope)} %/Jahr
        </Slope>
      </TooltipHeader>
      <span>Messstelle {activeStation.ms_nr}</span>
      <Chart data={activeStation.data} />
    </TooltipWrapper>
  ) : null;
}

export default Tooltip;
