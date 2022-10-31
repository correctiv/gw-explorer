import React from "react";
import styled from "@emotion/styled";
import theme from "style/theme";

const LegendWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  margin-bottom: 0px;
`;

const BinWrapper = styled.div`
  display: flex;
  flex: row;
  width: 100%;
  margin-bottom: 5px;
`;

const Bin = styled.div`
  flex-grow: 1;
  height: 10px;
  background-color: ${(props) => props.fill};
  border-radius: ${(props) => props.border};
`;

const LegendTextWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const EntryText = styled.div`
  width: max-content;
  font-weight: 600;
  font-size: 15px;
`;

const EntryRange = styled.div`
  width: max-content;
  color: #b3b3b3;
  font-size: 15px;
`;

function Legend() {
  return (
    <LegendWrapper id="legend">
      <LegendTextWrapper>
        <EntryText>Stark sinkend</EntryText>
        <EntryText>Stark steigend</EntryText>
      </LegendTextWrapper>
      <BinWrapper>
        <Bin fill={theme.colors.stark_sinkend} border="2px 0px 0px 2px" />
        <Bin fill={theme.colors.leicht_sinkend} border="0px" />
        <Bin fill={theme.colors.kein_starker_trend} border="0px" />
        <Bin fill={theme.colors.leicht_steigend} border="0px" />
        <Bin fill={theme.colors.stark_steigend} border="0px 2px 2px 0px" />
      </BinWrapper>
      <LegendTextWrapper>
        <EntryRange style={{ textAlign: "left", maxWidth: "40%" }}>
          stärker als
          <br />
          -1 % pro Jahr
        </EntryRange>
        <EntryRange style={{ textAlign: "right", maxWidth: "40%" }}>
          stärker als
          <br />
          +1 % pro Jahr
        </EntryRange>
      </LegendTextWrapper>
    </LegendWrapper>
  );
}

export default Legend;
