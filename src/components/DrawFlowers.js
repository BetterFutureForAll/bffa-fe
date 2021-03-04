import React, { useEffect } from 'react';
import * as d3 from 'd3';
var _ = require('lodash');

const DrawFlowers = ({ spiByYear, countryValue }) => {
  // Data imported here, needs to be cleaned up (strings to numbers etc)
  // Top level to clean data as its fed to FlowerMaker component
  let data = _.values(spiByYear);
  let SVG = d3.select('#my-svg');

  let height = '1000px';
  let width = '1000px';
  let petalSize = 50;

  // let petalPath = `M0,0 C-5,15 -50,1 -45,40 -C40,70 -10,80 -0,100 C10,80 40,70 45,40 C50,1 5,15 0,0`;

  // let petalPath = 'M0,0 C50,40 50,70 20,100 L0,85 L-20,100 C-50,70 -50,40 0,0';
  let petalPath = 'M0,0 40 20 A 20 20 0 0 1 20 40';

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
        { angle: -20, petalPath, petSize: basicSize }, 
        { angle: 100, petalPath, petSize: foundationSize }, 
        { angle: 220, petalPath, petSize: oppSize}
      ],
      spi: spiSize,
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

  async function drawFlowers() {
    function name(d) {
      return d.name;
    }
    const flowers = SVG
      .selectAll('g')
      .data(flowersData, name)
      .enter()
      .append('g')
      // .select(function(d) { return d.name === countryValue })
      // .filter(function(d) { return d.status==="Ranked" })
      .attr('transform', (d, i) => `translate(${(i % 10) * petalSize * 2 + petalSize},${Math.floor(i / 10) * petalSize * 2 + petalSize})`)

    flowers
      .append('text')
      .attr('class', 'name')
      .attr('transform', (d,i) => `translate(0, ${petalSize})`)
      .text(d => { return d.name});

    flowers.selectAll('path')
      .data(d => d.petals)
      .enter()
      .append('path')
      .attr('d', d => d.petalPath)
      .attr('transform', d => `rotate(${d.angle}) scale(${d.petSize})`);
    
    flowers
      .append('circle');
    
    // circles.selectAll('circle')
    // .data(d => d.spi)
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