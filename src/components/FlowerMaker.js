import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { scaleRadial } from 'd3';
import petal from '../assets/single4petal.svg';
import { useCountries, useHandleCountryChange } from '../hooks/hooks';
import { getSpiDataByCountry } from '../services/SocialProgress';

let hardData = require('../assets/2011-2020-Social-Progress-Index.csv')


// Petals for Basic Human Needs, Foundations of Wellbeing, and Opportunity
// SPI Score in the middle
// Wrap it all in a circle for ease of use / reuse
const FlowerMaker = ({ spiByYear }) => {

  let [countries] = useCountries();
  let [countryValue, handleCountryChange] = useHandleCountryChange();

  let selectCountries = (
    <select onChange={handleCountryChange} defaultValue={countryValue}>
      {countries.map(item => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
    );


// ********************************Different Example here *************************

var data = d3.csv(spiByYear, function(d) {
  d.map(function(x){
      x.spiScore = x['Social Progress Index'],
      x.basicNeeds = x['Basic Human Needs'],
      x.opportunity = x['Opportunity']
      let minY = (x) = d3.min(x, function(d) { return d.x});
      let maxY = (x) = d3.max(x, function(d) { return d.x});
      return [x, minY, maxY];
    });
})

let chart = (width, height) => {

  const svg = d3.select("my-svg".svg(width, height))
      .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
      .style("width", "100%")
      .style("height", "auto")
      .style("font", "10px sans-serif");

  svg.append("g")
    .selectAll("g")
    .data(d3.stack().keys(data.columns.slice(1))(data))
    .join("g")
      .attr("fill", d => z(d.key))
    .selectAll("path")
    .data(d => d)
    .join("path")
      .attr("d", arc);

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  svg.append("g")
      .call(legend);

  return svg.node();
};

// async function data() { 
//   d3.csvParse(await hardData.text(), (d, _, columns) => {
//   let total = 0;
//   for (let i = 1; i < columns.length; ++i) total += d[columns[i]] = +d[columns[i]];
//   d.total = total;
//   return d;
//   })
// };

// async function data() { d3.csvParse(await (hardData)) };

let x = d3.scaleBand()
.domain(data.map(d => d.State))
.range([0, 2 * Math.PI])
.align(0)

let arc = d3.arc()
.innerRadius(d => y(d[0]))
.outerRadius(d => y(d[1]))
.startAngle(d => x(d.data.State))
.endAngle(d => x(d.data.State) + x.bandwidth())
.padAngle(0.01)
.padRadius(innerRadius)

let y = d3.scaleRadial()
      .domain([0, d3.max(data, d => d.total)])
      .range([innerRadius, outerRadius])
let z = d3.scaleOrdinal()
    .domain(data.columns.slice(1))
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])

let xAxis = g => g
    .attr("text-anchor", "middle")
    .call(g => g.selectAll("g")
      .data(data)
      .join("g")
        .attr("transform", d => `
          rotate(${((x(d.State) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
          translate(${innerRadius},0)
        `)
        .call(g => g.append("line")
            .attr("x2", -5)
            .attr("stroke", "#000"))
        .call(g => g.append("text")
            .attr("transform", d => (x(d.State) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
                ? "rotate(90)translate(0,16)"
                : "rotate(-90)translate(0,-9)")
            .text(d => d.State)))

  let yAxis = g => g
  .attr("text-anchor", "middle")
  .call(g => g.append("text")
      .attr("y", d => -y(y.ticks(5).pop()))
      .attr("dy", "-1em")
      .text("Population"))
  .call(g => g.selectAll("g")
    .data(y.ticks(5).slice(1))
    .join("g")
      .attr("fill", "none")
      .call(g => g.append("circle")
          .attr("stroke", "#000")
          .attr("stroke-opacity", 0.5)
          .attr("r", y))
      .call(g => g.append("text")
          .attr("y", d => -y(d))
          .attr("dy", "0.35em")
          .attr("stroke", "#fff")
          .attr("stroke-width", 5)
          .text(y.tickFormat(5, "s"))
       .clone(true)
          .attr("fill", "#000")
          .attr("stroke", "none")))

  let legend = g => g.append("g")
  .selectAll("g")
  .data(data.columns.slice(1).reverse())
  .join("g")
    .attr("transform", (d, i) => `translate(-40,${(i - (data.columns.length - 1) / 2) * 20})`)
    .call(g => g.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", z))
    .call(g => g.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", "0.35em")
        .text(d => d))
useEffect(()=> {
  console.log(data);
  chart();
}, [spiByYear]);

  return (
      <div id="FlowerMaker">
        <h2>{selectCountries}</h2>
        <svg id="my-svg"></svg>
      </div>
    );
}

export default FlowerMaker;