import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from "topojson-client";
import {
  colorScale,
  basicColorScale,
  foundationsColorScale,
  opportunityColorScale
} from '../services/SocialProgress';

// countryMouseOver and countryValue need to be synchronized 

// country = countryValue, dimension = petals, category = subPetal, indicator = value

const MapMaker = ({ 
  svgRef,  width, height,
  clicked, setClicked, clickedSubCat, setClickedSubCat,
  yearValue, loading, setLoading, 
  toggleModal, countries, countryValue, setCountryValue,
  handleCountryChange }) => {

  // var margin = { top: 0, left: 0, right: 0, bottom: 0, }

  let loadingSpinner = require('../assets/loading.gif');

  // import topoJSON and CSV here
  let localGeoData = process.env.PUBLIC_URL + '/topoMap.json';
  // *** Look into overlaying Raster style maps (Google Maps, Leaflet, etc) *** //

  let hardData = require('../assets/2011-2020-Social-Progress-Index.csv');

  let petalPath = 'M 0 0 c 100 100 80 0 100 0 C 80 0 100 -100 0 0';

  let subPetalPath = "M 0 0 L 85 15 A 1 1 0 0 0 85 -15 L 0 0";
  
  let checkedSize = Math.min(height, width)

  let selectCountry = <select onChange={handleCountryChange} defaultValue={countryValue}>
  {countries.map(item => (
    <option key={item} value={item}>
      {item}
    </option>
  ))}
  </select>
  function ready(data) {

    let spiScale = d3.scaleLinear().domain([0, 100]).range([0, 100]);

    //Check Height Vs Width, use the width for small screens and height for large.

    let projection = d3.geoEqualEarth()
      .scale(checkedSize / 1.3 / Math.PI)
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
          {
            id, angle: 30, petalPath, center: path.centroid(f), petSize: basicNeeds, colorRef: basicColorScale(basicNeeds), text: 'Basic Human Needs',
            subCat: [
              { angle: 0, value: basicSubCat[0], colorValue: basicColorScale(basicSubCat[0]), text: `Nutrition and Basic Medical Care - ${basicSubCat[0]}` },
              { angle: 20, value: basicSubCat[1], colorValue: basicColorScale(basicSubCat[1]), text: `Water and Sanitation - ${basicSubCat[1]}` },
              { angle: 40, value: basicSubCat[2], colorValue: basicColorScale(basicSubCat[2]), text: `Shelter - ${basicSubCat[2]}` },
              { angle: 60, value: basicSubCat[3], colorValue: basicColorScale(basicSubCat[3]), text: `Personal Safety - ${basicSubCat[3]}` },
            ]
          },
          {
            id, angle: 150, petalPath, center: path.centroid(f), petSize: foundations, colorRef: foundationsColorScale(foundations), text: 'Foundations of Wellbeing',
            subCat: [
              { angle: 120, value: foundationsSubCat[0], colorValue: foundationsColorScale(foundationsSubCat[0]), text: `Access to Basic Knowledge - ${foundationsSubCat[0]}` },
              { angle: 140, value: foundationsSubCat[1], colorValue: foundationsColorScale(foundationsSubCat[1]), text: `Access to Information and Communications - ${foundationsSubCat[1]}` },
              { angle: 160, value: foundationsSubCat[2], colorValue: foundationsColorScale(foundationsSubCat[2]), text: `Health and Wellness - ${foundationsSubCat[2]}` },
              { angle: 180, value: foundationsSubCat[3], colorValue: foundationsColorScale(foundationsSubCat[3]), text: `Environmental Quality - ${foundationsSubCat[3]}` },
            ]
          },
          {
            id, angle: 270, petalPath, center: path.centroid(f), petSize: opportunity, colorRef: opportunityColorScale(opportunity), text: 'Opportunity',
            subCat: [
              { id, angle: 240, value: opportunitySubCat[0], colorValue: opportunityColorScale(opportunitySubCat[0]), text: `Personal Rights - ${opportunitySubCat[0]}` },
              { id, angle: 260, value: opportunitySubCat[1], colorValue: opportunityColorScale(opportunitySubCat[1]), text: `Personal Freedom and Choice - ${opportunitySubCat[1]}` },
              { id, angle: 280, value: opportunitySubCat[2], colorValue: opportunityColorScale(opportunitySubCat[2]), text: `Inclusiveness - ${opportunitySubCat[2]}` },
              { id, angle: 300, value: opportunitySubCat[3], colorValue: opportunityColorScale(opportunitySubCat[3]), text: `Access to Advanced Education - ${opportunitySubCat[3]}` },
            ]
          }
        ],
        spiScale: spiSize,
        spi,
        center: path.centroid(f),
        bounds: path.bounds(f),
      };
    })

    // initialScale tracks Zoom scale throughout transforms.
    var initialScale = 1;
    var fontSize = 16 / initialScale;

    var centered;

    let clickCenter = (event, d) => {
      countryMouseLeave();
      var x = 0,
      y = 0;
      // If the click was on the centered state or the background, re-center.
      // Otherwise, center the clicked-on state.
      if (!d || centered === data) {
        centered = null;
      } else {
        var centroid = path.centroid(d);
        x = width / 2 - centroid[0];
        y = height / 2 - centroid[1];
        centered = data;
      }
      var transform = {
        x: x,
        y: y,
        k: initialScale
      };
      // var t = d3.zoomIdentity.translateBy(transform.x, transform.y).scale(transform.k)

      // svg.selectAll(".country, .border, .graphicTooltip").call(zoom.transform, t);
      // svg.select(".tooltip-area, .subPetalText").call(zoom.transform, t);

      // Transition to the new transform.
      svg.selectAll(".country, .border, .graphicTooltip")
        .attr('transform', transform)
        .attr('transform', `translate(${x},${y}) scale(${transform.k})`)
        .attr("stroke-width", 1 / transform.k);

      svg.select(".tooltip-area, .subPetalText")
        .attr('transform', `translate(${x},${y}) scale(${transform.k})`)
    }

    let zoomed = (event, d) => {
      //reset the toolTip before transforming
      countryMouseLeave();
      
      const { transform } = event;

      // Save the Current Zoom level so we can scale tooltips. 
      initialScale = transform.k;
      fontSize = 16 / initialScale;

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

    const clickZoom = d3.zoom()
    .translateExtent([[-width * .25, -height * .1], [width * 1.5, height * 1.25]])
    .scaleExtent([1, 4])
    .on('zoom', zoomed);

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

      //tooltip should be extracted as an fn and this refactored ********
      // console.log('countryMouseOver Data',d);
      if(!d) return;
      countryMouseLeave();

      if(d.properties.spi) { 
        setClicked(d.properties.spi) 
        setCountryValue(d.properties.spi.Country);
      };


      let x = d.properties.flower.center[0];
      let y = d.properties.flower.center[1];
      let id = d.properties.ISO_A3_EH;
      let r = d.properties.flower.spiScale ? spiScale(100) / initialScale : null;
      let scaledRadius = d.properties.flower.spiScale / initialScale || null;
      let color = d.properties.color;
      let countryName = d.properties.NAME_EN;
      let SPI = `SPI - ${d.properties.flower.spi}`;
      let text = d3.select(`.graphicTooltip__text`);

      toolTip
        .style('visibility', 'visible')
        .attr('x', x)
        .attr('y', y)
        .append("circle")
        .attr('class', 'outer')
        .attr('id', id)
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 0)
        .transition().duration([750])
        .attr("r", r)
        .style('fill', '#c4c2c4')
        .style("opacity", "0.5")
        .style('stroke', 'black')

      toolTip
        .append("circle")
        .attr('class', 'inner')
        .attr('id', id)
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 0)
        .transition().duration([1000])
        .attr("r", scaledRadius)
        .style('fill', color)
        .style('stroke', 'black')
        .attr("cursor", "pointer")

      toolTip
        .selectAll('.petalBackgroundPath')
        .data(d.properties.flower.petals)
        .join('path')
        .attr('class', 'petalBackgroundPath')
        .attr("id", (d, i) => `${d.id}${d.text}`)
        .attr('d', d => d.petalPath)
        .attr('transform', d => `translate(${d.center[0]}, ${d.center[1]}) rotate(${d.angle}) scale(${0})`)
        .transition().duration(1250)
        .attr('transform', d => {
          return `translate(${d.center[0]}, ${d.center[1]}) rotate(${d.angle}) scale(${d.petSize === 0 ? 0 : spiScale(100) * .01 / initialScale})`
        })
        .style('stroke', 'black')
        .style('fill', d => d.colorRef)
        .style("opacity", "0.50")
        .attr("cursor", "pointer")

      toolTip
        .selectAll('.petalPath')
        .data(d.properties.flower.petals)
        .join('path')
        .attr('class', 'petalPath')
        .attr('id', d => `${d.id}_${d.text}`)
        .attr('d', d => d.petalPath)
        .attr('transform', d => `translate(${d.center[0]}, ${d.center[1]}) rotate(${d.angle}) scale(${0})`)
        .transition().duration(1250)
        .attr('transform', d => `translate(${d.center[0]}, ${d.center[1]}) rotate(${d.angle}) scale(${d.petSize * .01 / initialScale})`)
        .style('stroke', 'black')
        .style('fill', d => d.colorRef)
        .attr("cursor", "pointer")


      toolTip.selectAll('.petalScoreText')
        .data(d.properties.flower.petals)
        .join('text')
        .attr("id", d=> `${d.id}_${d.text}_txt`)
        .attr('class', 'petalScoreText')
        .append("tspan")
        .attr("text-anchor", "middle")
        .attr("font-size", fontSize)
        .attr("font-weight", 700)
        .attr("x", d => {
          // adjust for initial scale
          if (d.angle === 30) {
            return x + (d.petSize / Math.sqrt(2))/initialScale + (d.petSize > 60 ? - 20 : + 20)/initialScale;
          }
          if (d.angle === 150) {
            return x - (d.petSize / Math.sqrt(2))/initialScale + (d.petSize > 60 ? + 20 : - 20)/initialScale;
          }
          if (d.angle === 270) {
            return x
          }
        })
        .attr("y", d => {
          if (d.angle === 30) {
            return d.center[1] + (d.petSize / Math.sqrt(2))/initialScale + (d.petSize > 60 ? - 25 : + 10)/initialScale;
          }
          if (d.angle === 150) {
            return d.center[1] + (d.petSize / Math.sqrt(2))/initialScale + (d.petSize > 60 ? - 25 : + 10)/initialScale;
          }
          if (d.angle === 270) {
            return d.center[1] - (d.petSize / Math.sqrt(2))/initialScale + (d.petSize > 60 ? + 20 : -20)/initialScale;
          }
        })
        .text(d => {
          if (d.petSize === 0) { return null }
          return `${d.petSize}`;
        })

      toolTip.selectAll('.petalScoreText')
        .raise();

      toolTip.selectAll('.petalPath').on("mouseover", doItAll)
      toolTip.on("mouseleave", countryMouseLeave)

      text
        .attr('transform', `translate(${x}, ${(y + spiScale(140) / initialScale)})`)
        .append('tspan')
        .text(countryName)
        .attr('text-anchor', 'middle')
        .attr("font-size", fontSize)
        .attr("font-weight", 700)
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', 0)

        .append('tspan')
        .text(SPI)
        .attr("font-size", fontSize)
        .attr("font-weight", 700)
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', '1em')
        .attr('text-anchor', 'middle');
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

      toolTip.selectAll('.petalArc')
        .on('click', toggleModal)

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
        })
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
          setClickedSubCat(d.text);
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
      .data(countriesDataSet.filter(d => d.properties.ISO_A3_EH !== "ATA"))
      .join("path")
      .attr("d", path)
      .attr("class", "country")
      .attr("id", d => d.properties.ISO_A3_EH)
      .attr("cursor", "pointer")
      .attr("fill", d => { return d.properties.color || "#c4c2c4" })
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
      setClicked(undefined);
    }

    toolTip.raise();
    TextTooltip.raise();
    TextTooltip.attr("pointer-events", "none");
  };

  useEffect(()=>{
    // selectCountry()
  }, [countryValue])

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
  }, [yearValue, localGeoData, hardData, svgRef, checkedSize]);

  while (loading) return (<img src={loadingSpinner} alt={'loading spinner'} />)

  return (
    <svg ref={svgRef} height={height} width={width} id="map">
      <g className="tooltip-area">
        <text className="tooltip-area__text"></text>
      </g>
      <g className="graphicTooltip">
        <text className="graphicTooltip__text"></text>
      </g>
    </svg>
  );
};

export default MapMaker;