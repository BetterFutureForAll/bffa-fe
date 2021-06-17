import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import {
  colorScale,
  basicColorScale,
  foundationsColorScale,
  opportunityColorScale
} from '../services/SocialProgress';

const Header = ({ width, height, selectYears, yearValue, selectCountries, handleSubmit }) => {

  let legendRef = useRef(null);
  let legendPetals = useRef(null);
  let controlBarHeight = height / 10;
  let quarterWidth = (width / 4);
  let squareSize = (quarterWidth) / 12 ;
  
  useEffect(() => {
    
    let petalPath = 'M 0 0 c 100 100 80 0 100 0 C 80 0 100 -100 0 0';

    let legendData = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];


    // var xscale = d3.scaleLinear()
    // .domain([0, 100])
    // .range([0, quarterWidth - squareSize]);
    // var x_axis = d3.axisBottom(xscale);



    let categoryCircles = ["Basic Needs", "Opportunity", "Foundations of Wellbeing"];

    function ready() {
      console.log(width, height);
      var svg = d3.select(legendRef.current)
        .join("g")
      svg
        .selectAll("rect")
        .data(legendData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => {
          return 0 + (i * squareSize)
        })
        .attr("y", 0)
        .attr("height", squareSize)
        .attr("width", squareSize)
        .style("fill", d => colorScale(d))
        .join('text')
        .append('title')
        .text(d=> d)

      // svg.append("g")
      //   .call(x_axis)

      // svg
      //   .selectAll("g")
      //   .data(legendData)
      //   .enter()
      //   .append("g")
      //   .append("text")
      //   .attr('text-anchor', 'middle')
      //   .style("fill", "black")
      //   .attr("x", (d, i) => {
      //     return 12.5 + (i * 25)
      //   })
      //   .attr("y", +12.5)
      //   .attr("dy", ".25em")
      //   .text(d => d);

      var svgPetals = d3.select(legendPetals.current)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("id", "viewbox")
        .attr("viewBox", [0, 0, quarterWidth, controlBarHeight])
        .append("g")

      svgPetals
        .selectAll("circle")
        .data(categoryCircles)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => {
          return 25 + (i * 75) 
        })
        .attr("cy", 25)
        .attr("r", 25)
        .style('fill', basicColorScale(0))

      svgPetals
        .selectAll('g')
        .data(categoryCircles)
        .join('path')
        .attr('class', 'petalLegend')
        .attr('d', d => petalPath)
        .attr('transform',
          (d, i) => {
            let angle;
            if (d === "Basic Needs") {
              angle = 30;
            }
            if (d === "Opportunity") {
              angle = 270;
            }
            if (d === "Foundations of Wellbeing") {
              angle = 150;
            }
            return `translate(${25 + (i * 75)}, ${25}) rotate(${angle}) scale(.20)`
          })
        .style('stroke', 'black')
        .style('fill', d => {
          if (d === " ") {
            return basicColorScale(0)
          }
          if (d === "Basic Needs") {
            return basicColorScale(100)
          }
          if (d === "Opportunity") {
            return opportunityColorScale(100)
          }
          if (d === "Foundations of Wellbeing") {
            return foundationsColorScale(100)
          }
        })

      svgPetals
        .selectAll('g')
        .data(categoryCircles)
        .enter()
        .append("text")
        .attr('text-anchor', 'middle')
        .style("fill", "black")
        .style("font-size", "50%")
        .attr("x", (d, i) => {
          return 25 + (i * 75)
        })
        .attr("y", 45)
        .text(d => d)
    }
    ready();
  }, [width, height, controlBarHeight, quarterWidth, squareSize])



  return (
    <>
      <svg ref={legendRef} id={"legend"} className={'legend'} height={squareSize} width={quarterWidth}></svg>

      <svg ref={legendPetals} id={"legendPetals"} className={'legend'} height={controlBarHeight} width={quarterWidth}></svg>

      <form onSubmit={handleSubmit}>
        <label id="years" value={yearValue} >Year </label>
        {selectYears}
        {/* {selectCountries} */}
      </form>
    </>
  );
};

Header.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  selectYears: PropTypes.object,
  yearValue: PropTypes.string,
  handleSubmit: PropTypes.func
};

export default Header;
