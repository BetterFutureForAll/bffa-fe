import React, { useEffect } from 'react';
import * as d3 from 'd3';
import {
  colorScale,
  nameFixer
} from '../services/SocialProgress';

const ToolTip = ({ svgRef, tooltipData, loading, setClicked, setClickedSubCat, center }) => {
  
  useEffect(() => {
    let data = [tooltipData];
    if (!svgRef || loading || !data) return;
    function ready() {
      if (!tooltipData) return;
      let x = center[0];
      let y = center[1];
      let fontSize = 16;

      let svg = d3.select(svgRef.current);
      svg.selectAll('.graphicToolTip').remove();

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
        .attr('id', d => {
          return `${d.id}_inner`
        })
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", d => +d.score ?? 0)
        .style('fill', d => colorScale(d ? +d.score : 0))
        .style('stroke', 'black')
        .attr("cursor", "pointer")
        .attr("stroke-width", 1);

      // Three Dimension petals, 
      toolTip
        .selectAll('.petalBackgroundPath')
        .data(d => {
          return d.petals})
        .join('path')
        .attr('class', 'petalBackgroundPath')
        .attr("id", (d) => `${d.label}_bp`)
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
        .attr("id", d => `${d.label}_petalPath`)
        .attr('d', d => d.petalPath)
        .attr('cx', x)
        .attr('cy', y)
        .attr('transform', d => `translate(${x}, ${y}) rotate(${d.angle}) scale(${d.scale * .01})`)
        .style('stroke', 'black')
        .style('fill', d => d.color)
        .attr("cursor", "pointer")
        .on('mouseenter', showSubPetals)

      //Petal Arcs with names for the dimensions
      var arc = d3.arc()
        .startAngle([(Math.PI * 2) / 3])
        .endAngle([0])
        .innerRadius([100])
        .outerRadius([120])
        .cornerRadius([10]);

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
              let rounded = (+d.score).toFixed() || 0;
              return `${d.label}-${rounded}`;
            });
          return textArc;
        })


      toolTip.selectAll(".nameText").remove();
      toolTip.selectAll(".nameText")
        .data(data)
        .join(group => {
          let enter = group.append('text')
          enter
            .append("tspan")
            .text(d => {
              return `${d.name} SPI score`
            })
            .attr('x', 0)
            .attr('y', 110)
            .attr('dy', '1.1em')
          enter
            .append("tspan")
            .text(d => {
              let rounded = (+d.score).toFixed();
              if (+rounded === 0) {
                return `Score Unavailable`;
              }
              return `${rounded}`;
            })
            .attr('x', 0)
            .attr('y', 110)
            .attr('dy', '2.2em')
          return enter;
        })
        .attr('class', 'nameText')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${x}, ${(y + 10)})`)
        .attr("font-weight", 700)
        .attr("font-size", fontSize)

      // ****** MouseOver Functions start here ******** ///
      var textTooltip = toolTip.selectAll(".tooltip-text-area")
        .style("opacity", 0);

      var mouseover = function (event, d) {
        textTooltip
          .style("opacity", 1)
      };

      toolTip.selectAll(".tooltip-text-area").remove();
      var mousemove = function (event, d) {
        let targetData = `${d.label}_bp`;

        d3.selectAll('.subPetalBackgroundPath')
          .style("opacity", (d, i) => {
            let currentData = `${d.label}_bp`;
            return (currentData === targetData) ? ".5" : ".01";
          });

        d3.selectAll('.subPetalBackgroundPath')
          .style("fill", (d, i) => {
            let currentData = `${d.label}_bp`;
            return (currentData === targetData) ? "white" : `${d.color}`;
          });
        toolTip.selectAll(".tooltip-text-area")
          .data([d])
          .join(enter => {
            let group = enter.append('g').append('text')
            console.log(d.label, d.score, event.x, event.y);
            group
              .append("tspan")
              .text(`${d.label}`)
              .attr('x', event.x)
              .attr('y', event.y)
              .attr('dy', '+2.25em')
              .attr('dx', '-1em')

            group
              .append("tspan")
              .text(`${(+d.score).toFixed()}`)
              .attr('x', event.x)
              .attr('y', event.y)
              .attr('dx', '-.5em')
              .attr('dy', '1.5em')
            return group;
          })
          .style("opacity", 1)
          .attr("pointer-events", "none")
          .attr('class', "tooltip-text-area")
          .attr("font-size", fontSize)
          .attr('text-anchor', 'middle')
          .attr("font-weight", 600)
          .attr('style', 'text-shadow: 1px 1px white, -1px -1px white, 1px -1px white, -1px 1px white;')
          .attr('background-color', 'gray;')
          console.log(textTooltip);
      };

      let subPetalPath = "M 0 0 L 85 15 A 1 1 0 0 0 85 -15 L 0 0";

      // d3.selectAll('.subPetalBackgroundPath').on('click', showSubPetals)

      function showSubPetals(event, d) {
        setClicked(d.label);
        toolTip
          .selectAll('.subPetalBackgroundPath')
          .data(d.subPetals)
          .join('path')
          .attr('class', 'subPetalBackgroundPath')
          .attr("id", d => `${d.label}_subPetalBackground`)
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
          .attr('transform', d => {
            // let scale = +Object.values(d)[0] ? spiScale(Object.values(d)[0]) : 0;
            return `translate(${x}, ${y}) rotate(${d.angle}) scale(${d.scale * .01})`
          })
          .style('stroke', 'black')
          .style('fill', d => {
            return d.color
          })
          .attr("cursor", "crosshair");

        let mouseClick = function (event, d) {
          setClickedSubCat(d.label);
        };
        let mouseOut = ()=>{
          d3.select(".tooltip-text-area").remove();
        };
        d3.selectAll('.subPetalPath, .subPetalBackgroundPath')
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseout", mouseOut)
          .on("click", mouseClick);
      }



      toolTip.raise();
    };
    
    ready();
  }, [svgRef, tooltipData, loading, setClicked, setClickedSubCat, center]);

  return (
    <></>
  );

};
export default ToolTip;


      // // ****** MouseOver Functions start here ******** ///
      // var textTooltip = toolTip.selectAll(".tooltip-text-area")
      //   .style("opacity", d => {
      //     return 0
      //   });

      // var mouseover = function (event, d) {
      //   textTooltip
      //     .style("opacity", 1)
      // };

      // var mousemove = function (event, d) {
      //   toolTip.selectAll(".tooltip-text-area").remove();
      //   let targetData = `${Object.keys(d)[0]}_bp`;

      //   d3.selectAll('.subPetalBackgroundPath')
      //     .style("opacity", (d, i) => {
      //       let currentData = `${Object.keys(d)[0]}_bp`;
      //       return (currentData === targetData) ? ".5" : ".01";
      //     });
      //   d3.selectAll('.subPetalBackgroundPath')
      //     .style("fill", (d, i) => {
      //       let currentData = `${Object.keys(d)[0]}_bp`;
      //       return (currentData === targetData) ? "white" : `${d.color)}`;
      //     });

      //   textTooltip
      //     .data(d => data)
      //     .join(group => {
      //       let enter = group.append('text')
      //       enter
      //         .append("tspan")
      //         .text(`${Object.keys(d)[0]}`)
      //         .attr('x', event.x)
      //         .attr('y', event.y)
      //         .attr('dy', '+2em')
      //         .attr('dx', '-.5em')

      //       enter
      //         .append("tspan")
      //         .text(`${(+Object.values(d)[0]).toFixed()}`)
      //         .attr('x', event.x)
      //         .attr('y', event.y)
      //         .attr('dx', '-.5em')
      //         .attr('dy', '+1em')
      //       return enter;
      //     })
      //     .attr("pointer-events", "none")
      //     .attr('class', "tooltip-text-area")
      //     .attr("font-size", fontSize)
      //     .attr('text-anchor', 'middle')
      //     .attr("font-weight", 600)
      //     .attr('style', 'text-shadow: 1px 1px white, -1px -1px white, 1px -1px white, -1px 1px white;')
      //     .attr('background-color', 'gray;')

      //   textTooltip.raise()

      // };

      // svg.select(`#${data[0]['SPI country code']}_target`).raise();

      // var mouseClick = function (event, d) {
      //   let target = Object.keys(d)[0];
      //   setClickedSubCat(target);
      // };

      // function showSubPetals(event, d) {
      //   toolTip
      //     .selectAll('.subPetalBackgroundPath')
      //     .data(d.subPetals)
      //     .join('path')
      //     .attr('class', 'subPetalBackgroundPath')
      //     .attr("id", d => `${Object.keys(d)[0]}_subPetalBackground`)
      //     .attr('d', subPetalPath)
      //     .attr('transform', d => `translate(${x}, ${y}) rotate(${d.angle}) scale(${spiScale(1)})`)
      //     .style('stroke', 'black')
      //     .style('fill', d => {
      //       return d.colorFn(Object.values(d)[0])
      //     })
      //     .style('opacity', '.1')
      //     .attr("cursor", "crosshair");

      //   toolTip
      //     .selectAll('.subPetalPath')
      //     .data(d.subPetals)
      //     .join('path')
      //     .attr('class', 'subPetalPath')
      //     .attr("id", d => `${Object.keys(d)[0]}_subPetal`)
      //     .attr('d', subPetalPath)
      //     .attr('transform', d => {
      //       let scale = +Object.values(d)[0] ? spiScale(Object.values(d)[0]) : 0;
      //       return `translate(${x}, ${y}) rotate(${d.angle}) scale(${scale * .01})`
      //     })
      //     .style('stroke', 'black')
      //     .style('fill', d => {
      //       return d.colorFn(Object.values(d)[0])
      //     })
      //     .attr("cursor", "crosshair");

      //   subPetals
      //     .on("mouseover", mouseover)
      //     .on("mousemove", mousemove)
      //     .on("click", mouseClick);

      //   d3.selectAll('.petalPath, .subPetalPath, .subPetalBackgroundPath')
      //     .on("mouseover", mouseover)
      //     .on("mousemove", mousemove)
      //     .on("click", mouseClick);
      // }

      // function showPetalArc(event, d) {
      //   var arc = d3.arc()
      //     .startAngle([(Math.PI * 2) / 3])
      //     .endAngle([0])
      //     .innerRadius([100])
      //     .outerRadius([120])
      //     .cornerRadius([10]);

      //   toolTip.selectAll('.petalArc')
      //     .data([d])
      //     .join('path')
      //     .attr('class', 'petalArc')
      //     .attr('id', (d, i) => {
      //       return `arc_${Object.keys(d)[0]}`
      //     })
      //     .attr('d', arc)
      //     .attr('x', x)
      //     .attr('y', y)
      //     .attr('fill', d => d.color)
      //     .attr('transform', d => `translate(${x}, ${y}) rotate(${d.angle + 30}) scale(${1})`)
      //     .attr("cursor", "alias")

      //   toolTip.selectAll('.petalText')
      //     .data([d])
      //     .join('text')
      //     .attr('class', 'petalText')
      //     .attr("dy", -5)
      //     .append('textPath')
      //     .style("text-anchor", "middle")
      //     .attr("xlink:href", d => {
      //       return `#arc_${Object.keys(d)[0]}`
      //     })
      //     .attr("font-size", fontSize)
      //     .attr("pointer-events", "none")
      //     .attr("startOffset", function (d) {
      //       if (d.angle === 270) {
      //         return 370;
      //       }
      //       if (d.angle === 30) {
      //         return 130;
      //       }
      //       else {
      //         return 130;
      //       }
      //     })
      //     .text(d => {
      //       let rounded = +(+Object.values(d)[0]).toFixed() || 0;
      //       return `${Object.keys(d)[0]}-${rounded}`;
      //     });
      // };

      // function doItAll(event, d) {
      //   let target = Object.keys(d)[0];
      //   toolTip.selectAll('.petalArc').remove();
      //   toolTip.selectAll('.petalText').remove();
      //   setClicked(target);
      //   showSubPetals(event, d);
      //   showPetalArc(event, d);
      // }

      // // add mouseout fn's to subpetals / petals
      // d3.selectAll('.petalPath').on('mouseenter', doItAll)
      // d3.selectAll('.petalBackgroundPath').on('mouseenter', doItAll)