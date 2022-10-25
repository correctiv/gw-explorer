import React from "react";
import styled from "@emotion/styled";
import Badge from "react-bootstrap/Badge";
import CloseButton from "react-bootstrap/CloseButton";
import * as d3 from "~/lib/d3";

import theme from "style/theme";
import { slopeBin } from "utils/labels";
import { useStore } from "reducer";
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

const TooltipSection = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0;
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

const StationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const StationId = styled.div`
  width: 100%;
`;

const SlopeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-end;
`;

const Slope = styled(Badge)`
  background-color: ${(props) => props.theme.colors[props.bin]} !important;
  font-size: 15px;
  color: #333; // need to make white above certain saturdation
  height: max-content;
  margin-bottom: 2px;
`;

const MiniHeader = styled.span`
  color: ${theme.colors.textLight};
  text-align: right;
  font-size: 15px;
`;

const Trend = styled.span`
  color: ${theme.colors.textLight};
  text-align: right;
  font-size: 14px;
`;

const Close = styled(CloseButton)`
  position: absolute;
  height: 4px;
  width: 4px;
  top: 10px;
  right: 10px;
`;

// format locale
d3.formatDefaultLocale({
  decimal: ",",
});

const slopeFormat = d3.format("+.2f");

function Tooltip() {
  const {
    state: { activeStation, tooltipPosition },
    actions: { resetStation },
  } = useStore();
  const [left, top] = tooltipPosition;

  return activeStation ? (
    <TooltipWrapper style={{ top, left }}>
      <Close onClick={resetStation} />
      <StateName>{activeStation.state}</StateName>
      <DistrictName>{activeStation.district}</DistrictName>
      <TooltipSection>
        <StationWrapper>
          <MiniHeader>Messstelle Nr.</MiniHeader>
          <StationId>{activeStation.ms_nr}</StationId>
        </StationWrapper>
        <SlopeWrapper>
          <MiniHeader>Tendenz</MiniHeader>
          <Slope bin={activeStation.bin}>{slopeBin[activeStation.bin]}</Slope>
          <Trend>{slopeFormat(activeStation.slope)} % pro Jahr</Trend>
        </SlopeWrapper>
      </TooltipSection>
      <Chart
        intercept={activeStation.intercept}
        slope={activeStation.slope_raw}
        data={activeStation.data}
        color={theme.colors[activeStation.bin]}
      />
    </TooltipWrapper>
  ) : null;
}

export default Tooltip;
