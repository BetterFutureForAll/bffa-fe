import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import {
  colorScale,
  basicColorScale,
  foundationsColorScale,
  opportunityColorScale
} from '../services/SocialProgress';

const Header = ({ selectYears, yearValue, selectCountries, handleSubmit }) => {

  let legendRef = useRef(null);
  let legendPetals = useRef(null);

  useEffect(() => {

    let petalPath = 'M 0 0 c 100 100 80 0 100 0 C 80 0 100 -100 0 0';

    let legendData = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

    let categoryCircles = ["Basic Needs", "Opportunity", "Foundations of Wellbeing"];
    function ready() {

      var svg = d3.select(legendRef.current)
        .append("g")
      svg
        .selectAll("svg")
        .data(legendData)
        .enter()
        .append("svg")
        .append("rect")
        .attr("x", (d, i) => {
          return 0 + (i * 25)
        })
        .attr("y", 0)
        .attr("height", 25)
        .attr("width", 25)
        .style("fill", d => colorScale(d))

      svg
        .selectAll("g")
        .data(legendData)
        .enter()
        .append("g")
        .append("text")
        .attr('text-anchor', 'middle')
        .style("fill", "black")
        .attr("x", (d, i) => {
          return 12.5 + (i * 25)
        })
        .attr("y", +12.5)
        .attr("dy", ".25em")
        .text(d => d);

      var svgPetals = d3.select(legendPetals.current)
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
        .attr("r", 20)
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
              angle = 150;
            }
            if (d === "Foundations of Wellbeing") {
              angle = 270;
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
    console.log("Legend Created");
  }, [])



  return (
    <>
      <svg ref={legendRef} id={"legend"} height={50} width={300}></svg>
      <svg ref={legendPetals} id={"legendPetals"} height={50} width={300}></svg>

      <form onSubmit={handleSubmit}>
        <label id="years" value={yearValue} >Select a year </label>
        {selectYears}
        {selectCountries}
      </form>
    </>
  );
};

Header.propTypes = {
  selectYears: PropTypes.object,
  yearValue: PropTypes.string,
  handleSubmit: PropTypes.func
};

export default Header;
