import React from "react";
import styled from "@emotion/styled";

const DistrictTitle = styled.h3`
  font-weight: 700;
  font-size: 23px;
  color: #333;
  margin-bottom: 5px;
`;

const DistrictBez = styled.span`
  color: #707070;
`;

const DataOverviewWrapper = styled.div`
  width: 100%;
`;

const ResultsWrapper = styled.div`
  width: 100%;
  margin: 0px;
`;

const Totals = styled.span`
  font-weight: 700;
`;

const TextContainer = styled.div`
  border-bottom: ${(props) => (props.isData ? "1px solid #e6e6e6" : "none")};
  padding: 18px 0px;
`;

const EntryWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid #e6e6e6;
  padding: 12px 0px;
  margin: 0px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
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
  margin: 0;
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
    range: "weniger als -4 % pro Jahr",
    fill: "#f56f66",
  },
  {
    shortname: "leicht_sinkend",
    longname: "Leicht sinkend",
    range: "-4 bis -1 % pro Jahr",
    fill: "#f4a582",
  },
  {
    shortname: "kein_trend",
    longname: "Kein starker Trend",
    range: "-1 bis +1 % pro Jahr",
    fill: "#eeeeee",
  },
  {
    shortname: "leicht_steigend",
    longname: "Leicht steigend",
    range: "+1 bis +4 % pro Jahr",
    fill: "#92C5de",
  },
  {
    shortname: "stark_steigend",
    longname: "Stark steigend",
    range: "mehr als +4 % pro Jahr",
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

function DataSummary({ activeKreis }) {
  const { name, bez, data } = activeKreis;
  const isData = data.total > 0;
  const totalText = (
    <TextContainer id="results-totals" isData={isData}>
      Hier gibt es
      <Totals>{` ${
        isData ? data.total : "keine"
      } Grundwassermessstellen `}</Totals>
      mit regelmäßigen Daten seit 1990.
    </TextContainer>
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
      <DistrictTitle>{name}</DistrictTitle>
      <DistrictBez>{bez}</DistrictBez>
      {totalText}
      {isData ? barCharts : null}
    </ResultsWrapper>
  );
}

function Explainer() {
  return (
    <TextContainer id="intro-text">
      <IntroGraf>Das Grundwasser in Deutschland sinkt.</IntroGraf>
      <IntroGraf>
        Eine CORRECTIV-Analyse in 13 Bundesländern zeigt, dass der
        Grundwasserspiegel zwischen 1990 und 2021 um durchschnittlich 0,04
        Prozent pro Jahr gesunken ist.
      </IntroGraf>
      <IntroGraf>
        Mit diesem Tool können Sie herausfinden, wie sich der Grundwasserspiegel
        an bestimmten Stellen in Ihrem Gebiet in den letzten 32 Jahren
        entwickelt hat. In der Satellitenansicht können Sie schauen, ob
        menschliche Einflüsse wie Kohleförderung dafür verantwortlich sein
        könnten.
      </IntroGraf>
      <IntroGraf>
        Sie können sowohl die Trends der einzelnen Messstellen als auch die
        Übersichten auf Kreisebene einsehen.
      </IntroGraf>
      <IntroGraf>Mehr über unsere Methodik finden Sie hier.</IntroGraf>
    </TextContainer>
  );
}

function DataOverview({ activeKreis }) {
  const results =
    activeKreis === null ? (
      <Explainer />
    ) : (
      <DataSummary activeKreis={activeKreis} />
    );
  return (
    <DataOverviewWrapper id="data-overview-wrapper">
      {results}
    </DataOverviewWrapper>
  );
}

export default DataOverview;
