import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from "topojson-client";
import {
  colorScale,
  basicColorScale,
  foundationsColorScale,
  opportunityColorScale
} from '../services/SocialProgress';
import { useToolTip } from '../hooks/hooks';
import ToolTip from './ToolTip';

// countryMouseOver and countryValue need to be synchronized 
// reduce looping through by just grabbing countryValue and yearValue using a D3.group data map, and change the value onHover?
// let [tooltipContext, setToolTipContext] = useToolTip();

const MapMaker = ({ 
  svgRef,  width, height, spiData, mapData, path,
  yearValue, loading, setLoading, center, setCenter, zoomState, setZoomState,
  toggleModal, countryValue, setCountryValue, tooltipContext, setToolTipContext }) => {

  let loadingSpinner = require('../assets/loading.gif');


  // import topoJSON and CSV here
  // let localGeoData = process.env.PUBLIC_URL + '/topoMap.json';
  // let localGeoData = process.env.PUBLIC_URL + '/cleanedMap.json';

  let hardData = require('../assets/2011-2020-Social-Progress-Index.csv');
  
  let newData = require('../assets/SPI2011-2021-dataset.csv');

  let petalPath = 'M 0 0 c 100 100 80 0 100 0 C 80 0 100 -100 0 0';

  let subPetalPath = "M 0 0 L 85 15 A 1 1 0 0 0 85 -15 L 0 0";



  function ready(data) {
    let spiScale = d3.scaleLinear().domain([0, 100]).range([0, 100]);
    console.log(data[0]);
    
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
    function mapMatcher(id)  {  return mapGroup.get(id)}
    console.log('spiCountryGroup', data[1]);

//****************************************************************************************************************/
// ******   refactor to avoid this loop, calculate values on the fly instead ********************************/
    // mapFeatures.forEach(function (f) {

    //   //Catch for Colonies and Territories without Formal ISO names. 
    //   if (f.properties.ISO_A3_EH === "-99") {
    //     f.properties.ISO_A3_EH = f.properties.GU_A3;
    //   }

    //   let d = spiCountryGroup.get(f.properties.ISO_A3_EH) || null;

    //   let id = f.properties.ISO_A3_EH;

    //   let spi = d ? +d[0]["Social Progress Index"] : 0;
    //   let spiSize = spi;
    //   // d3 Group, look at ModalDef for reference
    //   let basicNeeds = d ? +d[0]["Basic Human Needs"] : 0;

    //   let basicSubCat = d ? [
    //     d[0]["Nutrition and Basic Medical Care"],
    //     d[0]['Water and Sanitation'],
    //     d[0]['Shelter'],
    //     d[0]['Personal Safety']
    //   ] :
    //     [0, 0, 0, 0];

    //   let foundations = d ? +d[0]["Foundations of Wellbeing"] : 0;

    //   let foundationsSubCat = d ? [
    //     d[0]["Access to Basic Knowledge"],
    //     d[0]['Access to Information and Communications'],
    //     d[0]['Health and Wellness'],
    //     d[0]['Environmental Quality']
    //     ,] :
    //     [0, 0, 0, 0];

    //   let opportunity = d ? +d[0]["Opportunity"] : 0;

    //   let opportunitySubCat = d ? [
    //     d[0]["Personal Rights"],
    //     d[0]["Personal Freedom and Choice"],
    //     d[0]["Inclusiveness"],
    //     d[0]["Access to Advanced Education"],
    //   ] :
    //     [0, 0, 0, 0];

    //   // Individual Map Colors
    //   f.properties.spi = d ? d[0] : { "Social Progress Index": null };
    //   f.properties.color = spi ? colorScale(spi) : null;

    //   // petals change to reflect 3 categories (basic needs etc)
    //   f.properties.flower = {
    //     petals: [
    //       {
    //         id, angle: 30, petalPath, center: path.centroid(f), petSize: basicNeeds, colorRef: basicColorScale(basicNeeds), text: 'Basic Human Needs',
    //         subCat: [
    //           { angle: 0, value: basicSubCat[0], colorValue: basicColorScale(basicSubCat[0]), text: `Nutrition and Basic Medical Care - ${basicSubCat[0]}` },
    //           { angle: 20, value: basicSubCat[1], colorValue: basicColorScale(basicSubCat[1]), text: `Water and Sanitation - ${basicSubCat[1]}` },
    //           { angle: 40, value: basicSubCat[2], colorValue: basicColorScale(basicSubCat[2]), text: `Shelter - ${basicSubCat[2]}` },
    //           { angle: 60, value: basicSubCat[3], colorValue: basicColorScale(basicSubCat[3]), text: `Personal Safety - ${basicSubCat[3]}` },
    //         ]
    //       },
    //       {
    //         id, angle: 150, petalPath, center: path.centroid(f), petSize: foundations, colorRef: foundationsColorScale(foundations), text: 'Foundations of Wellbeing',
    //         subCat: [
    //           { angle: 120, value: foundationsSubCat[0], colorValue: foundationsColorScale(foundationsSubCat[0]), text: `Access to Basic Knowledge - ${foundationsSubCat[0]}` },
    //           { angle: 140, value: foundationsSubCat[1], colorValue: foundationsColorScale(foundationsSubCat[1]), text: `Access to Information and Communications - ${foundationsSubCat[1]}` },
    //           { angle: 160, value: foundationsSubCat[2], colorValue: foundationsColorScale(foundationsSubCat[2]), text: `Health and Wellness - ${foundationsSubCat[2]}` },
    //           { angle: 180, value: foundationsSubCat[3], colorValue: foundationsColorScale(foundationsSubCat[3]), text: `Environmental Quality - ${foundationsSubCat[3]}` },
    //         ]
    //       },
    //       {
    //         id, angle: 270, petalPath, center: path.centroid(f), petSize: opportunity, colorRef: opportunityColorScale(opportunity), text: 'Opportunity',
    //         subCat: [
    //           { id, angle: 240, value: opportunitySubCat[0], colorValue: opportunityColorScale(opportunitySubCat[0]), text: `Personal Rights - ${opportunitySubCat[0]}` },
    //           { id, angle: 260, value: opportunitySubCat[1], colorValue: opportunityColorScale(opportunitySubCat[1]), text: `Personal Freedom and Choice - ${opportunitySubCat[1]}` },
    //           { id, angle: 280, value: opportunitySubCat[2], colorValue: opportunityColorScale(opportunitySubCat[2]), text: `Inclusiveness - ${opportunitySubCat[2]}` },
    //           { id, angle: 300, value: opportunitySubCat[3], colorValue: opportunityColorScale(opportunitySubCat[3]), text: `Access to Advanced Education - ${opportunitySubCat[3]}` },
    //         ]
    //       }
    //     ],
    //     spiScale: spiSize,
    //     spi,
    //     center: path.centroid(f),
    //     bounds: path.bounds(f),
    //   };
    // })
//**************************************************************************************************************** */
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

      //If Zoomed on a Country, center the map on that country.
        let x, y;
        if (!d || centered === data) {
          centered = null;
        } else {
          var centroid = path.centroid(d);
          x = width / 2 - centroid[0];
          y = height / 2 - centroid[1];
          centered = data;
        }
      
      svg.selectAll(".country, .border, .graphicTooltip")
      .attr('transform', transform)
      .attr('transform', `translate(${(x? x : transform.x)},${(y? y : transform.y )}) scale(${transform.k})`)
      .attr("stroke-width", 1 / transform.k);
      
      svg.select(".tooltip-area, .subPetalText")
      .attr('transform', `translate(${(x? x : transform.x)},${(y? y : transform.y )}) scale(${transform.k})`)
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
      
      if(!spiMatch) return;
      let name = spiMatch[0]["Country"];
      
      if(spiMatch) { 
        setCountryValue(name);
        setCenter(center);
        // setToolTipContext({svgRef, center, name});
      };
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

  // useEffect(()=>{
  //   //get countryValue path.centroid(mapData)
    

  //   setCenter()
  // }, [countryValue])


  useEffect(() => {
    setLoading(true);
    // let localData = d3.json(localGeoData);
    if(spiData.length===0)return;

    let remoteMapData = d3.json("https://unpkg.com/world-atlas@1/world/110m.json")

    Promise.all([mapData, spiData]).then(function (values) {
      console.log(mapData);
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
      {/* <g className="tooltip-area">
        <text className="tooltip-area__text"></text>
      </g>
      <g className="graphicTooltip">
        <text className="graphicTooltip__text"></text>
      </g> */}
    </svg>
  );
};

export default MapMaker;