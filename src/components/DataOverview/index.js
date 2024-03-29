import React from "react";
import { BsArrowsAngleExpand, BsX } from "react-icons/bs";
import styled from "@emotion/styled";
import { useStoreState } from "easy-peasy";

import { actions } from "store";
import theme from "style/theme";
import { device } from "utils/css-utils";
import { Button } from "components/common";
import Legend from "components/Legend";

const DistrictTitle = styled.h3`
  font-weight: 700;
  line-height: 1.2;
  color: #333;
  margin-bottom: 0px;
  ${device.phone} {
    font-size: 20px;
  }
  ${device.tablet} {
    font-size: 23px;
  }
`;

const DistrictBez = styled.span`
  color: #707070;
`;

const DataOverviewWrapper = styled.div`
  width: 100%;
  margin: 0px 0px 0px 0px;
`;

const ResultsWrapper = styled.div`
  width: 100%;
  margin: 0px;
`;

const ResultsHeader = styled.header`
  display: flex;
  justify-content: space-between;
`;

const DistrictActions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  margin-right: -9px;
`;

const ActionButton = styled(Button)`
  padding: 10px 10px;
  font-size: 12px;
  line-height: 12px;
  border: none;
  color: ${theme.colors.textLight};
  &:hover {
    border: none;
    background-color: ${(props) =>
      props.disabled ? "transparent" : theme.colors.lightLightGrey};
    color: ${theme.colors.textLight};
  }
`;

const Totals = styled.span`
  font-weight: 700;
`;

const IntroText = styled.div`
  border-bottom: ${(props) => (props.isData ? "1px solid #e6e6e6" : "none")};
  padding: 0px;
`;

const DistrictText = styled.div`
  line-height: 1.3em;
  border-bottom: ${(props) => (props.isData ? "1px solid #e6e6e6" : "none")};
  padding: 12px 0px 14px 0px;
`;

const EntryWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid #e6e6e6;
  padding: 10px 0px;
  margin: 0px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
`;

const EntryTextWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  ${device.phone} {
    flex-direction: column;
    justify-content: flex-start;
  }
  ${device.tablet} {
    flex-direction: row;
    justify-content: space-between;
  }
  margin-bottom: 8px;
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

const BarWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: 0;
`;

const Bar = styled.div`
  width: calc(100% - 30px);
`;

const BarColorFill = styled.div`
  height: 10px;
  background-color: ${(props) => props.fill};
  width: ${(props) => props.width};
  border-radius: 2px;
`;

const BarValue = styled.div`
  font-weight: 700;
  width: 30px;
  text-align: right;
`;

const IntroGraf = styled.p`
  color: #333;
`;

const dataLevels = [
  {
    shortname: "stark_sinkend",
    longname: "Stark sinkend",
    range: "stärker als -1 % pro Jahr",
  },
  {
    shortname: "leicht_sinkend",
    longname: "Leicht sinkend",
    range: "-1 bis -0,5 % pro Jahr",
  },
  {
    shortname: "kein_starker_trend",
    longname: "Kein starker Trend",
    range: "-0,5 bis +0,5 % pro Jahr",
  },
  {
    shortname: "leicht_steigend",
    longname: "Leicht steigend",
    range: "+0,5 bis +1 % pro Jahr",
  },
  {
    shortname: "stark_steigend",
    longname: "Stark steigend",
    range: "stärker als +1 % pro Jahr",
  },
];

function DataEntry({ measurement, shortname, range, value, total }) {
  const width = value === 0 ? "2px" : `${(100 * value) / total}%`;
  return (
    <EntryWrapper id={`${shortname}--item`}>
      <EntryTextWrapper>
        <EntryText>{measurement}</EntryText>
        <EntryRange>{range}</EntryRange>
      </EntryTextWrapper>
      <BarWrapper>
        <Bar>
          <BarColorFill fill={theme.colors[shortname]} width={width} />
        </Bar>
        <BarValue>{value}</BarValue>
      </BarWrapper>
    </EntryWrapper>
  );
}

function DataSummary({ activeDistrict }) {
  const districtIsAdjusted = useStoreState((s) => s.districtIsAdjusted);

  const { name, state, bez, ...data } = activeDistrict;
  const isData = data.total > 0;
  const totalText = isData ? (
    <DistrictText id="results-totals" isData={isData}>
      Hier gibt es
      <Totals> {data.total} Grundwassermessstellen </Totals>
      mit regelmäßigen Daten seit 1990.
    </DistrictText>
  ) : (
    <DistrictText id="results-none">
      Hier liegen uns keine Daten vor oder die Daten erfüllten nicht unsere
      Qualitätskriterien.
    </DistrictText>
  );
  const barCharts = dataLevels.map((d) => (
    <DataEntry
      key={d.shortname}
      measurement={d.longname}
      shortname={d.shortname}
      range={d.range}
      value={data[d.shortname]}
      total={data.total}
      fill={d.fill}
    />
  ));
  return (
    <ResultsWrapper>
      <ResultsHeader>
        <DistrictTitle>{name}</DistrictTitle>
        <DistrictActions>
          <ActionButton onClick={actions.resetDistrict}>
            <BsX size={16} />
          </ActionButton>
          <ActionButton
            disabled={districtIsAdjusted}
            onClick={actions.adjustDistrictView}
          >
            <BsArrowsAngleExpand size={14} />
          </ActionButton>
        </DistrictActions>
      </ResultsHeader>
      <DistrictBez>
        {bez}, {state}
      </DistrictBez>
      {totalText}
      {isData ? barCharts : null}
    </ResultsWrapper>
  );
}

function Explainer() {
  return (
    <IntroText id="intro-text">
      <IntroGraf>
        Mit dieser interaktiven Karte finden Sie heraus, wie sich der
        Grundwasserspiegel bei Ihnen vor Ort zwischen 1990 und 2021 entwickelt
        hat. Klicken Sie einfach auf Ihren Landkreis oder geben Sie einen Ort in
        das Suchfeld ein.
      </IntroGraf>
      <Legend />
    </IntroText>
  );
}

function DataOverview() {
  const activeDistrict = useStoreState((s) => s.activeDistrict);
  const results =
    activeDistrict === null ? (
      <Explainer />
    ) : (
      <DataSummary activeDistrict={activeDistrict} />
    );

  return (
    <DataOverviewWrapper id="data-overview-wrapper">
      {results}
    </DataOverviewWrapper>
  );
}

export default DataOverview;
