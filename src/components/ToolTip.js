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

  let spiScale = d3.scaleLinear().domain([0, 100]).range([0, 100]);
  let petalPath = 'M 0 0 c 100 100 80 0 100 0 C 80 0 100 -100 0 0';
  let subPetalPath = "M 0 0 L 85 15 A 1 1 0 0 0 85 -15 L 0 0";

  function ready() {
    let { svgRef, center, name, data } = tooltipContext.context;

    if (!data) return;

    let x = center[0];
    let y = center[1];

    let svg = d3.select(svgRef.current);
    svg.selectAll('.graphicTooltip').remove();
    let toolTip = svg.insert("g")
      .attr('class', 'graphicTooltip')
    // let toolTip = svg.selectAll('.graphicTooltip');
    toolTip
      .selectAll('.outer')
      .data([data[0]])
      .join('circle')
      .attr('class', 'outer')
      .attr('id', d=>{
        return d})
      .attr("cx", x)
      .attr("cy", y)
      // .attr("r", 0)
      // .transition().duration([750])
      .attr("r", 100)
      .style('fill', '#c4c2c4')
      .style("opacity", "0.5")
      .style('stroke', 'black')

    toolTip
      .selectAll('.inner')
      .data([data[0]])
      .join("circle")
      .attr('class', 'inner')
      .attr('id', name)
      .attr("cx", center[0])
      .attr("cy", center[1])
      .attr("r", 0)
      .transition().duration([750])
      .attr("r", d => d ? +d["Social Progress Index"] : 0  )
      .style('fill', d => colorScale(d ? +d["Social Progress Index"] : 0 ))
      .style('stroke', 'black')
      .attr("cursor", "pointer")
// make 3 separate petals here
      toolTip
        .selectAll('.petalBackgroundPath')
        .data([data[0]])
        .join('path')
        .attr('class', 'petalBackgroundPath')
        .attr("id", (d, i) => `${d["Country Name"]}`)
        .attr('d', petalPath)
        .attr('transform', `translate(${center[0]}, ${center[1]}) rotate(${30}) scale(${0})`)
        .transition().duration(750)
        .attr('transform', `translate(${center[0]}, ${center[1]}) rotate(${30}) scale(${spiScale(100) *.01})`)
        .style('stroke', 'black')
        .style('fill', d => colorScale(100))
        .style("opacity", "0.50")
        .attr("cursor", "pointer")

      toolTip
        .selectAll('.petalPath')
        .data([data[0]])
        .join('path')
        .attr('class', 'petalPath')
        .attr("id", (d, i) => `${d.id}${d.text}`)
        .attr('d', petalPath)
        .attr('transform', `translate(${center[0]}, ${center[1]}) rotate(${30}) scale(${0})`)
        .style('fill', colorScale(0))
        .transition().duration(1000)
        .attr('transform', d => {
          return `translate(${center[0]}, ${center[1]}) rotate(${30}) scale(${spiScale(d ? +d["Basic Human Needs"] : 0) *.01})`
        })
        .style('stroke', 'black')
        .style('fill', d => colorScale(d ? +d["Basic Human Needs"] : 0))
        .attr("cursor", "pointer")



    toolTip
      .on("mouseleave", () => toolTip.remove())
  };


  useEffect(() => {
    ready();
  }, [tooltipContext]);

  return (
    <></>
  );

};
export default ToolTip;