import React, { useEffect } from 'react';
import * as d3 from 'd3';
import {
  colorScale,
  basicColorScale,
  foundationsColorScale,
  opportunityColorScale
} from '../services/SocialProgress';

// needs X, Y, and SPI Data set
const ToolTip = (tooltipContext) => {
  // let graphicTooltip = <foreignobject x={x} y={y} width={100} height={50}/>;
  // let textToolTip = <foreignobject x={x} y={y} width={100} height={50}/>;
  let spiScale = d3.scaleLinear().domain([0, 100]).range([0, 100]);
  
  function ready() {
    let {svgRef, center, name } = tooltipContext.context;
    console.log('ToolTip function', tooltipContext);
    console.log(svgRef);
    if(!svgRef) return;
    let x = center[0];
    let y = center[1];
    let svg = d3.select(svgRef.current);
    console.log('svg',svg);
    svg.insert("circle")
    .attr('class', 'outer')
    .attr('id', name)
    .attr("cx", x)
    .attr("cy", y)
    .attr("r", 50)
    .transition().duration([750])
    .attr("r", spiScale(100))
    .style('fill', '#c4c2c4')
    .style("opacity", "0.5")
    .style('stroke', 'black')

  };


  useEffect(()=>{
    ready();
  }, [tooltipContext]);

  return (
    <></>
  );

};
export default ToolTip;