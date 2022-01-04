import React, { useEffect } from 'react';
import * as d3 from 'd3';
import {
  colorScale,
  basicColorScale,
  foundationsColorScale,
  opportunityColorScale
} from '../services/SocialProgress';

// needs X, Y, and SPI Data set
const ToolTip = ({ tooltipContext, toggleModal, zoomState }) => {

  let spiScale = d3.scaleLinear().domain([0, 100]).range([0, 100]);
  let petalPath = 'M 0 0 c 100 100 80 0 100 0 C 80 0 100 -100 0 0';
  let subPetalPath = "M 0 0 L 85 15 A 1 1 0 0 0 85 -15 L 0 0";

  function ready() {
    let { svgRef, center, name, data } = tooltipContext;

    if (!data || data === undefined) return;

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

    let x = center[0];
    let y = center[1];

    let svg = d3.select(svgRef.current);

    svg.selectAll('.graphicTooltip').remove();
    let toolTip = svg.insert("g")
      .data(parsedData(data[0]))
      .attr('class', 'graphicTooltip')

    // let toolTip = svg.selectAll('.graphicTooltip');
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
      // .transition().duration([750])
      .attr("r", 100)
      .style('fill', '#c4c2c4')
      .style("opacity", "0.5")
      .style('stroke', 'black')

    toolTip
      .selectAll('.inner')
      .data(d => [d])
      .join("circle")
      .attr('class', 'inner')
      .attr('id', d => `${Object.keys(d)[0]}_inner`)
      .attr("cx", center[0])
      .attr("cy", center[1])
      .attr("r", 0)
      .transition().duration([750])
      .attr("r", d => d ? +d["Social Progress Index"] : 0)
      .style('fill', d => colorScale(d ? +d["Social Progress Index"] : 0))
      .style('stroke', 'black')
      .attr("cursor", "pointer")

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
      // .attr('transform', `translate(${center[0]}, ${center[1]}) rotate(${30}) scale(${0})`)
      // .transition().duration(750)
      .attr('transform', d => `translate(${center[0]}, ${center[1]}) rotate(${d.angle}) scale(${spiScale(100) * .01})`)
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
      .attr('x', center[0])
      .attr('y', center[1])
      .attr('transform', d => {
        return `translate(${center[0]}, ${center[1]}) rotate(${d.angle}) scale(${0})`
      })
      .style('fill', colorScale(0))
      .transition().duration(1000)
      .attr('transform', d => {
        return `translate(${center[0]}, ${center[1]}) rotate(${d.angle}) scale(${d.scale * .01})`
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
          .attr('y', 0)
        enter
          .append("tspan")
          .text(d => {
            let rounded = (+d["Social Progress Index"]).toFixed();
            return `${rounded}`;
          })
          .attr('x', 0)
          .attr('y', 0)
          .attr('dy', '1em')
        return enter;
      })
      .attr('class', 'nameText')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${x}, ${(y + spiScale(140))})`)
      .attr("font-weight", 700)

    // ****** MouseOver Functions start here ******** ///
    var textTooltip = toolTip.selectAll(".tooltip-text-area")
      .style("opacity", d => {
        return 0
      });

    var mouseover = function (event, d) {
      textTooltip
        .style("opacity", 1)
    };

    var mousemove = function (event, d) {
      toolTip.selectAll(".tooltip-text-area").remove();
      let x = event.x;
      let y = event.y;
      let roundedNum = (+Object.values(d)[0]).toFixed();


      textTooltip
        .data(d => [d])
        .join(group => {
          let enter = group.append('text')
          enter
            .append("tspan")
            .text(`${Object.keys(d)[0]}`)
            .attr('x', 0)
            .attr('y', 0)
          enter
            .append("tspan")
            .text(`${roundedNum}`)
            .attr('x', 0)
            .attr('y', 0)
            .attr('dy', '1em')
          return enter;
        })
        .attr("pointer-events", "none")
        .attr('class', "tooltip-text-area")
        .attr("font-size", 16)
        .attr('text-anchor', 'middle')
        .attr("font-weight", 700)
        .attr('style', 'text-shadow: 2px 2px white, -2px -2px white, 2px -2px white, -2px 2px white;')
        .attr('background-color', 'gray;')
        .attr('transform', `translate(${x}, ${y})`)
    };

    var mouseleave = function (event, d) {
      textTooltip
        .style("opacity", 0)
        .style("stroke", "none")
    };

    function showSubPetals(event, d) {
      let x = center[0];
      let y = center[1];

      toolTip
        .selectAll('.subPetalPath')
        .data(d.subPetals)
        .join('path')
        .attr('class', 'subPetalPath')
        .attr("id", d => `${Object.keys(d)[0]}_subPetal`)
        .attr('d', subPetalPath)
        .attr('transform', d => `translate(${x}, ${y}) scale(${0})`)
        .transition().duration(750)
        .attr('transform', d => `translate(${x}, ${y}) rotate(${d.angle}) scale(${spiScale(Object.values(d)[0]) * .01})`)
        .style('stroke', 'black')
        .style('fill', d => {
          return d.colorFn(Object.values(d)[0])
        })
        .attr("cursor", "crosshair");

      d3.selectAll('.subPetalPath')
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
      //   .on('click', mousemove)
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
        .attr('transform', d => `translate(${center[0]}, ${center[1]}) rotate(${d.angle + 30}) scale(${1})`)
        .attr("cursor", "alias")


      toolTip.selectAll('.petalText')
        .data([d])
        .join('text')
        .attr('class', 'petalText')
        .attr("dy", -5)
        .append('textPath')
        .style("text-anchor", "middle")
        .attr("xlink:href", d => {
          return `#arc_${Object.keys(d)[0]}`
        })
        .attr("font-size", 16)
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
            return 370;
          }
          if (d.angle === 30) {
            return 130;
          }
          else {
            return 130;
          }
        })
        .text(d => {
          let rounded = (+Object.values(d)[0]).toFixed();
          return `${Object.keys(d)[0]}-${rounded}`;
        });

      toolTip.selectAll('.petalArc')
      .on('click', toggleModal)
    };



    function doItAll(event, d) {
      toolTip.selectAll('.petalArc').remove();
      toolTip.selectAll('.petalText').remove();
      showSubPetals(event, d);
      showPetalArc(event, d);
    }

    d3.selectAll('.petalPath').on('mouseenter', doItAll)
    d3.selectAll('.backgroundPetalPath').on('mouseenter', doItAll)


    //  Make a proper Zoom function
    d3.selectAll('.graphicToolTip').attr('transform', `translate(${zoomState.k * zoomState.x},${zoomState.k * zoomState.y}) scale(${ 1 / zoomState.k})`)


    toolTip
      .on("mouseleave", () => toolTip.remove())
  };


  useEffect(() => {
    ready();
  }, [tooltipContext, zoomState]);

  return (
    <></>
  );

};
export default ToolTip;