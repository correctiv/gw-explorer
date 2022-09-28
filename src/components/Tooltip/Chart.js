import React, { useEffect } from "react";
import * as d3 from "~/lib/d3";

// 1990 - 2021
const DATES = [...Array(32).keys()]
  .map((y) => y + 1990)
  .map((y) => [...Array(12).keys()].map((m) => new Date(y, m + 1, 16)))
  .flat();

const renderChart = ({ element, width, height, margin, data }) => {
  const vizData = DATES.map((d, i) => ({
    date: d,
    value: data[i],
  })).filter(({ value }) => !!value);

  const x = d3.scaleTime().rangeRound([0, width]).domain(d3.extent(DATES));
  const y = d3.scaleLinear().rangeRound([height, 0]).domain(d3.extent(data));

  const line = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d.value));
  // .curve(d3.curveStep())

  const [top, right, bottom, left] = margin;

  const g = d3
    .select(element)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 ${width + left + right} ${height + top + bottom}`)
    .append("g")
    .attr("transform", `translate(${left},${top})`);

  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(5));

  g.append("g").attr("class", "axis axis--y").call(d3.axisLeft(y).ticks(5));

  g.append("path")
    .datum(vizData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", line);

  return g;
};

function Chart({ data }) {
  const width = 250;
  const height = 100;
  const margin = [20, 0, 20, 40];

  const reset = () => d3.select("#gw-tooltip-chart").select("svg").remove();

  // reset & render on data change
  useEffect(() => {
    reset();
    renderChart({
      element: "#gw-tooltip-chart",
      width,
      height,
      margin,
      data,
    });
  }, [data]);

  return <div id="gw-tooltip-chart" />;
}

export default Chart;
