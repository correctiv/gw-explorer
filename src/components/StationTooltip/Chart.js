import React, { useEffect } from "react";
import styled from "@emotion/styled";
import * as d3 from "lib/d3";

const ChartWrapper = styled.div`
  margin-top: 0px;
  path {
    fill: none;
  }
  .data-path {
    stroke: #707070;
    stroke-width: 1.5;
  }
  .trend-path {
    stroke-width: 2;
  }
  .tick line,
  .domain {
    stroke: #707070;
    stroke-width: 1;
  }
  .tick text {
    font-weight: light;
  }
`;

// format locale
d3.formatDefaultLocale({
  decimal: ",",
});

// 1990 - 2021
const DATES = [...Array(32).keys()]
  .map((y) => y + 1990)
  .map((y) => [...Array(12).keys()].map((m) => new Date(y, m + 1, 16)))
  .flat();

const renderChart = ({
  element,
  width,
  height,
  margin,
  intercept,
  slope,
  data,
  color,
}) => {
  const vizData = DATES.map((d, i) => ({
    date: d,
    value: data[i],
  })).filter(({ value }) => !!value);

  const x0 = new Date(1990, 1, 1);
  const y0 = intercept;
  // will update later with corrected slope!
  const changey = (32 * slope) / 100;
  const x1 = new Date(2021, 12, 31);
  const y1 = intercept + changey;

  const trendData = [
    {
      date: x0,
      value: y0,
    },
    {
      date: x1,
      value: y1,
    },
  ];

  const xTicks = [
    new Date(1990, 1, 1),
    new Date(2000, 1, 1),
    new Date(2010, 1, 1),
    new Date(2021, 1, 1),
  ];

  const x = d3.scaleTime().rangeRound([0, width]).domain(d3.extent(DATES));
  const yTicks = [
    d3.min(data),
    (d3.max(data) + d3.min(data)) / 2,
    d3.max(data),
  ];
  const y = d3.scaleLinear().rangeRound([height, 0]).domain(d3.extent(data));

  const line = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d.value))
    .curve(d3.curveBasis);

  const [top, right, bottom, left] = margin;

  // build SVG

  const g = d3
    .select(element)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 ${width + left + right} ${height + top + bottom}`)
    .attr("width", "100%")
    .attr("height", "auto")
    .append("g")
    .attr("transform", `translate(${left},${top})`);

  // add x-axis
  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickValues(xTicks).tickFormat(d3.timeFormat("%Y")));

  // remove x-axis domain since overlaps with y-axis
  g.select(".axis--x .domain").remove();

  // remove x-axis tick lines
  g.selectAll(".axis--x .tick line").remove();

  // nudge x-axis height
  g.selectAll(".axis--x .tick text").attr("dy", 4);

  // nudge first x-axis label right
  g.select(".axis--x .tick:first-of-type text").attr("dx", 12);

  // nudge last label left
  g.select(".axis--x .tick:last-of-type text").attr("dx", -5);

  // tick format for y axis
  const yTickFormat = d3.format(".1f");

  // add y-axis
  g.append("g")
    .attr("class", "axis axis--y")
    .call(
      d3
        .axisRight(y)
        .tickValues(yTicks)
        .tickFormat((d) => `${yTickFormat(d)} m ü NN`)
        .tickSize(width)
    );

  // style y-axis
  g.selectAll(".axis--y .tick:not(:first-of-type) line").attr(
    "stroke-opacity",
    0.2
  );

  // nudge y-axis tips higher
  g.selectAll(".axis--y .tick text")
    .attr("x", 0)
    .attr("dy", -4)
    .attr("opacity", 0.5);

  // hide y-axis domain
  g.select(".axis--y .domain").remove();

  // remove y-axis label at midpoint
  g.select(".axis--y .tick:nth-of-type(2) text").remove();

  // add data path
  g.append("path").datum(vizData).attr("d", line).attr("class", "data-path");

  // add trend line
  g.append("path")
    .datum(trendData)
    .attr("d", line)
    .attr("class", "trend-path")
    .attr("stroke", color);

  return g;
};

function Chart({ intercept, slope, data, color }) {
  const width = 250;
  const height = 100;
  const margin = [20, 10, 20, 1];

  const reset = () => d3.select("#gw-tooltip-chart").select("svg").remove();

  // reset & render on data change
  useEffect(() => {
    reset();
    renderChart({
      element: "#gw-tooltip-chart",
      width,
      height,
      margin,
      intercept,
      slope,
      data,
      color,
    });
  }, [intercept, slope, data, color]);

  return <ChartWrapper id="gw-tooltip-chart" />;
}

export default Chart;
