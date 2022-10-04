import React from "react";
import styled from "@emotion/styled";

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
`;

const TooltipHeader = styled.header`
  display: flex;
  flex-direction: row;
  gap: 30px;
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

const Slope = styled.h3`
  font-weight: 600;
  font-size: 20px;
  line-height: 150%;
  color: #f78c85;
  margin: 0;
`;

function Tooltip({ activeStation, position }) {
  const [left, top] = position;

  return activeStation ? (
    <TooltipWrapper style={{ top, left }}>
      <StateName>{activeStation.state}</StateName>
      <TooltipHeader>
        <DistrictName>{activeStation.district}</DistrictName>
        <Slope>{activeStation.slope}%/Jahr</Slope>
      </TooltipHeader>
      <span>Messstelle {activeStation.ms_nr}</span>
      <Chart data={activeStation.data} />
    </TooltipWrapper>
  ) : null;
}

export default Tooltip;
