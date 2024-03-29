import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { colorScale } from '../services/SocialProgress';

const Legend = ({ width, height }) => {

  let legendRef = useRef(null);
  let legendData = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  let squareSize = ((width) / 13 > 25) ? (width) / 13 : 26;

  if (width < 376) {
    squareSize = 26;
  };

  useEffect(() => {
    let svg = d3.select(legendRef.current);
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
            .attr('rx', 7.5)
            .attr('ry', 7.5)
            .style("fill", d => {
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
    <div id={"legend"} className={'legend'} >
      <svg ref={legendRef}height={squareSize} width={squareSize * 11}></svg>
    </div>
    </>
  );
};

Legend.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number
};

export default Legend;
