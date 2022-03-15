import React, { useEffect } from 'react';
import * as d3 from 'd3';
import {
  colorScale,
  basicColorScale,
  foundationsColorScale,
  opportunityColorScale
} from '../services/SocialProgress';

// needs X, Y, and SPI Data set
const ToolTip = ({ tooltipContext, toggleModal, zoomState, selectTarget }) => {

  useEffect(() => {

    let spiScale = d3.scaleLinear().domain([0, 100]).range([0, 100]);
    let petalPath = 'M 0 0 c 100 100 80 0 100 0 C 80 0 100 -100 0 0';
    let subPetalPath = "M 0 0 L 85 15 A 1 1 0 0 0 85 -15 L 0 0";

    function ready() {
      let { svgRef, center, data } = tooltipContext;
      if (!data) return;

      function parsedData(d) {
        // returning values as is, needs Keys and Values/ 

        let basics = Object.assign({},
          { "Basic Human Needs": d["Basic Human Needs"] },
          { scale: spiScale(d["Basic Human Needs"]) },
          { color: basicColorScale(d["Basic Human Needs"]) },
          {
            subPetals:
              [
                { "Nutrition and Basic Medical Care": d["Nutrition and Basic Medical Care"], colorFn: basicColorScale, angle: 0 },
                { 'Water and Sanitation': d['Water and Sanitation'], colorFn: basicColorScale, angle: 20 },
                { 'Shelter': d['Shelter'], colorFn: basicColorScale, angle: 40 },
                { 'Personal Safety': d['Personal Safety'], colorFn: basicColorScale, angle: 60 }
              ]
          },
          { angle: 30 });

        let foundations = Object.assign({},
          { "Foundations of Wellbeing": d["Foundations of Wellbeing"] },
          { scale: spiScale(d["Foundations of Wellbeing"]) },
          { color: foundationsColorScale(d["Foundations of Wellbeing"]) },
          {
            subPetals:
              [
                { "Access to Basic Knowledge": d["Access to Basic Knowledge"], colorFn: foundationsColorScale, angle: 120 },
                { 'Access to Information and Communications': d['Access to Information and Communications'], colorFn: foundationsColorScale, angle: 140 },
                { 'Health and Wellness': d['Health and Wellness'], colorFn: foundationsColorScale, angle: 160 },
                { 'Environmental Quality': d['Environmental Quality'], colorFn: foundationsColorScale, angle: 180 }
              ]
          },
          { angle: 150 });

        let opportunity = Object.assign({},
          { "Opportunity": d["Opportunity"] },
          { scale: spiScale(d["Opportunity"]) },
          { color: opportunityColorScale(d["Opportunity"]) },
          {
            subPetals:
              [
                { 'Personal Rights': d['Personal Rights'], colorFn: opportunityColorScale, angle: 240 },
                { "Personal Freedom and Choice": d["Personal Freedom and Choice"], colorFn: opportunityColorScale, angle: 260 },
                { 'Inclusiveness': d['Inclusiveness'], colorFn: opportunityColorScale, angle: 280 },
                { 'Access to Advanced Education': d['Access to Advanced Education'], colorFn: opportunityColorScale, angle: 300 }
              ]
          },
          { angle: 270 });

        let result = Object.assign({}, d, { petals: [basics, foundations, opportunity] })

        return [result];
      }

      let svg = d3.select(svgRef.current);

      svg.selectAll('.graphicTooltip').remove();

      let x, y;
      if (data[0]['SPI country code'] === 'WWW') {
        x = (+center[0] - +zoomState.x) / zoomState.k;
        y = (+center[1] - +zoomState.y) / zoomState.k;
      } else {
        x = svg.select(`#${data[0]['SPI country code']}_target`).attr('cx');
        y = svg.select(`#${data[0]['SPI country code']}_target`).attr('cy');
      }


      let fontSize = 16 / zoomState.k;

      let toolTip = svg
        .insert('g')
        .data(parsedData(data[0]))
        .attr('class', 'graphicTooltip')


      toolTip.attr('transform', `translate(${zoomState.x}, ${zoomState.y}) scale(${zoomState.k})`)

      // Stoke width needs to adjust for circles, not petals
      // .attr("stroke-width", 1 / zoomState.k)

      toolTip
        .selectAll('.outer')
        .data(d => [d])
        .join('circle')
        .attr('class', 'outer')
        .attr('id', d => {
          return Object.keys(d)[0]
        })
        .attr("cx", x)
        .attr("cy", y)
        // .attr("r", 0)
        // .transition().duration(500)
        .attr("r", 100 / zoomState.k)
        .style('fill', '#c4c2c4')
        .style("opacity", "0.5")
        .style('stroke', 'black')
        .attr("stroke-width", 1 / zoomState.k)

      toolTip
        .selectAll('.inner')
        .data(d => [d])
        .join("circle")
        .attr('class', 'inner')
        .attr('id', d => `${Object.keys(d)[0]}_inner`)
        .attr("cx", x)
        .attr("cy", y)
        // .attr("r", 0)
        // .transition().duration(750)
        .attr("r", d => d ? +d["Social Progress Index"] / zoomState.k : 0)
        .style('fill', d => colorScale(d ? +d["Social Progress Index"] : 0))
        .style('stroke', 'black')
        .attr("cursor", "pointer")
        .attr("stroke-width", 1 / zoomState.k)

      // make 3 separate petals here
      let subPetals = toolTip
        .selectAll('.petalBackgroundPath')
        .data(d => d.petals)
        .join('path')
        // append 3 petals.
        .attr('class', 'petalBackgroundPath')
        .attr("id", (d, i) => {
          return `${Object.keys(d)[0]}_bp`
        })
        .attr('d', petalPath)
        // .attr('transform', d => `translate(${x}, ${y}) rotate(${d.angle}) scale(0)`)
        // .transition().duration(750)
        .attr('transform', d => `translate(${x}, ${y}) rotate(${d.angle}) scale(${spiScale(100) * .01 / zoomState.k})`)
        .style('stroke', 'black')
        .style('fill', d => d.color)
        .style("opacity", "0.50")
        .attr("cursor", "pointer")

      toolTip
        .selectAll('.petalPath')
        .data(d => d.petals)
        .join('path')
        .attr('class', 'petalPath')
        .attr("id", d => `${Object.keys(d)[0]}_petalPath`)
        .attr('d', petalPath)
        .attr('x', x)
        .attr('y', y)
        .attr('transform', d => {
          return `translate(${x}, ${y}) rotate(${d.angle}) scale(${0})`
        })
        .style('fill', colorScale(0))
        .transition().duration(1000)
        .attr('transform', d => {
          return `translate(${x}, ${y}) rotate(${d.angle}) scale(${d.scale * .01 / zoomState.k})`
        })
        .style('stroke', 'black')
        .style('fill', d => d.color)
        .attr("cursor", "pointer");


      toolTip.selectAll(".nameText")
        .data(d => [d])
        .join(group => {
          let enter = group.append('text')
          enter
            .append("tspan")
            .text(d => `${d["Country"]}`)
            .attr('x', 0)
            .attr('y', spiScale(120) / zoomState.k)
            .attr('dy', '1em')
          enter
            .append("tspan")
            .text(d => {
              let rounded = (+d["Social Progress Index"]).toFixed();
              if (+rounded === 0) {
                return `Score Unavailable`;
              }
              return `${rounded}`;
            })
            .attr('x', 0)
            .attr('y', spiScale(120) / zoomState.k)
            .attr('dy', '2em')
          return enter;
        })
        .attr('class', 'nameText')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${x}, ${(y + spiScale(140))})`)
        .attr("font-weight", 700)
        .attr("font-size", fontSize)

      // ****** MouseOver Functions start here ******** ///
      var textTooltip = toolTip.selectAll(".tooltip-text-area")
        .style("opacity", d => {
          return 0
        });

      var mouseover = function (event, d) {
        textTooltip
          .style("opacity", 1)
      };

      // adjust for major petals
      var mousemove = function (event, d) {
        toolTip.selectAll(".tooltip-text-area").remove();

        let mouseZoomX = (+event.x - +zoomState.x) / zoomState.k;
        let mouseZoomY = (+event.y - +zoomState.y) / zoomState.k;
        let roundedNum = (+Object.values(d)[0]).toFixed();

        // let target = (Object.keys(d)[0]);
        // selectTarget({ subPetal: target } );

        textTooltip
          .data(d => [d])
          .join(group => {
            let enter = group.append('text')
            enter
              .append("tspan")
              .text(`${Object.keys(d)[0]}`)
              .attr('x', mouseZoomX)
              .attr('y', mouseZoomY)
              .attr('dy', '-2em')
            enter
              .append("tspan")
              .text(`${roundedNum}`)
              .attr('x', mouseZoomX)
              .attr('y', mouseZoomY)
              .attr('dy', '-1em')
            return enter;
          })
          .attr("pointer-events", "none")
          .attr('class', "tooltip-text-area")
          .attr("font-size", fontSize)
          .attr('text-anchor', 'middle')
          .attr("font-weight", 700)
          .attr('style', 'text-shadow: 2px 2px white, -2px -2px white, 2px -2px white, -2px 2px white;')
          .attr('background-color', 'gray;')

        textTooltip.raise()

      };

      svg.select(`#${data[0]['SPI country code']}_target`).raise();


      var mouseout = function (event, d) {
        d3.selectAll('.tooltip-text-area').remove();
        // textTooltip.remove();
      };

      function showSubPetals(event, d) {

        toolTip
          .selectAll('.subPetalBackgroundPath')
          .data(d.subPetals)
          .join('path')
          .attr('class', 'subPetalBackgroundPath')
          .attr("id", d => `${Object.keys(d)[0]}_subPetalBackground`)
          .attr('d', subPetalPath)
          .attr('transform', d => `translate(${x}, ${y}) rotate(${d.angle}) scale(${spiScale(1) / zoomState.k})`)
          .style('stroke', 'black')
          .style('fill', d => {
            return d.colorFn(Object.values(d)[0])
          })
          .style('opacity', '.10')
          .attr("cursor", "crosshair");

        toolTip
          .selectAll('.subPetalPath')
          .data(d.subPetals)
          .join('path')
          .attr('class', 'subPetalPath')
          .attr("id", d => `${Object.keys(d)[0]}_subPetal`)
          .attr('d', subPetalPath)
          .attr('transform', d => `translate(${x}, ${y}) scale(${0})`)
          .transition().duration(750)
          .attr('transform', d => `translate(${x}, ${y}) rotate(${d.angle}) scale(${spiScale(Object.values(d)[0]) * .01 / zoomState.k})`)
          .style('stroke', 'black')
          .style('fill', d => {
            return d.colorFn(Object.values(d)[0])
          })
          .attr("cursor", "crosshair");

        subPetals
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseout", mouseout)

        d3.selectAll('.petalPath, .subPetalPath, .subPetalBackgroundPath')
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseout", mouseout)
      }

      function showPetalArc(event, d) {
        var arc = d3.arc()
          .startAngle([(Math.PI * 2) / 3])
          .endAngle([0])
          .innerRadius([100])
          .outerRadius([120])
          .cornerRadius([10]);

        toolTip.selectAll('.petalArc')
          .data([d])
          .join('path')
          .attr('class', 'petalArc')
          .attr('id', (d, i) => {
            return `arc_${Object.keys(d)[0]}`
          })
          .attr('d', arc)
          .attr('fill', d => d.color)
          .attr('transform', d => `translate(${x}, ${y}) rotate(${d.angle + 30}) scale(${1 / zoomState.k})`)
          .attr("cursor", "alias")


        toolTip.selectAll('.petalText')
          .data([d])
          .join('text')
          .attr('class', 'petalText')
          .attr("dy", -5 / zoomState.k)
          .append('textPath')
          .style("text-anchor", "middle")
          .attr("xlink:href", d => {
            return `#arc_${Object.keys(d)[0]}`
          })
          .attr("font-size", fontSize)
          // .attr("fill", d => {
          //   let fontColor = 'black'
          //   if (d.angle === 30 && d.petSize > 85) {
          //     fontColor = 'yellow'
          //   }
          //   return fontColor;
          // })
          .attr("pointer-events", "none")
          .attr("startOffset", function (d) {
            if (d.angle === 270) {
              return 370 / zoomState.k;
            }
            if (d.angle === 30) {
              return 130 / zoomState.k;
            }
            else {
              return 130 / zoomState.k;
            }
          })
          .text(d => {
            let rounded = (+Object.values(d)[0]).toFixed();
            return `${Object.keys(d)[0]}-${rounded}`;
          });

        // let target = Object.keys(d)[0];
        // extract to App level
        // selectTarget(target)

        toolTip.selectAll('.petalArc')
          .on('click', toggleModal)
      };



      function doItAll(event, d) {
        toolTip.selectAll('.petalArc').remove();
        toolTip.selectAll('.petalText').remove();
        showSubPetals(event, d);
        showPetalArc(event, d);
      }
      // add mouseout fn's to subpetals / petals
      d3.selectAll('.petalPath').on('mouseenter', doItAll)

      d3.selectAll('.backgroundPetalPath').on('mouseenter', doItAll)

      toolTip
        .on("mouseleave", () => toolTip.remove())
    };

    ready();

  }, [tooltipContext, zoomState, toggleModal]);

  return (
    <></>
  );

};
export default ToolTip;