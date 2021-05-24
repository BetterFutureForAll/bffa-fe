import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from "topojson-client";
import { 
  colorScale, 
  basicColorScale, 
  foundationsColorScale, 
  opportunityColorScale 
} from '../services/SocialProgress';

const MapMaker = ({ svgRef, setClicked, yearValue,  width, height, loading, setLoading }) => {

  var margin = { top: 50, left: 10, right: 10, bottom: 25, }

  // import topoJSON and CSV here
  let localGeoData = process.env.PUBLIC_URL + '/topoMap.json';

  let hardData = require('../assets/2011-2020-Social-Progress-Index.csv');

  let petalPath = 'M 0 0 c 100 100 80 0 100 0 C 80 0 100 -100 0 0';

  let subPetalPath = "M 0 0 L 85 15 A 1 1 0 0 0 85 -15 L 0 0";

  let spiScale = d3.scaleLinear().domain([0, 100]).range([0, 100]);

  function ready(data) {

    let projection = d3.geoEqualEarth()
      .scale(200)
      .translate([(width + margin.left + margin.right) / 2, (height + margin.top + margin.bottom) / 2]);

    let path = d3.geoPath().projection(projection);

    let spiCountryGroup = d3.group(data[1], s => s["SPI country code"]);
    let countriesDataSet = feature(data[0], data[0].objects.countries).features

    countriesDataSet.forEach(function (f) {
      
      
      // catch unassigned ISO's (French colonies and other territories)
      if (f.properties.ISO_A3_EH === "-99") {
        // console.log(f.properties);
        // France vs French Guiana still mixed, do we treat it like Hawaii? 
        f.properties.ISO_A3_EH = f.properties.GU_A3;
      }

      // Clean up PARTIAL data, either place holder / null / Data Unavailable
      let d = spiCountryGroup.get(f.properties.ISO_A3_EH) || null;

      let id = f.properties.ISO_A3_EH;

      let spi = d ? +d[0]["Social Progress Index"] : 0;
      let spiSize = spi;

      let basicNeeds = d ? +d[0]["Basic Human Needs"] : 0;
      // let basicSize = spiScale(basicNeeds);

      let basicSubCat = d ? [
        d[0]["Nutrition and Basic Medical Care"],
        d[0]['Water and Sanitation'],
        d[0]['Shelter'],
        d[0]['Personal Safety']
      ] :
        [0, 0, 0, 0];

      let foundations = d ? +d[0]["Foundations of Wellbeing"] : 0;
      // let foundationSize = spiScale(foundations);

      let foundationsSubCat = d ? [
        d[0]["Access to Basic Knowledge"], 
        d[0]['Access to Information and Communications'], 
        d[0]['Health and Wellness'], 
        d[0]['Environmental Quality']
        ,] : 
        [0, 0, 0, 0];

      let opportunity = d ? +d[0]["Opportunity"] : 0;
      // let oppSize = spiScale(opportunity);

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

    // Needs to center on Mouse Position
    const zoom = d3.zoom()
    .on('zoom', (event) => {
      const {transform} = event;


      d3.selectAll(".country").attr('transform', event.transform)
      .attr("stroke-width", 1 / transform.k);

      d3.selectAll(".border").attr('transform', event.transform)
      .attr("stroke-width", 1 / transform.k);


    // adjust border thickness to scale

      // d3.selectAll("path").attr('transform', event.transform)
      // .style("stroke-width", 1.5 / k + "px");


      // Tooltip needs to translate to stay in its original position relative to the map. 
      d3.selectAll(".tooltip").attr('transform', event.transform)
      // svg.attr("transform", "translate(" + event.transform.x + "," + event.transform.y + ") scale(" + event.transform.k + ")");

    })
    .translateExtent([[0, 0], [width, height]])
    .scaleExtent([1, 10]);

    // *** Top Level Selector (ViewBox) ***
    let svg = d3.select(svgRef.current)
    .attr("id", "viewbox")
    .attr("viewBox", [0, 0, width, height])
    .call(zoom);

    let g = svg.join("g")
    svg.exit().remove();

    // *** Country groupings ***
    let countries = g.selectAll(".country")
      .data(countriesDataSet)
      .join("path")
      .attr("d", path)
      .attr("class", "country")
      .attr("id", d => d.properties.ISO_A3_EH)
      .attr("cursor", "pointer")
      .attr("fill", d => { return d.properties.color || "#c4c2c4" })
      .on("click", clicked, zoom)
      .on("mouseenter", debounce(onHover))
      .on("mouseover", d=> {
        d3.select(d.path[0]).style("opacity", ".8");
      })
      .on("mouseleave", d => {

        // Cancel Previous debounce calls

        d3.select(d.path[0]).style("opacity", "1");
      })
      .append("title")
      // .attr("style", "bold")
      .text(d => { return d.properties.NAME_EN })
    countries.exit().remove();

    // // *** borders / whitespace mesh ***
    let borders = g.append("path")
      .attr("class", "border")
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path(mesh(data[0], data[0].objects.countries, (a, b) => a !== b)))
    borders.exit().remove();

    // *** Tool Tip *** 
    let toolTip = g.selectAll(".tooltip")
      .data(countriesDataSet, d => { return d })
      .join("g")
      .append("svg")
      .attr("id", d => d.properties.ISO_A3_EH)
      .attr("class", "tooltip")
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
      // .on("mouseover", hidePetal)
      .style('stroke', 'black')
    toolTip.exit().remove();

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
      //  ****** change to Text attr next to country name ********************
      .append("title")
      .text(d => { return `Social Progress Index \n ${d.properties.flower.spi}` })
    toolTip.exit().remove();


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
      .on("mouseenter", expandPetal)
      .on("mouseleave", hidePetal)
      .join('text')
      .append('title')
      .text(d => { return `${d.text} : ${d.petSize}` })
    toolTip.exit().remove();

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
      .on("mouseenter", expandPetal)
      .join('text')
      .append('title')
      .text(d => {
        if (d.text === "Basic Human Needs") {
          return `${d.text} : ${d.petSize}`
          // `\n Nutrition and Basic Medical Care : ${d.subCat[0]} 
          // \n Water and Sanitation : ${d.subCat[1]} 
          // \n Shelter : ${d.subCat[2]} 
          // \n Personal Safety ${d.subCat[3]}`
        }
        if (d.text === "Foundations of Wellbeing") {
          return `${d.text} : ${d.petSize}`
          // `\n Access to Basic Knowledge : ${d.subCat[0]} 
          // \n Access to Information and Communications : ${d.subCat[1]} 
          // \n Health and Wellness : ${d.subCat[2]} 
          // \n Environmental Quality : ${d.subCat[3]}`
        }
        if (d.text === "Opportunity") {
          return `${d.text} : ${d.petSize}`
          //   `\n Personal Rights : ${d.subCat[0]} 
          //   \n Personal Freedom and Choice : ${d.subCat[1]} 
          //   \n Inclusiveness : ${d.subCat[2]} 
          //   \n Access to Advanced Education : ${d.subCat[3]}`
        }
      })
    toolTip.exit().remove();

    // *** Sub Petals ***

    //background
    toolTip
      .selectAll('.subPetalBackgroundPath')
      .data(d => { return d.properties.flower.subPetals }
      )
      .join('path')
      .attr('class', 'subPetalBackgroundPath', 'tooltip')
      .attr("id", d => d.id)
      .attr('d', d => d.subPetalPath)
      .attr('transform', d => `translate(${d.center[0]}, ${d.center[1]}) rotate(${d.angle}) scale(${spiScale(100) * .01})`)
      .style('stroke', '#c4c2c4')
      .style('fill', "none")
      .style("opacity", "0.25")
      .on("mouseleave", hidePetal)


    //scaled sub-petals
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
      .append("title")
      .append("text")
      .text(d => d.text)
    toolTip.exit().remove();

    // Formal Name
    toolTip
      .append('text')
      .attr('class', 'name')
      .attr('text-anchor', 'middle')
      .attr('transform', d => `translate(${d.properties.flower.center[0]},${d.properties.flower.center[1] + 110})`)
      .text(d => d.properties.NAME_EN)
    toolTip.exit().remove();

    // ********************** Visibility ****************************      

    reset();

    toolTip
      .attr("visibility", "hidden")

    // *** Event Listeners ***
    function reset() {
      // console.log('RESET');
      d3.selectAll(".tooltip").attr("visibility", "hidden");
      toolTip.selectAll(".subPetalPath").attr("visibility", "hidden")
      toolTip.selectAll(".subPetalBackgroundPath").attr("visibility", "hidden")
      setClicked(undefined);
    }


    function toggleVisibility(d) {
      d3.selectAll(".tooltip").attr("visibility", "hidden");
      d3.selectAll(`#${d.properties.ISO_A3_EH}.tooltip`).attr("visibility", "visible");
    }

    function debounce(func, timeout = 1750) {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          func.apply(this, args);
        }, timeout);
      };
    };

    function onHover(event, d) {
      toggleVisibility(d);
    };

    function expandPetal(event, d) {
      d3.selectAll(`#${d.id}.subPetalPath`).attr("visibility", "visible");
      d3.selectAll(`#${d.id}.subPetalBackgroundPath`).attr("visibility", "visible");
    }

    function hidePetal() {
      toolTip.selectAll(".subPetalPath").attr("visibility", "hidden")
      toolTip.selectAll(".subPetalBackgroundPath").attr("visibility", "hidden")
    }


    function clicked(event, d) {
      // let [[x0, y0], [x1, y1]] = path.bounds(d);
      event.stopPropagation();
      console.log('petal clicked', event, d.properties);
      reset();
    }

  };

  useEffect(() => {
    // D3 parses CSV into JSON
    let mapData = d3.json(localGeoData);
    let spiData = d3.csv(hardData).then((spi) => {
      let years = d3.group(spi, d => d['SPI year'])
      return years.get(yearValue);
    });
    console.log("UseEffect Fired");

    Promise.all([mapData, spiData]).then(function (values) {
      console.log(values);
      d3.selectAll(svgRef.current).exit().remove();
      ready(values);
    });

// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearValue, localGeoData, hardData, svgRef]);

  return (
    <svg ref={svgRef} height={height} width={width} id="map"></svg>
  );
};

export default MapMaker;