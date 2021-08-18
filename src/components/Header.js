import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { colorScale } from '../services/SocialProgress';

const Header = ({ width, height, selectYears, yearValue, handleSubmit, toggleModal }) => {
  let legendRef = useRef(null);
  let legendData = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  let squareSize = (width / 3) / 12;
  useEffect(() => {
    let svg = d3.select(legendRef.current)
    svg
      .selectAll("g")
      .data(legendData)
      .join(
        enter => {
          let root = enter.append("g")
          root.append("text")
            .text(d => d);
          root.append("rect");
          return root;
        },
        update => {
          update.selectAll("rect")
            .attr("class", "colorSquare")
            .attr("height", squareSize)
            .attr("width", squareSize)
            .style("fill", d => {
              console.log(d);
              return colorScale(d)
            });
          update.selectAll("text")
            .attr("class", "legendText")
            .attr("x", squareSize / 2)
            .attr("y", squareSize / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr("font-size", 16)
            .raise();

          return update;
        }
      )
      .attr("transform", (d, i) => { return "translate(" + i * squareSize + ", 0)"; });

  }, [width, height, legendData, squareSize])

  return (
    <>
      <svg ref={legendRef} id={"legend"} className={'legend'} height={squareSize} width={width / 3}></svg>

      <button id="myBtn" onClick={toggleModal}>Data Definitions</button>

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
