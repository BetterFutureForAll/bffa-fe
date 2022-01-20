import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from "topojson-client";
import {
  colorScale,
  basicColorScale,
  foundationsColorScale,
  opportunityColorScale
} from '../services/SocialProgress';
import ToolTip from './ToolTip';


const MapMaker = ({ 
  svgRef,  width, height, spiData, mapData, path,
  yearValue, loading, setLoading, center, setCenter, zoomState, setZoomState,
  toggleModal, countryValue, setCountryValue, tooltipContext, setToolTipContext }) => {

  let loadingSpinner = require('../assets/loading.gif');

  let hardData = require('../assets/2011-2020-Social-Progress-Index.csv');
  
  let newData = require('../assets/SPI2011-2021-dataset.csv');

  let petalPath = 'M 0 0 c 100 100 80 0 100 0 C 80 0 100 -100 0 0';

  let subPetalPath = "M 0 0 L 85 15 A 1 1 0 0 0 85 -15 L 0 0";



  function ready(data) {

    let spiScale = d3.scaleLinear().domain([0, 100]).range([0, 100]);
    
    //Check Height Vs Width, use the width for small screens and height for large.
    let checkedSize = Math.min(height, width)
    
    let projection = d3.geoEqualEarth()
      .scale(checkedSize / Math.PI / 1.25)
      .translate([width / 2, height / 2])

    let path = d3.geoPath().projection(projection);
    let spiCountryGroup = d3.group(data[1], s => s["SPI country code"]);
    let mapFeatures = feature(data[0], data[0].objects.countries).features;
    
    function spiMatcher(id) { return spiCountryGroup.get(id); };
    
    let mapGroup = d3.group(mapFeatures, d => d.properties.ISO_A3_EH);

    // initialScale tracks Zoom scale throughout transforms.
    var initialScale = 1;
    var fontSize = 16 / initialScale;

    var centered;

    let zoomed = (event, d) => {
      //reset the toolTip before transforming
      
      const { transform } = event;

      // Save the Current Zoom level so we can scale tooltips. 
      initialScale = transform.k;
      fontSize = 16 / initialScale;

      setZoomState({x: transform.x, y: transform.y, k: transform.k });

      // iterate through then adjust center.current
      // tooltip needs to either transform with map and stay, 
      // or currently is removed and redrawn
      
      // setCenter([(center[0]+transform.x), (center[1]+transform.y)]);
      
      // setCenter call does not go through. 
      let newCenter = [center[0] + transform.x, center[0] + transform.y];
      
      // setCenter(newCenter);
      
      // //If Zoomed on a Country, center the map on that country.
      //   let x, y;
      //   if (!d || centered === data) {
      //     centered = null;
      //   } else {
      //     var centroid = path.centroid(d);
      //     x = width / 2 - centroid[0];
      //     y = height / 2 - centroid[1];
      //     centered = data;
      //   }
      
      svg.selectAll(".country, .border, .toolTipTarget")
      .attr('transform', transform)
      .attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`)
      .attr("stroke-width", 1 / transform.k);
      
      // svg.select(".graphicTooltip")
      // .attr('transform', `translate(${transform.x},${transform.y}) scale(${1/transform.k})`)
    };
    
    const zoom = d3.zoom()
    .translateExtent([[-width * .25, -height * .1], [width * 1.5, height * 1.25]])
    .scaleExtent([1, 10])
    .on('zoom', zoomed)
    // .on('end', (event, d) => {
      // d3.select(`${event.sourceEvent}`).dispatch('mouseover')
      // d3.select(`${event.target}`).dispatch('mouseover');
    // })

    // *** Top Level Selector (ViewBox) ***
    let svg = d3.select(svgRef.current)
      .attr("id", "viewbox")
      .attr("viewBox", [0, 0, width, height])
      .attr('preserveAspectRatio', 'xMinYMid')
      .on("mouseleave", reset)
      .on('zoom', zoom)
      
    let g = svg.append("g").attr('class', 'countries');
    // Join (enter, update) here v6 style.

    svg.call(zoom);
    
    svg.exit().remove();


    function countryMouseOver(event, d) {
      // ToolTip({svgRef, width, height, countryValue, countryData, center });
      // toolTip.exit().remove();
      let spiMatch = spiMatcher(d.properties.ISO_A3_EH);
      let gu_a3 = spiMatcher(d.properties.GU_A3);
      let centroid = path.centroid(d);

      if(!spiMatch) return;

      let name = spiMatch[0]["Country"];

      setCenter(centroid);
      setCountryValue(name);

      
    };

    // *** Country groupings ***
    let countries = g.selectAll(".country")
      .data(mapFeatures.filter(d => d.properties.ISO_A3_EH !== "ATA"))
      .join("path")
      .attr("d", path)
      .attr("class", "country")
      .attr("id", d => {
       return d.properties.GU_A3})
      .attr("cursor", "pointer")
      .attr("fill", d => {
        let spi = spiMatcher(d.properties.ISO_A3_EH) || spiMatcher(d.properties.GU_A3);
        if(d.properties.ISO_A3_EH==='-99') { 
          return spi = spiMatcher(d.properties.GU_A3);
        }; 
        return spi? colorScale(spi[0]['Social Progress Index']) : "#c4c2c4" })
      .on("mouseover", countryMouseOver)
      .on("mouseenter", (event, d) => {
        d3.select(event.path[0]).style("opacity", ".8");
      })
      .on("mouseleave",
        d => { d3.select(d.path[0]).style("opacity", "1"); })
      .append("title")
      .text(d => { return `${d.properties.NAME_EN}` })

    countries.exit().remove();

      g.selectAll(`.toolTipTarget`)
      //** Filter Country matches here  */
        .data(mapFeatures.filter(d => d.properties.ISO_A3_EH !== "ATA"))
        .join('circle')
        .attr('class', 'toolTipTarget')
        .attr('id', d=> {
          return `${d.properties.GU_A3}_target`})
        .attr("cx", d => path.centroid(d)[0])
        .attr("cy", d => path.centroid(d)[1])
        .attr("r", 0)


    // // *** borders / whitespace mesh ***
    let borders = g.append("path")
      .attr("class", "border")
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path(mesh(data[0], data[0].objects.countries, (a, b) => a !== b)))

    borders.exit().remove();

    reset();

    // *** Event Listeners ***
    function reset(event) {
      // countryMouseLeave();
      svg.selectAll('.subPetalText').remove();
      d3.selectAll(".toolTipName").remove();
    }

  };

  useEffect(() => {
    setLoading(true);
    // let localData = d3.json(localGeoData);
    if(spiData.length===0)return;

    let remoteMapData = d3.json("https://unpkg.com/world-atlas@1/world/110m.json")

    Promise.all([mapData, spiData]).then(function (values) {
      d3.selectAll(svgRef.current).exit().remove();
      setLoading(false);
      ready(values);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearValue, svgRef, height, width, spiData]);

  while (loading) return (<img src={loadingSpinner} alt={'loading spinner'} id="loading-spinner" />)

  return (
    <svg ref={svgRef} height={height} width={width} id="map">
      <ToolTip tooltipContext={tooltipContext} toggleModal={toggleModal} zoomState={zoomState} />
    </svg>
  );
};

export default MapMaker;