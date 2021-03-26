import React, { useEffect, useRef } from 'react';
import { scoreToColor, useD3 } from '../hooks/hooks';
import * as d3 from 'd3';
import ReactDOMServer from 'react-dom/server';


function DrawFlowers({ spiByYear, yearValue, countryValue, svgRef }) {
  //Size controls
  var margin = { top: 0, left: 0, right: 0, bottom: 0, }
  let height = 250 - margin.top - margin.bottom;
  let width = 250 - margin.right - margin.left;
  let svgSize = (height + width) * .25;
  let petalPath = 'M 0 0 c 0 75 37 40 45 45 C 40 37 75 0 0 0';

  let hardData = require('../assets/2011-2020-Social-Progress-Index.csv');
  // let svgRef = useRef(null);

  let renderTheFlowers = () =>{
    if(yearValue!==undefined && countryValue!==undefined){
      d3.csv(hardData)
      .then(ready)
      .catch(err => {
        console.log(err);
      })
    }
  };

  function ready(dataPoints) {

    let container = d3.select(svgRef.current)
    console.log('container', container);

    let years = d3
      .group(dataPoints, d => d['SPI year'])

    let countries = d3
      .group(dataPoints, d => d['SPI year'], d => d['Country'])

    let selectedCountries = countries.get(yearValue).get(countryValue);


    // Append Petal Flower to Data instead of mapping a new item. 
    let makeFlower = selectedCountries.map(d => {
      const spiScale = d3.scaleLinear().domain([0, 100]).range([0, 1]);
  
      let spi = +d["Social Progress Index"];
      const spiSize = spiScale(spi);
  
      let basicNeeds = +d["Basic Human Needs"];
      const basicSize = spiScale(basicNeeds);
  
      let foundations = +d["Foundations of Wellbeing"];
      const foundationSize = spiScale(foundations);
  
      let opportunity = +d["Opportunity"];
      const oppSize = spiScale(opportunity);
  
      // petals change to reflect 3 categories (basic needs etc)
      console.log('Data Rendered', d['Country']);
      return {
        petals: [
          { angle: -20, petalPath, petSize: basicSize, colorRef: basicNeeds },
          { angle: 100, petalPath, petSize: foundationSize, colorRef: foundations },
          { angle: 220, petalPath, petSize: oppSize, colorRef: opportunity }
        ],
        spiScale: spiSize,
        spi,
        name: d["Country"],
        status: d["Status"],
      };
    });

    let hierarchy = d3.hierarchy(countries)

    // console.log('years', years);
    console.log('selected countries', selectedCountries);

    // console.log('makeFlower', makeFlower);

    container
      .selectAll('svg')
      .data(makeFlower, console.log(makeFlower))
      .join('svg')
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr('height', height)
      .attr('width', width)
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .each(function (d) {
        
        var svg = d3.select(this)
        //outer circle
        svg
          .append('circle')
          .attr('id', 'outer')
          .attr('cx', width / 2)
          .attr('cy', height / 2)
          .attr('r', svgSize)
          .style('fill', '#c4c2c4');

        //inner circle color determined by SPI score.
        svg
          .append('circle')
          .attr('cx', width * .5)
          .attr('cy', height * .5)
          .attr('r', d => svgSize * d.spiScale)
          .style('fill', d => { return scoreToColor(d.spi) })

        // each individual petal
        svg
          .selectAll('path')
          .data(d => d.petals, console.log('petals',d.petals)) 
          .join('path')
          .attr('id', 'petalPath')
          .attr('d', d => d.petalPath)
          .raise()
          .attr('transform', d => `translate(${width/2}, ${height/2}) rotate(${d.angle}) scale(${d.petSize})`)
          .style('stroke', 'black')
          .style('fill', d => { return scoreToColor(d.colorRef) })
          .join('text')
          // .append("textPath")
          .attr("href", "#petalPath")
          .attr('text-anchor', 'middle')
          .text(d => { return d.colorRef })

        //name
        svg
          .append('text')
          // .append("textPath")
          // .attr("xlink:href", "petalPath")
          .attr('class', 'name')
          .attr('text-anchor', 'middle')
          .attr('transform', (d, i) => `translate(${width/2},${height})`)
          .text(d => { return d.name })
          .exit().remove();

        //add score to inner circle
        svg
          .append('text')
          .attr('class', 'score')
          .attr('text-anchor', 'middle')
          .attr('transform', d => `translate(${svgSize},${svgSize * d.spiScale})`)
          // .attr('transform', (d,i) => `scale(${svgSize / 100})`) 
          .text(d => { return `SPI ${d.spi}`})
          .exit().remove();
      })
      container.exit().remove();
      console.log('svgRef', svgRef.current);
    };


  useEffect(()=>{
    renderTheFlowers();
    console.log('yearValue', yearValue, 'countryValue', countryValue);

  }, [yearValue, countryValue]);



  return (
    <svg ref={svgRef} id={'container'} height={height} width={width} ></svg>
  );
};

// DrawFlowers.propTypes = {
//   spiByYear: PropTypes.array,
//   yearValue: PropTypes.string.isRequired,
//   countryValue: PropTypes.string.isRequired
// };

export default DrawFlowers;