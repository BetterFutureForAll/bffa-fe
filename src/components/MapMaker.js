import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from "topojson-client";
import {
  colorScale,
  basicColorScale,
  foundationsColorScale,
  opportunityColorScale
} from '../services/SocialProgress';


const MapMaker = ({ svgRef, setClicked, yearValue, width, height, loading, setLoading }) => {

  // var margin = { top: 0, left: 0, right: 0, bottom: 0, }

  let loadingSpinner = require('../assets/loading.gif');

  // import topoJSON and CSV here
  let localGeoData = process.env.PUBLIC_URL + '/topoMap.json';
  // *** Look into overlaying Raster style maps (Google Maps, Leaflet, etc) *** //

  let hardData = require('../assets/2011-2020-Social-Progress-Index.csv');

  let petalPath = 'M 0 0 c 100 100 80 0 100 0 C 80 0 100 -100 0 0';

  let subPetalPath = "M 0 0 L 85 15 A 1 1 0 0 0 85 -15 L 0 0";


  function ready(data) {

    let checkedSize = Math.min(height, width)

    let spiScale = d3.scaleLinear().domain([0, 100]).range([0, 100]);

    //Check Height Vs Width, use the width for small screens and height for large.

    let projection = d3.geoEqualEarth()
      .scale(checkedSize / 1.5 / Math.PI)
      .translate([width / 2, height / 2])

    let path = d3.geoPath().projection(projection);

    let spiCountryGroup = d3.group(data[1], s => s["SPI country code"]);
    let countriesDataSet = feature(data[0], data[0].objects.countries).features;

    countriesDataSet.forEach(function (f) {

      //Catch for Colonies and Territories without Formal ISO names. 
      if (f.properties.ISO_A3_EH === "-99") {
        f.properties.ISO_A3_EH = f.properties.GU_A3;
      }

      let d = spiCountryGroup.get(f.properties.ISO_A3_EH) || null;

      let id = f.properties.ISO_A3_EH;

      let spi = d ? +d[0]["Social Progress Index"] : 0;
      let spiSize = spi;

      let basicNeeds = d ? +d[0]["Basic Human Needs"] : 0;

      let basicSubCat = d ? [
        d[0]["Nutrition and Basic Medical Care"],
        d[0]['Water and Sanitation'],
        d[0]['Shelter'],
        d[0]['Personal Safety']
      ] :
        [0, 0, 0, 0];

      let foundations = d ? +d[0]["Foundations of Wellbeing"] : 0;

      let foundationsSubCat = d ? [
        d[0]["Access to Basic Knowledge"],
        d[0]['Access to Information and Communications'],
        d[0]['Health and Wellness'],
        d[0]['Environmental Quality']
        ,] :
        [0, 0, 0, 0];

      let opportunity = d ? +d[0]["Opportunity"] : 0;

      let opportunitySubCat = d ? [
        d[0]["Personal Rights"],
        d[0]["Personal Freedom and Choice"],
        d[0]["Inclusiveness"],
        d[0]["Access to Advanced Education"],
      ] :
        [0, 0, 0, 0];

      // Individual Map Colors
      f.properties.spi = d ? d[0] : { "Social Progress Index": null };
      f.properties.color = spi ? colorScale(spi) : null;

      // petals change to reflect 3 categories (basic needs etc)
      f.properties.flower = {
        petals: [
          { id, angle: 30, petalPath, center: path.centroid(f), petSize: basicNeeds, colorRef: basicColorScale(basicNeeds), text: 'Basic Human Needs', subCat: basicSubCat },
          { id, angle: 150, petalPath, center: path.centroid(f), petSize: foundations, colorRef: foundationsColorScale(foundations), text: 'Foundations of Wellbeing', subCat: foundationsSubCat },
          { id, angle: 270, petalPath, center: path.centroid(f), petSize: opportunity, colorRef: opportunityColorScale(opportunity), text: 'Opportunity', subCat: opportunitySubCat }
        ],
        subPetals: [
          //Basic Needs
          { id, angle: 0, subPetalPath, center: path.centroid(f), petSize: spiScale(basicSubCat[0]), colorRef: basicColorScale(basicSubCat[0]), text: `Nutrition and Basic Medical Care: ${basicSubCat[0]}` },
          { id, angle: 20, subPetalPath, center: path.centroid(f), petSize: spiScale(basicSubCat[1]), colorRef: basicColorScale(basicSubCat[1]), text: `Water and Sanitation: ${basicSubCat[1]}` },
          { id, angle: 40, subPetalPath, center: path.centroid(f), petSize: spiScale(basicSubCat[2]), colorRef: basicColorScale(basicSubCat[2]), text: `Shelter: ${basicSubCat[2]}` },
          { id, angle: 60, subPetalPath, center: path.centroid(f), petSize: spiScale(basicSubCat[3]), colorRef: basicColorScale(basicSubCat[3]), text: `Personal Safety: ${basicSubCat[3]}` },
          // Foundations
          { id, angle: 120, subPetalPath, center: path.centroid(f), petSize: spiScale(foundationsSubCat[0]), colorRef: foundationsColorScale(foundationsSubCat[0]), text: `Access to Basic Knowledge: ${foundationsSubCat[0]}` },
          { id, angle: 140, subPetalPath, center: path.centroid(f), petSize: spiScale(foundationsSubCat[1]), colorRef: foundationsColorScale(foundationsSubCat[1]), text: `Access to Information and Communications: ${foundationsSubCat[1]}` },
          { id, angle: 160, subPetalPath, center: path.centroid(f), petSize: spiScale(foundationsSubCat[2]), colorRef: foundationsColorScale(foundationsSubCat[2]), text: `Health and Wellness: ${foundationsSubCat[2]}` },
          { id, angle: 180, subPetalPath, center: path.centroid(f), petSize: spiScale(foundationsSubCat[3]), colorRef: foundationsColorScale(foundationsSubCat[3]), text: `Environmental Quality: ${foundationsSubCat[3]}` },
          // Opportunity
          { id, angle: 240, subPetalPath, center: path.centroid(f), petSize: spiScale(opportunitySubCat[0]), colorRef: opportunityColorScale(opportunitySubCat[0]), text: `Personal Rights: ${opportunitySubCat[0]}` },
          { id, angle: 260, subPetalPath, center: path.centroid(f), petSize: spiScale(opportunitySubCat[1]), colorRef: opportunityColorScale(opportunitySubCat[1]), text: `Personal Freedom and Choice: ${opportunitySubCat[1]}` },
          { id, angle: 280, subPetalPath, center: path.centroid(f), petSize: spiScale(opportunitySubCat[2]), colorRef: opportunityColorScale(opportunitySubCat[2]), text: `Inclusiveness: ${opportunitySubCat[2]}` },
          { id, angle: 300, subPetalPath, center: path.centroid(f), petSize: spiScale(opportunitySubCat[3]), colorRef: opportunityColorScale(opportunitySubCat[3]), text: `Access to Advanced Education: ${opportunitySubCat[3]}` },
        ],
        spiScale: spiSize,
        spi,
        center: path.centroid(f),
        bounds: path.bounds(f),
      };
    })

    // initialScale tracks Zoom scale throughout transforms.
    var initialScale = 1;

    const zoom = d3.zoom()
      .on('zoom', (event, d) => {
        const { transform } = event;
        // console.log(event);
        // Save the Current Zoom level so we can scale tooltips. 
        initialScale = transform.k;

        svg.selectAll(".country").attr('transform', transform)
          .attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`)
          .attr("stroke-width", 1 / transform.k);

        svg.selectAll(".border").attr('transform', transform)
          .attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`)
          .attr("stroke-width", 1 / transform.k)

        svg.selectAll('.tooltip').attr('transform', transform)
          .attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`)
          .attr("stroke-width", 1 / transform.k)

        svg.selectAll('.toolTipName').attr('transform', transform)
          .attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`)
          // .attr("font-size", 1 / transform.k)

        svg.selectAll('.subPetalText').remove();


        svg.selectAll('.toolTipName').attr('transform', transform)
          .attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`)

        //manually recreating tooltip with new cX, cY;

        svg.selectAll('.outer')
          .attr("r", d => d.properties.flower.spiScale ? spiScale(100) * 1 / transform.k : null);

        svg.selectAll('.inner')
          .attr("r", d => d.properties.flower.spiScale * 1 / transform.k);

        svg.selectAll('.petalBackgroundPath, .subPetalBackgroundPath')
          .attr("transform", d => `translate(${d.center[0]}, ${d.center[1]}) rotate(${d.angle}) scale(${(spiScale(100) * .01) * 1 / transform.k})`);

        svg.selectAll('.petalPath, .subPetalPath')
          .attr("transform", d => `translate(${d.center[0]}, ${d.center[1]}) rotate(${d.angle}) scale(${(d.petSize * .01) * 1 / transform.k} )`);

        svg.selectAll('.name')
          .attr('transform', d => `translate(${d.properties.flower.center[0]},${d.properties.flower.center[1] + spiScale(120) * (1 / initialScale)}) scale(${(1 / initialScale)})`)
      })
      .translateExtent([[0, 0], [width * 1.3, height * 1.3]])
      .scaleExtent([1, 10]);

    

    // *** Top Level Selector (ViewBox) ***
    let svg = d3.select(svgRef.current)
      .attr("id", "viewbox")
      .attr("viewBox", [0, 0, width, height])
      .attr('preserveAspectRatio', 'xMinYMid')
      .on("mouseleave", reset, hidePetal)
      .on('zoom', zoom);

    let g = svg.join("g");

    svg.exit().remove();


    function clickTitle(event, d) {
      d3.selectAll('.subPetalText').remove();
      let textContent = d.text;
      d3.select(this.parentNode)
        .append('text')
        .attr('class', 'subPetalText')
        .attr('text-anchor', 'left')
        .append('tspan')
        .attr('x', event.x)
        .attr('y', event.y)
        .attr("font-size", 16 / initialScale)
        .attr('transform', d => `translate(${event.x},${event.y})`)
        .text(`${textContent} ⓘ`)
    }


    var TextTooltip = d3.select(".tooltip-area")
      .style("opacity", 0);
    

    var mouseover = function(event, d) {
      TextTooltip
        .style("opacity", 1)
        // .style("stroke", "black")
    }

    var mousemove = function(event, d) {

      const text = d3.select('.tooltip-area__text');

      text.text(`${d.text} ⓘ`);

      let x = event.x;
      let y = event.y;

      TextTooltip
        .attr("font-size", 16)
        .attr('transform', `translate(${x}, ${y})`)

    }

    var mouseleave = function(event, d) {
      TextTooltip
        .style("opacity", 0)
        .style("stroke", "none")
    }

    // *** Country groupings ***
    let countries = g.selectAll(".country")
      .data(countriesDataSet.filter(d => d.properties.ISO_A3_EH !== "ATA"))
      .join("path")
      .attr("d", path)
      .attr("class", "country")
      .attr("id", d => d.properties.ISO_A3_EH)
      .attr("cursor", "pointer")
      .attr("fill", d => { return d.properties.color || "#c4c2c4" })
      .on("mouseenter", debounce(toggleVisibility, 250))
      .on("click", debounce(toggleVisibility, 0))
      .on("mouseover", d => {
        d3.select(d.path[0]).style("opacity", ".8");
      })
      .on("mouseleave", d => {
        // Cancel Previous debounce calls
        d3.select(d.path[0]).style("opacity", "1");
      })
      .append("title")
      .text(d => { return `${d.properties.NAME_EN}` })
    countries.exit().remove();

    // // *** borders / whitespace mesh ***
    let borders = g.append("path")
      .attr("class", "border")
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path(mesh(data[0], data[0].objects.countries, (a, b) => a !== b)))
      .on('click', reset, hidePetal);

    borders.exit().remove();

    // *** Tool Tip *** 
    let toolTip = g.selectAll(".tooltip")
      .data(countriesDataSet)
      .join("g")
      .attr("class", "tooltip")
      .attr("id", d => d.properties.ISO_A3_EH)
      .on("mouseleave", reset, hidePetal)

    toolTip
      .append("circle")
      .attr('class', 'outer')
      .attr('id', d => d.properties.ISO_A3_EH)
      .attr("cx", d => d.properties.flower.center[0])
      .attr("cy", d => d.properties.flower.center[1])
      .attr("r", d => d.properties.flower.spiScale ? spiScale(100) : null)
      .style('fill', '#c4c2c4')
      .style("opacity", "0.5")
      .style('stroke', 'black')

    toolTip
      .append("circle")
      .attr('class', 'inner')
      .attr('id', d => d.properties.ISO_A3_EH)
      .attr("cx", d => d.properties.flower.center[0])
      .attr("cy", d => d.properties.flower.center[1])
      .attr("r", d => d.properties.flower.spiScale)
      .style('fill', d => d.properties.color)
      .style('stroke', 'black')
      .attr("cursor", "pointer")
      .on("mouseover", hidePetal)
      .append("title")
      .text(d => { return `Social Progress Index \n ${d.properties.flower.spi}` })


    // *** Individual Flower Petals ***
    toolTip
      .selectAll('.petalBackgroundPath')
      .data(d => d.properties.flower.petals)
      .join('path')
      .attr('class', 'petalBackgroundPath')
      .attr("id", d => d.id)
      .attr('d', d => d.petalPath)
      .attr('transform', d => `translate(${d.center[0]}, ${d.center[1]}) rotate(${d.angle}) scale(${spiScale(100) * .01})`)
      .style('stroke', 'black')
      .style('fill', d => d.colorRef)
      .style("opacity", "0.40")
      .attr("cursor", "pointer")
      .on("mouseleave", hidePetal)
      .join('text')
      .append('title')
      .text(d => { return `${d.text} : ${d.petSize}` })

    toolTip
      .selectAll('.petalPath')
      .data(d => d.properties.flower.petals)
      .join('path')
      .attr('class', 'petalPath')
      .attr('id', d => d.id)
      .attr('d', d => d.petalPath)
      .attr('transform', d => `translate(${d.center[0]}, ${d.center[1]}) rotate(${d.angle}) scale(${d.petSize * .01})`)
      .style('stroke', 'black')
      .style('fill', d => d.colorRef)
      .attr("cursor", "pointer")
      .join('text')
      .append('title')
      .text(d => {
        if (d.text === "Basic Human Needs") {
          return `${d.text} : ${d.petSize}`
        }
        if (d.text === "Foundations of Wellbeing") {
          return `${d.text} : ${d.petSize}`
        }
        if (d.text === "Opportunity") {
          return `${d.text} : ${d.petSize}`
        }
      })

    // *** Sub Petals ***
    toolTip
      .selectAll('.subPetalPath')
      .data(d => d.properties.flower.subPetals)
      .join('path')
      .attr('class', 'subPetalPath')
      .attr("id", d => d.id)
      .attr('d', d => d.subPetalPath)
      .attr('transform', d => `translate(${d.center[0]}, ${d.center[1]}) rotate(${d.angle}) scale(${d.petSize * .01})`)
      .style('stroke', 'black')
      .style('fill', d => d.colorRef)
      .attr("cursor", "pointer")
      .on('click', clickTitle)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      // .append("title")
      // .append("text")
      // .text(d => d.text)

    // toolTip
    //   .selectAll('.subPetalTitle')
    //   .data(d => d.properties.flower.subPetals)
    //   .join('g')
    //   .attr('class', 'subPetalTitle')
    //   .attr("text-anchor", function(d) { return d.center[0] + d.petSize * .01 ? "end" : "start"; })
    //   .attr("transform", d => { return `translate(${d.center[0]}, ${d.center[1]}) rotate(${d.angle + 180}) scale(${d.petSize * .01}  )`})
    // .append("text")
    //   .text(d=> { return (d.text)})
    //   .style("font-size", "11px")
    //   .attr("alignment-baseline", "middle")


    // svg.append("g")
    // .attr('class', 'tooltip-area')
    // .append('text')
    // .attr('class', 'tooltip-area__text')

    svg.call(zoom);

    // ********************** Visibility ****************************      

    reset();

    // *** Event Listeners ***
    function reset(event) {
      d3.selectAll(".tooltip").attr("visibility", "hidden");
      svg.selectAll('.subPetalText').remove();
      d3.selectAll(".toolTipName").remove();
      hidePetal();
      setClicked(undefined);
    }


    function toggleVisibility(event, d) {

      d3.selectAll(".tooltip").attr("visibility", "hidden");
      if (!d) { return };

      d3.selectAll(`#${d.properties.ISO_A3_EH}.outer`)
        .attr("r", 0)

      d3.selectAll(`#${d.properties.ISO_A3_EH}.inner`)
        .attr("r", 0)

      d3.selectAll(`#${d.properties.ISO_A3_EH}.tooltip`)
        .attr("visibility", "visible");

      d3.selectAll(`#${d.properties.ISO_A3_EH}.outer`)
        .attr("r", 0)
        .transition().duration([750])
        .attr("r", d => d.properties.flower.spiScale ? spiScale(100) * (1 / initialScale) : null)
        .on('end', addName(event, d))

      d3.selectAll(`#${d.properties.ISO_A3_EH}.inner`)
        .attr("r", 0)
        .transition().duration([1750])
        .attr("r", d => d.properties.flower.spiScale * (1 / initialScale))

      d3.selectAll(`#${d.properties.ISO_A3_EH}.petalBackgroundPath`)
        .attr('transform', d => `translate(${d.center[0]}, ${d.center[1]}) rotate(${d.angle}) scale(${0})`)
        .transition().duration([1750])
        .attr('transform', d => `translate(${d.center[0]}, ${d.center[1]}) rotate(${d.angle}) scale(${spiScale(100) * .01 * (1 / initialScale)})`)
        .on('end', () => {
          d3.selectAll(`#${d.properties.ISO_A3_EH}.petalPath`)
            .on("mouseenter", expandPetal);
        })

      d3.selectAll(`#${d.properties.ISO_A3_EH}.petalPath`)
        .attr('transform', d => `translate(${d.center[0]}, ${d.center[1]}) rotate(${d.angle}) scale(${0})`)
        .transition().duration([1750])
        .attr('transform', d => `translate(${d.center[0]}, ${d.center[1]}) rotate(${d.angle}) scale(${d.petSize * .01 * (1 / initialScale)})`)
        .on('end', () => {
          d3.selectAll(`#${d.properties.ISO_A3_EH}.petalPath`)
            .on("mouseenter", expandPetal);
        })
    }

    function debounce(fn, delay) {
      var timer = null;
      if (delay === null) {
        clearTimeout(timer);
        return;
      }
      return function (event, abort) {
        var context = this,
          // maybe keep reference to event.previous;
          args = arguments,
          evt = event;
        //we get the D3 event here
        clearTimeout(timer);
        if (abort === true) { return };
        timer = setTimeout(function () {
          event = evt;
          //and use the reference here
          fn.apply(context, args);
        }, delay);
      };
    }

    function expandPetal(event, d) {

      d3.selectAll(`#${d.id}.subPetalPath`)
        .attr('transform', `scale(${.001})`)
      d3.selectAll(`#${d.id}.subPetalPath`).attr("visibility", "visible");
      d3.selectAll(`#${d.id}.subPetalBackgroundPath`).attr("visibility", "visible");

      d3.selectAll(`#${d.id}.subPetalPath`)
        .attr('transform', d => `translate(${d.center[0]}, ${d.center[1]}) rotate(${d.angle}) scale(${.001})`)
        .transition(3000)
        .attr('transform', d => `translate(${d.center[0]}, ${d.center[1]}) rotate(${d.angle}) scale(${d.petSize * .01 * (1 / initialScale)})`)
    }

    function hidePetal() {
      toolTip.selectAll(".subPetalPath").attr("visibility", "hidden").transition().duration(0);
      toolTip.selectAll(".subPetalBackgroundPath").attr("visibility", "hidden").transition().duration(0);
    }

    function addName(event, d) {
      d3.selectAll(`#${d.properties.ISO_A3_EH}.tooltip`)
        .append('text')
        .attr('class', 'toolTipName')
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${d.properties.flower.center[0]},${d.properties.flower.center[1] + spiScale(120) * (1 / initialScale)}) scale(${(1 / initialScale)})`)
        .append('tspan')
        .attr('x', 0)
        .text(d => { return `${d.properties.NAME_EN}` })
        .append('tspan')
        .text(d => { return `${d.properties.flower.spi}` })
        .attr('x', 0)
        .attr('dy', '1em')
        .attr('text-anchor', 'middle')
    };

    TextTooltip.raise();
    TextTooltip.attr("pointer-events", "none");

  };



  useEffect(() => {

    setLoading(true);
    // D3 parses CSV into JSON
    let mapData = d3.json(localGeoData);
    let spiData = d3.csv(hardData).then((spi) => {
      let years = d3.group(spi, d => d['SPI year'])
      return years.get(yearValue);
    });

    Promise.all([mapData, spiData]).then(function (values) {
      d3.selectAll(svgRef.current).exit().remove();
      setLoading(false);
      ready(values);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearValue, localGeoData, hardData, svgRef]);

  while (loading) return (<img src={loadingSpinner} alt={'loading spinner'} />)

  return (
    <svg ref={svgRef} height={height} width={width} id="map">
        <g className="tooltip-area">
          <text className="tooltip-area__text"></text>
        </g>
    </svg>
  );
};

export default MapMaker;