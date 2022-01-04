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
    
    console.log('size',checkedSize);
    let projection = d3.geoEqualEarth()
      .scale(checkedSize / Math.PI / 1.25)
      .translate([width / 2, height / 2])

    let path = d3.geoPath().projection(projection);
    let spiCountryGroup = d3.group(data[1], s => s["SPI country code"]);
    let mapFeatures = feature(data[0], data[0].objects.countries).features;
    
    function spiMatcher(id) { return spiCountryGroup.get(id); };
    console.log('mapFeatures', mapFeatures);
    
    let mapGroup = d3.group(mapFeatures, d => d.properties.ISO_A3_EH);

    // initialScale tracks Zoom scale throughout transforms.
    var initialScale = 1;
    var fontSize = 16 / initialScale;

    var centered;

    let zoomed = (event, d) => {
      //reset the toolTip before transforming
      countryMouseLeave();
      
      const { transform } = event;

      // Save the Current Zoom level so we can scale tooltips. 
      initialScale = transform.k;
      fontSize = 16 / initialScale;

      setZoomState({x: transform.x, y: transform.y, k: transform.k })
      console.log(transform);
      console.log('before setCenter', center);
      // setCenter([(center[0]+transform.x), (center[1]+transform.y)]);
      setCenter([transform.x, transform.y]);
      console.log([transform.x, transform.y]);
      console.log('after setCenter', center);
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
      
      svg.selectAll(".country, .border")
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
      .on("mouseleave", reset, countryMouseLeave)
      .on('zoom', zoom)
      
    let g = svg.append("g").attr('class', 'countries');
    // Join (enter, update) here v6 style.

    svg.call(zoom);
    
    svg.exit().remove();

    var TextTooltip = d3.select(".tooltip-area")
      .style("opacity", 0);

    var mouseover = function (event, d) {
      TextTooltip
        .style("opacity", 1)
    };

    var mousemove = function (event, d) {
// Initial coordinates are wrong on first render. Refreshes accurate with
      const text = d3.select('.tooltip-area__text');
      text.text(`${d.text}`);

      let x = event.x;
      let y = event.y;

      TextTooltip
        .attr("font-size", 16)
        .attr('text-anchor', 'middle')
        .attr("font-weight", 700)
        .attr('style', 'text-shadow: 2px 2px white, -2px -2px white, 2px -2px white, -2px 2px white;')
        .attr('background-color', 'gray;')
        .attr('transform', `translate(${x}, ${y})`)
    };

    var mouseleave = function (event, d) {
      TextTooltip
        .style("opacity", 0)
        .style("stroke", "none")
    };

    let toolTip = d3.select('.graphicTooltip')
      .style('visibility', 'hidden')
      .on("mouseleave", countryMouseLeave)


    function countryMouseOver(event, d) {
      // ToolTip({svgRef, width, height, countryValue, countryData, center });
      


      toolTip.exit().remove();
      let spiMatch = spiMatcher(d.properties.ISO_A3_EH);
      let gu_a3 = spiMatcher(d.properties.GU_A3);
      let center = path.centroid(d);

      console.log('path.centroid', center);
      
      if(!spiMatch) return;

      let name = spiMatch[0]["Country"];
      
      setCenter(center);
      setCountryValue(name);
      
    };

    function doItAll(event, d) {
      showSubPetals(event, d);
      showPetalArc(event, d);
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
        .attr('id', d => {
          return `arc_${d.id}_${d.text}`
        })
        .attr('d', arc)
        .attr('fill', d => {
          return d.colorRef
        })
        .attr('transform', d => `translate(${d.center[0]}, ${d.center[1]}) rotate(${d.angle + 30}) scale(${1 / initialScale})`)
        .attr("cursor", "pointer")


      toolTip.selectAll('.petalText')
        .data([d])
        .join('text')
        .attr('class', 'petalText')
        .attr("dy", -5 / initialScale)
        .append('textPath')
        .style("text-anchor", "middle")
        .attr("xlink:href", d => { return `#arc_${d.id}_${d.text}` })
        .attr("font-size", fontSize)
        .attr("fill", d => {
          let fontColor = 'black'
          if (d.angle === 30 && d.petSize > 85) {
            fontColor = 'yellow'
          }
          return fontColor;
        })
        .attr("pointer-events", "none")
        .attr("startOffset", function (d) {
          if (d.angle === 270) {
            return 370 / initialScale;
          }
          if (d.angle === 30) {
            return 130 / initialScale;
          }
          else {
            return 135 / initialScale;
          }
        })
        .text(d => {
          return `${d.text} - ${d.petSize}`;
        });

      toolTip.selectAll('.petalArc')
      .on('click', toggleModal)
    };

    function showSubPetals(event, d) {
      let x = d.center[0];
      let y = d.center[1];

      toolTip
        .selectAll('.subPetalPath')
        .data(d.subCat)
        .join('path')
        .attr('class', 'subPetalPath')
        .attr("id", (d, i) => {
          // setClickedSubCat(d.text);
          return d.id})
        .attr('d', d => subPetalPath)
        .attr('transform', d => `translate(${x}, ${y}) scale(${0})`)
        .transition().duration(750)
        .attr('transform', d => `translate(${x}, ${y}) rotate(${d.angle}) scale(${spiScale(d.value) * .01 / initialScale})`)
        .style('stroke', 'black')
        .style('fill', d => d.colorValue)
        .attr("cursor", "pointer");

      d3.selectAll('.subPetalPath')
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on('click', mousemove)
    }

    function countryMouseLeave(event) {
      toolTip.selectAll('circle').remove();
      toolTip.selectAll('text').text(null);
      toolTip.selectAll('.petalBackgroundPath').remove();
      toolTip.selectAll('.petalPath').remove();
      toolTip.selectAll('.subPetalPath').remove();
      toolTip.selectAll('.petalArc').remove();
      toolTip.selectAll('.petalText').remove();

      // toolTip.selectAll('title').remove();
      toolTip
        .style('visibility', 'hidden')
    };

    // *** Country groupings ***
    let countries = g.selectAll(".country")
      .data(mapFeatures.filter(d => d.properties.ISO_A3_EH !== "ATA"))
      .join("path")
      .attr("d", path)
      .attr("class", "country")
      .attr("id", d => d.properties.ISO_A3_EH)
      .attr("cursor", "pointer")
      .attr("fill", d => {
        let spi = spiMatcher(d.properties.ISO_A3_EH) || spiMatcher(d.properties.GU_A3);
        // console.log(spi);
        // SU
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
      countryMouseLeave();
      svg.selectAll('.subPetalText').remove();
      d3.selectAll(".toolTipName").remove();
    }

    toolTip.raise();
    TextTooltip.raise();
    TextTooltip.attr("pointer-events", "none");
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