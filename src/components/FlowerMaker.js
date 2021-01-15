import React, { useEffect } from 'react';
import * as d3 from 'd3';
import petal from '../assets/single4petal.svg';

const D3petal = (data) => {

// Set x and y-axis scales


// Orient a petal for each "field" to orient as 3 or 4 petal flower

// Scale each petal to the corresponding size

// Overlay Numerical values.
const h = 10;
const w = 10;
const padding = 10;
const xScale = d3.scaleLinear()
.domain([d3.min(data, d => d.target), d3.max(data, d=> d.target)])
.range([padding, w - padding]);
const yScale = d3.scaleLinear()
.domain([d3.min(data, d => d.target), d3.max(data, d=> d.target)])
.range([h - padding, padding]);

// // Append an svg to the petal
// const svg = d3.select('petal')
// .append('svg')
// .attr('width', w)
// .attr('height', h);

  useEffect(() => {
    const svg = d3.select('#my-svg');
    svg.append("image")
    .attr("xlink:href", petal)
    .attr("width", xScale)
    .attr("height", yScale)
  });

    return (
      <svg id="my-svg"></svg>
    );
}

export default D3petal;