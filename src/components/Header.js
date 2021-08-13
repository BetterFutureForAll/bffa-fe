import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import {
  colorScale,
  // basicColorScale,
  // foundationsColorScale,
  // opportunityColorScale
} from '../services/SocialProgress';

const Header = ({ width, height, selectYears, yearValue, selectCountries, handleSubmit, toggleModal }) => {

  let legendRef = useRef(null);
  let controlBarHeight = height / 10;
  let quarterWidth = (width / 4);
  let squareSize = (width / 3 ) / 12 ;
  let radiusScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, (controlBarHeight/2)]);

  useEffect(() => {
    let legendData = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

    function ready() {
      var svg = d3.select(legendRef.current)
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
    }
    ready();

  }, [width, height, controlBarHeight, quarterWidth, squareSize, radiusScale])

  return (
    <>
      <svg ref={legendRef} id={"legend"} className={'legend'} height={squareSize} width={width / 3}></svg>

      <button id="myBtn" onClick={toggleModal}>Definitions</button>

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
  handleSubmit: PropTypes.func,
  toggleModal: PropTypes.func
};

export default Header;
