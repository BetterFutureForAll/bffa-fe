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

// Set x and y-axis scales
// const height = 10;
// const width = 10;
// const padding = 10;

// let outerRadius = Math.min(width, height) / 2;
// let innerRadius = 180;

// Orient a petal for each "field" to orient as 3 petal flower

// Scale each petal to the corresponding size

// Overlay Numerical values.

// const xScale = d3.scaleLinear()
// .domain([d3.min(data, d => d.target), d3.max(data, d=> d.target)])
// .range([padding, w - padding]);
// const yScale = d3.scaleLinear()
// .domain([d3.min(data, d => d.target), d3.max(data, d=> d.target)])
// .range([h - padding, padding]);

// // // Append an svg to the petal
// // const svg = d3.select('petal')
// // .append('svg')
// // .attr('width', w)
// // .attr('height', h);

//   useEffect(() => {
//     const svg = d3.select('#my-svg');
//     console.log(data, countryValue);
//     svg.append("image")
//     .attr("xlink:href", petal)
//     .attr("width", xScale)
//     .attr("height", yScale)
//   });





// set the dimensions and margins of the graph
var margin = {top: 1, right: 1, bottom: 1, left: 1},
    width = 350 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom,
    innerRadius = 10,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

// append the svg object to the body of the page
var svg = d3.select("#my-svg")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + ( height/ 2  )+ ")"); // Add on Y translation, cause upper bars are longer
    
    console.log('spiData ' + spiByYear['World']);

  //  d3.csv(spiByYear, function(error, rows) {
  //     var obj = {};
  //     rows.forEach(function(d){
  //       obj[d.col1] = [d.col2, d.col3, d.col4];
  //     });
  //     console.log('obj ' + obj);
  //   });



  // X scale
  var x = d3.scaleBand()
      .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0)                  
      .domain( spiByYear.map(function(d) { return d["Country"]; }) ); // The domain of the X axis is the list of Countries. Change to Fields (column headers)

  // Y scale
  var y = d3.scaleRadial()
      .range([innerRadius, outerRadius])   // Domain will be define later.
      .domain([0, 100]); // Domain of Y is from 0 to the max seen in the data

  // Add bars
  svg.append("g")
    .selectAll("path")
    .data(spiByYear)
    .enter()
    .append("path")
      .attr("fill", "#69b3a2")
      .attr("d", d3.arc()    
          .innerRadius(innerRadius)
          .outerRadius(function(d) { return y(d['Social Progress Index']); })
          .startAngle(function(d) { return x(d['Country']); })
          .endAngle(function(d) { return x(d['Country']) + x.bandwidth(); })
          .padAngle(0.01)
          .padRadius(innerRadius))


// ********************************Different Example here *************************

// let chart = () => {

//   const svg = d3.select("my-svg".svg(width, height))
//       .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
//       .style("width", "100%")
//       .style("height", "auto")
//       .style("font", "10px sans-serif");

//   svg.append("g")
//     .selectAll("g")
//     .data(d3.stack().keys(data.columns.slice(1))(data))
//     .join("g")
//       .attr("fill", d => z(d.key))
//     .selectAll("path")
//     .data(d => d)
//     .join("path")
//       .attr("d", arc);

//   svg.append("g")
//       .call(xAxis);

//   svg.append("g")
//       .call(yAxis);

//   svg.append("g")
//       .call(legend);

//   return svg.node();
// };

// async function data() { 
//   d3.csvParse(await hardData.text(), (d, _, columns) => {
//   let total = 0;
//   for (let i = 1; i < columns.length; ++i) total += d[columns[i]] = +d[columns[i]];
//   d.total = total;
//   return d;
//   })
// };

// async function data() { d3.csvParse(await (hardData)) };

// let x = d3.scaleBand()
// .domain(data.map(d => d.State))
// .range([0, 2 * Math.PI])
// .align(0)

// let arc = d3.arc()
// .innerRadius(d => y(d[0]))
// .outerRadius(d => y(d[1]))
// .startAngle(d => x(d.data.State))
// .endAngle(d => x(d.data.State) + x.bandwidth())
// .padAngle(0.01)
// .padRadius(innerRadius)

// let y = d3.scaleRadial()
//       .domain([0, d3.max(data, d => d.total)])
//       .range([innerRadius, outerRadius])
// let z = d3.scaleOrdinal()
//     .domain(data.columns.slice(1))
//     .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])

// let xAxis = g => g
//     .attr("text-anchor", "middle")
//     .call(g => g.selectAll("g")
//       .data(data)
//       .join("g")
//         .attr("transform", d => `
//           rotate(${((x(d.State) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
//           translate(${innerRadius},0)
//         `)
//         .call(g => g.append("line")
//             .attr("x2", -5)
//             .attr("stroke", "#000"))
//         .call(g => g.append("text")
//             .attr("transform", d => (x(d.State) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
//                 ? "rotate(90)translate(0,16)"
//                 : "rotate(-90)translate(0,-9)")
//             .text(d => d.State)))

//   let yAxis = g => g
//   .attr("text-anchor", "middle")
//   .call(g => g.append("text")
//       .attr("y", d => -y(y.ticks(5).pop()))
//       .attr("dy", "-1em")
//       .text("Population"))
//   .call(g => g.selectAll("g")
//     .data(y.ticks(5).slice(1))
//     .join("g")
//       .attr("fill", "none")
//       .call(g => g.append("circle")
//           .attr("stroke", "#000")
//           .attr("stroke-opacity", 0.5)
//           .attr("r", y))
//       .call(g => g.append("text")
//           .attr("y", d => -y(d))
//           .attr("dy", "0.35em")
//           .attr("stroke", "#fff")
//           .attr("stroke-width", 5)
//           .text(y.tickFormat(5, "s"))
//        .clone(true)
//           .attr("fill", "#000")
//           .attr("stroke", "none")))

//   let legend = g => g.append("g")
//   .selectAll("g")
//   .data(data.columns.slice(1).reverse())
//   .join("g")
//     .attr("transform", (d, i) => `translate(-40,${(i - (data.columns.length - 1) / 2) * 20})`)
//     .call(g => g.append("rect")
//         .attr("width", 18)
//         .attr("height", 18)
//         .attr("fill", z))
//     .call(g => g.append("text")
//         .attr("x", 24)
//         .attr("y", 9)
//         .attr("dy", "0.35em")
//         .text(d => d))
// useEffect(()=> {
//   console.log(data);
//   chart();
// }, [spiByYear]);

  return (
      <div id="FlowerMaker">
        <h2>{selectCountries}</h2>
        <svg id="my-svg"></svg>
      </div>
    );
}

export default FlowerMaker;