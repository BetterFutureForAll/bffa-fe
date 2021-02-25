import React, { useEffect } from 'react';
import * as d3 from 'd3';
var _ = require('lodash');

const DrawFlowers = ({ spiByYear }) => {
  // Data imported here, needs to be cleaned up (strings to numbers etc)
  // Top level to clean data as its fed to FlowerMaker component
  let data = _.values(spiByYear);
  let SVG = d3.select('#my-svg');

  let height = '500px';
  let width = '500px';
  let petalSize = 100;
  let petalPath = 'M 0,0 C -10,-10 -10,-40 0,-50 C 10,-40 10,-10 0,0';

  // SPI Score determines Number of Petals, Basic Needs is Size of each Petal.
  const basicMinMax = d3.extent(data, d => +d["Basic Human Needs"]);
  const spiMinMax = d3.extent(data, d => +d["Social Progress Index"]);
  const sizeScale = d3.scaleLinear().domain(basicMinMax).range([0, 100]);

  const numPetalScale = d3.scaleQuantize().domain(spiMinMax).range([1, 3, 4, 6, 9, 12]);

  // orient a flower object, and iterate the data to create the size.

  const flowersData = _.map(data, d => {
    let spi = +d["Social Progress Index"];
    const numPetals = numPetalScale(spi);

    let basicNeeds = +d["Basic Human Needs"];
    const petSize = sizeScale(basicNeeds);

    // Format an individual flower object
    // petals change to reflect 3 categories (basic needs etc)
    return {
      petSize,
      petals: _.times(numPetals, i => { return { angle: 360 * i / numPetals, petalPath } }),
      numPetals,
      name: d["Country"]
    }
  });

  async function drawFlowers() {
    const flowers = SVG
      .selectAll('g')
      .data(flowersData)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${(i % 5) * petalSize},${Math.floor(i / 5) * petalSize})scale(${d.petSize})`);
      
    flowers.selectAll('path')
      .data(d => d.petals)
      .enter()
      .append('path')
      .attr('d', d => d.petalPath)
      .attr('transform', d => `rotate(${d.angle})`);

    return SVG;
  };

  useEffect(() => {
    drawFlowers();
    console.log(data);
    console.log(flowersData);
  }, [flowersData]);

  return <svg id="my-svg" height={height} width={width} ><path transform="translate(2.5,5.0)" d={petalPath}/></svg>;
};
export default DrawFlowers;