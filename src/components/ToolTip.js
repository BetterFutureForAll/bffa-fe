import React, { useEffect } from 'react';
import * as d3 from 'd3';
import {
  colorScale,
  nameFixer
} from '../services/SocialProgress';

const ToolTip = ({ svgRef, tooltipData, loading, mapHeight, mapWidth, setClickedCallback, setClickedSubCat, clicked, clickedSubCat }) => {

  useEffect(() => {
    let data = [tooltipData];
    if (!svgRef || loading || !data) return;
    function ready() {

      if (!tooltipData) return;
      let x = mapWidth / 2 || 0;
      let y = mapHeight / 2 || 0;
      let fontSize = 16;

      let svg = d3.select(svgRef.current);
      svg.selectAll('.graphicTooltip').remove();

      let toolTip = svg
        .selectAll(".graphicTooltip")
        .data(data)
        .join('g')
        .attr('class', 'graphicTooltip')

      //Outer Circle
      toolTip
        .selectAll('.outer')
        .data(data)
        .join('circle')
        .attr('class', 'outer')
        .attr('id', d => d.id)
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 100)
        .style('fill', '#c4c2c4')
        .style("opacity", "0.5")
        .style('stroke', 'black')
        .attr("stroke-width", 1);

      //inner circle scaled to SPI score
      toolTip
        .selectAll('.inner')
        .data(data)
        .join("circle")
        .attr('class', 'inner')
        .attr('id', d => `${d.id}_inner`)
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", d => +d.score ?? 0)
        .style('fill', d => colorScale(d ? +d.score : 0))
        .style('stroke', 'black')
        .attr("cursor", "pointer")
        .attr("stroke-width", 1);

      //Dimension Background petals, 
      toolTip
        .selectAll('.petalBackgroundPath')
        .data(d => {
          return d.petals
        })
        .join('path')
        .attr('class', 'petalBackgroundPath')
        .attr("id", (d) => `${nameFixer(d.label)}_bp`)
        .attr('d', d => d.petalPath)
        .attr('transform', d => `translate(${x}, ${y}) rotate(${d.angle}) scale(${1})`)
        .style('stroke', 'black')
        .style('fill', d => d.color)
        .style("opacity", "0.50")
        .attr("cursor", "pointer")
        .on('mouseenter', showSubPetals)

      //Scaled Dimension Petals   
      toolTip
        .selectAll('.petalPath')
        .data(d => d.petals)
        .join('path')
        .attr('class', 'petalPath')
        .attr("id", d => `${nameFixer(d.label)}_petalPath`)
        .attr('d', d => d.petalPath)
        .attr('cx', x)
        .attr('cy', y)
        .attr('transform', d => `translate(${x}, ${y}) rotate(${d.angle}) scale(${d.scale * .01})`)
        .style('stroke', 'black')
        .style('fill', d => d.color)
        .attr("cursor", "pointer")
        .on('mouseenter', showSubPetals)

      //Arc Path
      var arc = d3.arc()
        .startAngle([(Math.PI * 2) / 3])
        .endAngle([0])
        .innerRadius([100])
        .outerRadius([120])
        .cornerRadius([10]);

      //Petal Arcs with names for the dimensions
      toolTip.selectAll('.petalArc')
        .data(d => d.petals)
        .join('path')
        .attr('class', 'petalArc')
        .attr('id', (d) => `arc_${nameFixer(d.label)}`)
        .attr('d', arc)
        .attr('x', x)
        .attr('y', y)
        .attr('fill', d => d.color)
        .attr('transform', d => `translate(${x}, ${y}) rotate(${d.angle + 30}) scale(${1})`)


      toolTip.selectAll('.petalArcText').remove();
      toolTip.selectAll('.petalArcText')
        .data(d => d.petals)
        .join(enter => {
          let textArc = enter.append('text')
            .attr('class', 'petalArcText')
            .attr("dy", -5)

          textArc.append('textPath').style("text-anchor", "middle")
            .attr("xlink:href", d => `#arc_${nameFixer(d.label)}`)
            .attr("font-size", fontSize)
            .attr("pointer-events", "none")
            .attr("startOffset", d => { return (d.angle === 270) ? 370 : 130; })
            .text(d => {
              //Handles Partial Scores
              let rounded = (+d.score).toFixed() || 0;
              return `${d.label}-${+rounded === 0? " N / A" : rounded}`;
            });
          return textArc;
        })

      toolTip.selectAll(".nameText").remove();
      function getBB(selection) {
        selection.each(function (d) { d.bbox = this.getBBox(); })
      }
      let nameText = toolTip.selectAll(".nameText")
        .data(data)
        .join("g")
        .attr("class", "textGroup")

      nameText.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('class', 'nameBox')
        .style("fill", "rgba(255, 255, 255, 0.5)")
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', -125)
        .attr('rx', 5)
        .attr('ry', 5)

      nameText.selectAll('text')
        .data(data)
        .join("text")
        .attr('class', 'nameText')
        .text(d => {
          let score = (+d.score).toFixed() === 0 ? 'N / A' : (+d.score).toFixed();
          return `${d.name}-${score}`
        })
        .attr('x', 0)
        .attr('y', -130)
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${x}, ${(y)})`)
        .attr("font-weight", 700)
        .attr("font-size", fontSize)

      nameText.call(getBB);

      nameText.select(".nameBox")
        .attr("width", function (d) { return d.bbox.width })
        .attr("height", function (d) { return d.bbox.height })
        .attr('transform', d => `translate(${x - (d.bbox.width / 2)}, ${(y - (d.bbox.height))})`)

      // ****** MouseOver Functions start here ******** ///
      var textTooltip = toolTip.selectAll(".tooltip-text-area")
        .style("opacity", 0);

      var mouseover = function (event, d) {
        setClickedSubCat(d.label);
        let [mouseX, mouseY] = [event.x || x, event.y || y];

        textTooltip
          .style("opacity", 1)

          let mouseGroup = toolTip
          .selectAll(".tooltip-text-area")
          .data([d])
          .join('g')
          .attr('class', "tooltip-text-area")
          .attr("pointer-events", "none")

        mouseGroup.selectAll('.nameBox')
          .data([d])
          .join('rect')
          .attr('class', 'nameBox')
          .attr('x', mouseX)
          .attr('y', mouseY)
          .attr('rx', 10)
          .attr('ry', 10)
          .style("fill", "rgba(255, 255, 255, 0.5)")

        let mouseText = mouseGroup
          .selectAll("text")
          .data([d])
          .join('text')
          .style("opacity", 1)
          .attr('x', mouseX)
          .attr('y', mouseY)
          .attr("font-size", fontSize)
          .attr('text-anchor', 'middle')
          .attr("font-weight", 600)

        mouseText.selectAll('.nameSpan')
          .data([d])
          .join("tspan")
          .attr('class', "nameSpan")
          .text(d => `${d.label}`)
          .attr('x', mouseX)
          .attr('y', mouseY)
          .attr('dy', '1.5em')

        mouseText.selectAll('.scoreSpan')
          .data([d])
          .join("tspan")
          .attr('class', "nameSpan")
          .attr('x', mouseX)
          .attr('y', mouseY)
          .text(d => `${(+d.score).toFixed()}`)
          .attr('dy', '+2.5em')


        mouseGroup.call(getBB)

        mouseGroup.select(".nameBox")
          .attr("width", function (d) { return d.bbox.width })
          .attr("height", function (d) { return d.bbox.height })
          .attr('transform', d => `translate(${-(d.bbox.width / 2)}, ${10})`)
      };

      var mousemove = function (event, d) {
        let [mouseX, mouseY] = [event.x || x, event.y || y];
        let targetData = `${d.label}`;
        d3.selectAll('.subPetalBackgroundPath') //Background Petals
          .style("opacity", (d, i) => (`${d.label}` === targetData) ? ".5" : ".01")

        d3.selectAll('.subPetalBackgroundPath') //Highlighted Petal
          .style("fill", (d, i) => (`${d.label}` === targetData) ? "white" : `${d.color}`);

        toolTip
          .selectAll(".tooltip-text-area")
          .attr('x', mouseX)
          .attr('y', mouseY)
      };

      function showSubPetals(event, d) {
        let subPetalPath = "M 0 0 L 85 15 A 1 1 0 0 0 85 -15 L 0 0";
        setClickedCallback(d.label);

        toolTip
          .selectAll('.subPetalBackgroundPath')
          .data(d.subPetals)
          .join('path')
          .attr('class', 'subPetalBackgroundPath')
          .attr("id", d => `${nameFixer(d.label)}_subPetalBackground`)
          .attr('d', subPetalPath)
          .attr('transform', d => `translate(${x}, ${y}) rotate(${d.angle}) scale(${1})`)
          .style('stroke', 'black')
          .style('fill', d => {
            return d.color
          })
          .style('opacity', '.1')
          .attr("cursor", "crosshair");

        toolTip
          .selectAll('.subPetalPath')
          .data(d.subPetals)
          .join('path')
          .attr('class', 'subPetalPath')
          .attr("id", d => `${d.label}_subPetal`)
          .attr('d', subPetalPath)
          .attr('transform', d => `translate(${x}, ${y}) rotate(${d.angle}) scale(${d.scale * .01})`)
          .style('stroke', 'black')
          .style('fill', d => {
            return d.color
          })
          .attr("cursor", "crosshair");

        d3.selectAll('.subPetalPath, .subPetalBackgroundPath')
          .on("mouseenter", mouseover)
          .on("mousemove", mousemove)
          .on("click", mouseClick);
      }

      let mouseClick = function (event, d) {
        setClickedSubCat(d.label);
      };

      if (clicked) {
        d3.select(`#${nameFixer(clicked)}_bp`).dispatch("mouseenter")
      }
      if (clickedSubCat) {
        d3.select(`#${nameFixer(clickedSubCat)}_subPetalBackground`).dispatch("mouseenter")
        d3.select(`#${nameFixer(clickedSubCat)}_subPetalBackground`).dispatch("mousemove")
      }
      toolTip.raise();
    };

    ready();
  }, [svgRef, tooltipData, loading, mapHeight, mapWidth, clicked, setClickedCallback, setClickedSubCat, clickedSubCat]);

  return (
    <></>
  );

};
export default ToolTip;