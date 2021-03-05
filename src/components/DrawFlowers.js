import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { scoreToColor } from '../hooks/hooks';
var _ = require('lodash');

const DrawFlowers = ({ spiByYear, countryValue }) => {
  // Data imported here, needs to be cleaned up (strings to numbers etc)
  // Top level to clean data as its fed to FlowerMaker component
  let data = _.values(spiByYear);
  let SVG = d3.select('#my-svg');

  let height = '1000px';
  let width = '1000px';
  let petalSize = 75;

  let petalPath = 'M 0 0 c 0 75 37 40 45 45 C 40 37 75 0 0 0';

  // SPI Score determines Number of Petals, Basic Needs is Size of each Petal.
  const spiMinMax = d3.extent(data, d => +d["Social Progress Index"]);
  const basicMinMax = d3.extent(data, d => +d["Basic Human Needs"]);
  const foundationsMinMax = d3.extent(data, d => +d["Foundations of Wellbeing"]);
  const oppMinMax = d3.extent(data, d => +d["Opportunity"]);
  
  const spiScale = d3.scaleLinear().domain(spiMinMax).range([0,1]);
  
  const sizeBasicScale = d3.scaleLinear().domain(basicMinMax).range([0, 1]);
  const sizeFoundationsScale = d3.scaleLinear().domain(foundationsMinMax).range([0, 1]);
  const sizeOppScale = d3.scaleLinear().domain(oppMinMax).range([0, 1]);

  // orient a flower object, and iterate the data to create the size.

  const flowersData = _.map(data, d => {
    let spi = +d["Social Progress Index"];
    const spiSize = spiScale(spi);

    let basicNeeds = +d["Basic Human Needs"];
    const basicSize = sizeBasicScale(basicNeeds);

    let foundations = +d["Foundations of Wellbeing"];
    const foundationSize = sizeFoundationsScale(foundations);

    let opportunity = +d["Opportunity"];
    const oppSize = sizeOppScale(opportunity);

    // Format an individual flower object
    // petals change to reflect 3 categories (basic needs etc)
    return {
      petals: [
        { angle: -20, petalPath, petSize: basicSize, colorRef: basicNeeds }, 
        { angle: 100, petalPath, petSize: foundationSize, colorRef: foundations }, 
        { angle: 220, petalPath, petSize: oppSize, colorRef: opportunity}
      ],
      spiScale: spiSize,
      spi,
      name: d["Country"],
      status: d["Status"]
    }
  });

  //   return {
  //     petSize,
  //     petals: _.times(numPetals, i => { return { angle: 360 * i / numPetals, petalPath } }),
  //     numPetals,
  //     name: d["Country"],
  //     status: d["Status"]
  //   }
  // });

  let worldFilter = (d, countryValue) => { 
    if(d.name === countryValue) {
      { return d.name === countryValue }
    }
    else if (countryValue === 'world' ) {
      { return d.status==="Ranked" }
    }
  };

  let circleColor = (d) => {
    return scoreToColor(d.spi);
  }

  async function drawFlowers() {
    function name(d) {
      return d.name;
    }
    const flowers = SVG
      .selectAll('g')
      .data(flowersData, name)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${(i % 10) * petalSize * 2 + petalSize},${Math.floor(i / 10) * petalSize * 2 + petalSize})`)

      //outer circle
      flowers
        .append('circle')
        .attr('id', 'outer')
        .attr('cx', 0 )
        .attr('cy', 0 )
        .attr('r', petalSize)
        .style('fill', '#c4c2c4');   

        
        //inner circle color determined by SPI score.
        flowers
        .append('circle')
        .attr('cx', 0 )
        .attr('cy', 0 )
        .attr('r', d=> petalSize * d.spiScale)
        .style('fill', d=>{ return scoreToColor(d.spi)})
        
        flowers.selectAll('path')
        .data(d => d.petals)
        .enter()
        .append('path')
        .attr('d', d => d.petalPath)
        .attr('transform', d => `rotate(${d.angle}) scale(${d.petSize})`)
        .style('stroke', 'black')
        .style('fill', d=>{ return scoreToColor(d.colorRef)})        
        
        // Add a rectangle to display name/numerics
        flowers
        .append('rect')
        .attr("width", petalSize * 2)
        .attr("height", petalSize * .25)
        .attr('transform', `translate(-${(petalSize)},-${petalSize})`)
        .style('fill', 'white')

        //name
        flowers
          .append('text')
          .attr('class', 'name')
          .attr('transform', (d,i) => `translate(-${(petalSize)},-${petalSize * .75})`)
          .text(d => { return d.name });
        
        //add score to inner circle
        flowers
        .append('text')
        .attr('class', 'score') 
        .attr('transform', `translate(0,-${petalSize}) scale(${petalSize / 100})`)
        // .attr('transform', (d,i) => `scale(${petalSize / 100})`) 
        .text(d => { return d.spi });
        
    // flowers.selectAll('circle')
    // .data(d => d.spiScale)
    // .attr("r", function(d) { return d })


    return SVG;
  };

  useEffect(() => {
    drawFlowers();
    console.log(data);
    console.log(spiByYear);
    console.log(flowersData);
  }, [spiByYear, flowersData]);

  return <svg id="my-svg" height={height} width={width} ></svg>;
};
export default DrawFlowers;