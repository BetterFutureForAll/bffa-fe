import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { colorScale } from '../services/SocialProgress';

const ControlBar = ({
  width,
  height,
  selectYears,
  yearValue,
  handleSubmit,
  selectCountries,
  handleCountryChange,
  countryValue,
  spiData
}) => {

  let legendRef = useRef(null);
  let legendData = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  let squareSize = ((width / 3) / 12 > 25) ? (width / 3) / 12 : 26;
  if (width < 376) {
    squareSize = 26;
  };

  let scoreText = useRef('');

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

    scoreText.current = spiData ? spiData[0].score_spi : '';
  }, [width, height, legendData, squareSize, spiData])

  return (
    <>
      <div className="select-countries-div">
        <form onSubmit={handleCountryChange}>
          <label id="country_list" value={countryValue} ></label>
          {selectCountries}
        </form>
        <h3 id='score-text'>{`${scoreText.current}`}</h3>
      </div>

      <svg ref={legendRef} id={"legend"} className={'legend'} height={squareSize} width={squareSize * 11}></svg>

      <form onSubmit={handleSubmit}>
        <label id="years" value={yearValue} ></label>
        {selectYears}
      </form>

    </>
  );
};

ControlBar.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  selectYears: PropTypes.object,
  yearValue: PropTypes.string,
  handleSubmit: PropTypes.func,
  toggleModal: PropTypes.func
};

export default ControlBar;
