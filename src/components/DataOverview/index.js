import React from "react";
import styled from "@emotion/styled";

const DataOverviewWrapper = styled.div`
  width: 100%;
`;

const ResultsWrapper = styled.div`
  width: 100%;
  margin-bottom: 40px;
`;

const Totals = styled.span`
  font-weight: 700;
`;

const TextContainer = styled.div`
  border-bottom: 1px solid #e6e6e6;
  padding-bottom: 20px;
  margin-bottom: 40px;
`;

const EntryWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid #e6e6e6;
  margin-bottom: 18px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  &:last-child {
    margin-bottom: 0;
  }
`;

const EntryTextWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
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
  margin-bottom: 18px;
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

const dataLevels = [
  {
    shortname: "stark_sinkend",
    longname: "Stark sinkend",
    range: "Weniger als -4 Prozent pro Jahr",
    fill: "#f56f66",
  },
  {
    shortname: "leicht_sinkend",
    longname: "Leicht sinkend",
    range: "-4 bis zu -1 Prozent pro Jahr",
    fill: "#f4a582",
  },
  {
    shortname: "kein_trend",
    longname: "Kein starker Trend",
    range: "-1 bis zu +1 Prozent pro Jahr",
    fill: "#eeeeee",
  },
  {
    shortname: "leicht_steigend",
    longname: "Leicht steigend",
    range: "+1 bis zu +4 Prozent pro Jahr",
    fill: "#92C5de",
  },
  {
    shortname: "stark_steigend",
    longname: "Stark steigend",
    range: "Mehr als 4 Prozent pro Jahr",
    fill: "#48a0fe",
  },
];

function DataEntry({ measurement, shortname, range, value, fill, total }) {
  const width = value === 0 ? "2px" : `${(100 * value) / total}%`;
  return (
    <EntryWrapper id={`${shortname}--item`}>
      <EntryTextWrapper>
        <EntryText>{measurement}</EntryText>
        <EntryRange>{range}</EntryRange>
      </EntryTextWrapper>
      <BarWrapper>
        <Bar>
          <BarColorFill fill={fill} width={width} />
        </Bar>
        <BarValue>{value}</BarValue>
      </BarWrapper>
    </EntryWrapper>
  );
}

function DataSummary({ data }) {
  const isData = data.total > 0;
  const totalText = (
    <TextContainer id="results-totals">
      Hier gibt es
      <Totals>{` ${
        data.total === 0 ? "keine" : data.total
      } Grundwassermessstellen `}</Totals>
      mit regelmäßigen Daten seit 1990.
    </TextContainer>
  );
  const barCharts = dataLevels.map((d) => (
    <DataEntry
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
      {totalText}
      {isData ? barCharts : null}
    </ResultsWrapper>
  );
}

function Explainer() {
  return (
    <TextContainer id="intro-text">
      Heres an explanation of how to use this tool.
    </TextContainer>
  );
}

function DataOverview({ activeKreis }) {
  const results =
    activeKreis === null ? (
      <Explainer />
    ) : (
      <DataSummary data={activeKreis.properties.data} />
    );
  return (
    <DataOverviewWrapper id="data-overview-wrapper">
      {results}
    </DataOverviewWrapper>
  );
}

export default DataOverview;
