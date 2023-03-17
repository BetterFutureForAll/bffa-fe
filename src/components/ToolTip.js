import React, { useEffect } from 'react';
import * as d3 from 'd3';
import {
  colorScale,
  basicColorScale,
  foundationsColorScale,
  opportunityColorScale
} from '../services/SocialProgress';


const ToolTip = ({ tooltipContext, setClicked, setClickedSubCat }) => {

  useEffect(() => {
    let { loading, svgRef, data, zoomState } = tooltipContext;
    let spiScale = d3.scaleLinear().domain([0, 100]).range([0, 100]);
    let petalPath = 'M 0 0 c 100 100 80 0 100 0 C 80 0 100 -100 0 0';
    let subPetalPath = "M 0 0 L 85 15 A 1 1 0 0 0 85 -15 L 0 0";

    function ready() {
      if(loading) 
      if (!svgRef || !data) return;


      function parsedData(d) {

        let basics = Object.assign({},
          { "Basic Human Needs": d.score_bhn },
          { scale: spiScale(d.score_bhn || 0) },
          { color: basicColorScale(d.score_bhn || 0) },
          {
            subPetals:
              [
                { "Nutrition and Basic Medical Care": d.score_nbmc, colorFn: basicColorScale, angle: 0 },
                { 'Water and Sanitation': d.score_nbmc, colorFn: basicColorScale, angle: 20 },
                { 'Shelter': d.score_nbmc, colorFn: basicColorScale, angle: 40 },
                { 'Personal Safety': d.score_ps, colorFn: basicColorScale, angle: 60 }
              ]
          },
          { angle: 30 });

        let foundations = Object.assign({},
          { "Foundations of Wellbeing": d.score_fow },
          { scale: spiScale(d.score_fow || 0) },
          { color: foundationsColorScale(d.score_fow || 0) },
          {
            subPetals:
              [
                { "Access to Basic Knowledge": d.score_abk, colorFn: foundationsColorScale, angle: 120 },
                { 'Access to Information and Communications': d.score_abk, colorFn: foundationsColorScale, angle: 140 },
                { 'Health and Wellness': d.score_hw, colorFn: foundationsColorScale, angle: 160 },
                { 'Environmental Quality': d.score_eq, colorFn: foundationsColorScale, angle: 180 }
              ]
          },
          { angle: 150 });

        let opportunity = Object.assign({},
          { "Opportunity": d.score_opp },
          { scale: spiScale(d.score_opp || 0) },
          { color: opportunityColorScale(d.score_opp || 0) },
          {
            subPetals:
              [
                { 'Personal Rights': d.score_pr, colorFn: opportunityColorScale, angle: 240 },
                { "Personal Freedom and Choice": d.score_pr, colorFn: opportunityColorScale, angle: 260 },
                { 'Inclusiveness': d.score_incl, colorFn: opportunityColorScale, angle: 280 },
                { 'Access to Advanced Education': d.score_aae, colorFn: opportunityColorScale, angle: 300 }
              ]
          },
          { angle: 270 });

        let result = Object.assign({}, d, { petals: [basics, foundations, opportunity] })
        return [result];
      }

      let svg = d3.select(svgRef.current);

      svg.selectAll('.graphicTooltip').remove();

      let toolTip = svg
        .insert('g')
        .data(parsedData(data[0]))
        .attr('class', 'graphicTooltip')

      let x, y;
      let worldCheck = data[0].spicountrycode === 'WWW';
      let worldCheckedScale = worldCheck? 1 : zoomState.k;

      // World Tooltip is always center
      if (worldCheck) {
        x = svg.select(`#world_target`).attr('cx');
        y = svg.select(`#world_target`).attr('cy');
      } else {
        x = svg.select(`#${data[0]['spicountrycode']}_target`).attr('cx');
        y = svg.select(`#${data[0]['spicountrycode']}_target`).attr('cy');
      }
      toolTip.attr('transform', `translate(${worldCheck? 0 : zoomState.x}, ${worldCheck? 0 : zoomState.y}) scale(${worldCheck? 1 : zoomState.k})`)

      let fontSize = 16 / worldCheckedScale;
      //Outer Circle
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
        .attr("r", 100 / worldCheckedScale)
        .style('fill', '#c4c2c4')
        .style("opacity", "0.5")
        .style('stroke', 'black')
        .attr("stroke-width", 1 / worldCheckedScale);

      //inner circle scaled to SPI score
      toolTip
        .selectAll('.inner')
        .data(d => [d])
        .join("circle")
        .attr('class', 'inner')
        .attr('id', d => `${Object.keys(d)[0]}_inner`)
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", d => +d.score_spi ? +d.score_spi / worldCheckedScale : 0)
        .style('fill', d => colorScale(d ? +d.score_spi : 0))
        .style('stroke', 'black')
        .attr("cursor", "pointer")
        .attr("stroke-width", 1 / worldCheckedScale);

      // Three Major petals, 
      let subPetals = toolTip
        .selectAll('.petalBackgroundPath')
        .data(d => d.petals)
        .join('path')
        .attr('class', 'petalBackgroundPath')
        .attr("id", (d, i) => {
          return `${Object.keys(d)[0]}_bp`
        })
        .attr('d', petalPath)
        .attr('transform', d => `translate(${x}, ${y}) rotate(${d.angle}) scale(${spiScale(100) * .01 / worldCheckedScale})`)
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
          let scale = +d.scale ? d.scale * .01 / worldCheckedScale : 0;
          return `translate(${x}, ${y}) rotate(${d.angle}) scale(${scale})`
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
            .text(d => {
              return `${d.country}`
            })
            .attr('x', 0)
            .attr('y', spiScale(120) / worldCheckedScale)
            .attr('dy', '1em')
          enter
            .append("tspan")
            .text(d => {
              let rounded = (+d.score_spi).toFixed();
              if (+rounded === 0) {
                return `Score Unavailable`;
              }
              return `${rounded}`;
            })
            .attr('x', 0)
            .attr('y', d => {
              return spiScale(120) / worldCheckedScale
            })
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

      var mousemove = function (event, d) {
        toolTip.selectAll(".tooltip-text-area").remove();

        let targetData = `${Object.keys(d)[0]}_bp`;

        d3.selectAll('.subPetalBackgroundPath')
          .style("opacity", (d, i) => {
            let currentData = `${Object.keys(d)[0]}_bp`;
            return (currentData === targetData) ? ".5" : ".01";
          });
        d3.selectAll('.subPetalBackgroundPath')
          .style("fill", (d, i) => {
            let currentData = `${Object.keys(d)[0]}_bp`;
            return (currentData === targetData) ? "white" : `${d.colorFn(Object.values(d)[0])}`;
          });

        let mouseZoomX = (+event.x - +zoomState.x) / zoomState.k;
        let mouseZoomY = (+event.y - +zoomState.y) / zoomState.k;
        let roundedNum = (+Object.values(d)[0]).toFixed();

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
          .attr("font-weight", 600)
          .attr('style', 'text-shadow: 1px 1px white, -1px -1px white, 1px -1px white, -1px 1px white;')
          .attr('background-color', 'gray;')

        textTooltip.raise()

      };

      svg.select(`#${data[0]['SPI country code']}_target`).raise();


      var mouseClick = function (event, d) {
        let target = Object.keys(d)[0];
        setClickedSubCat(target);
      };

      function showSubPetals(event, d) {
        toolTip
          .selectAll('.subPetalBackgroundPath')
          .data(d.subPetals)
          .join('path')
          .attr('class', 'subPetalBackgroundPath')
          .attr("id", d => `${Object.keys(d)[0]}_subPetalBackground`)
          .attr('d', subPetalPath)
          .attr('transform', d => `translate(${x}, ${y}) rotate(${d.angle}) scale(${spiScale(1) / worldCheckedScale})`)
          .style('stroke', 'black')
          .style('fill', d => {
            return d.colorFn(Object.values(d)[0])
          })
          .style('opacity', '.1')
          .attr("cursor", "crosshair");

        toolTip
          .selectAll('.subPetalPath')
          .data(d.subPetals)
          .join('path')
          .attr('class', 'subPetalPath')
          .attr("id", d => `${Object.keys(d)[0]}_subPetal`)
          .attr('d', subPetalPath)
          .attr('transform', d => {
            let scale = +Object.values(d)[0] ? spiScale(Object.values(d)[0]) * .01 / worldCheckedScale : 0;
            return `translate(${x}, ${y}) rotate(${d.angle}) scale(${scale})`
          })
          .style('stroke', 'black')
          .style('fill', d => {
            return d.colorFn(Object.values(d)[0])
          })
          .attr("cursor", "crosshair");

        subPetals
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("click", mouseClick);

        d3.selectAll('.petalPath, .subPetalPath, .subPetalBackgroundPath')
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("click", mouseClick);
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
          .attr('transform', d => `translate(${x}, ${y}) rotate(${d.angle + 30}) scale(${1 / worldCheckedScale})`)
          .attr("cursor", "alias")

        toolTip.selectAll('.petalText')
          .data([d])
          .join('text')
          .attr('class', 'petalText')
          .attr("dy", -5 / worldCheckedScale)
          .append('textPath')
          .style("text-anchor", "middle")
          .attr("xlink:href", d => {
            return `#arc_${Object.keys(d)[0]}`
          })
          .attr("font-size", fontSize)
          .attr("pointer-events", "none")
          .attr("startOffset", function (d) {
            if (d.angle === 270) {
              return 370 / worldCheckedScale;
            }
            if (d.angle === 30) {
              return 130 / worldCheckedScale;
            }
            else {
              return 130 / worldCheckedScale;
            }
          })
          .text(d => {
            let rounded = +(+Object.values(d)[0]).toFixed() || 0;
            return `${Object.keys(d)[0]}-${rounded}`;
          });
      };

      function doItAll(event, d) {
        let target = Object.keys(d)[0];
        setClicked(target);
        // d3.select(`#${target.replace(/ /g, "_")}_title`).dispatch('click');
        toolTip.selectAll('.petalArc').remove();
        toolTip.selectAll('.petalText').remove();
        showSubPetals(event, d);
        showPetalArc(event, d);
      }
      // add mouseout fn's to subpetals / petals
      d3.selectAll('.petalPath').on('mouseenter', doItAll)
      d3.selectAll('.petalBackgroundPath').on('mouseenter', doItAll)

    };
    console.log('ToolTipRendered', tooltipContext)
    if(tooltipContext.loading || !tooltipContext.svgRef || !tooltipContext.data) return; 
    ready();
  }, [tooltipContext, setClickedSubCat, setClicked,]);

  return (
    <></>
  );

};
export default ToolTip;