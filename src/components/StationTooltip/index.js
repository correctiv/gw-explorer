import React from "react";
import styled from "@emotion/styled";
import Badge from "react-bootstrap/Badge";
import CloseButton from "react-bootstrap/CloseButton";
import * as d3 from "~/lib/d3";

import { device } from "utils/css-utils";

import theme from "style/theme";
import { slopeBin } from "utils/labels";
import { useStore } from "reducer";
import Chart from "./Chart";

const TooltipWrapper = styled.div`
  position: absolute;
  ${device.phone} {
    width: calc(100% - 20px);
    margin: 64px 10px 0px 10px;
  }
  ${device.tablet} {
    margin-top: -20px;
    margin-left: 20px;
    width: 340px;
  }
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
  z-index: 100;
`;

const Close = styled(CloseButton)`
  position: absolute;
  height: 4px;
  width: 4px;
  top: 10px;
  right: 10px;
`;

const StationId = styled.h4`
  font-size: 14px;
  color: grey;
  margin-bottom: 10px;
  line-height: 1.2;
  font-weight: 400;
`;

const DistrictName = styled.h3`
  font-weight: 700;
  font-size: 20px;
  line-height: 150%;
  color: #333333;
  margin: 0px;
  padding: 0px;
  line-height: 1.2;
`;

const StateName = styled.h4`
  font-size: 14px;
  color: grey;
  text-transform: uppercase;
  margin-bottom: 20px;
  line-height: 1.2;
  font-weight: 500;
`;

const Slope = styled(Badge)`
  background-color: ${(props) => props.theme.colors[props.bin]} !important;
  font-size: 15px;
  color: ${(props) =>
    props.bin === "kein_starker_trend"
      ? theme.colors.textLight
      : "#fff"} !important;
  height: max-content;
  margin-bottom: 2px;
`;

const Trend = styled.span`
  color: ${theme.colors.textLight};
  text-align: right;
  font-size: 14px;
`;

const TooltipSection = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
`;

// format locale
d3.formatDefaultLocale({
  decimal: ",",
});

const slopeFormat = d3.format("+.2f");

function StationTooltip() {
  const {
    state: { activeStation, tooltipPosition },
    actions: { resetStation },
  } = useStore();
  const [left, top] = tooltipPosition;

  return activeStation ? (
    <TooltipWrapper style={{ top, left }} id="mapbox-tooltip">
      <Close onClick={resetStation} />
      <StationId>Messstelle {activeStation.ms_nr}</StationId>
      <DistrictName>{activeStation.district}</DistrictName>
      <StateName>{activeStation.state}</StateName>
      <TooltipSection>
        <Slope bin={activeStation.bin}>{slopeBin[activeStation.bin]}</Slope>
        <Trend>{slopeFormat(activeStation.slope)} % pro Jahr</Trend>
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

export default StationTooltip;
