import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from "topojson-client";
import { colorScale } from '../services/SocialProgress';
import ToolTip from './ToolTip';

const MapMaker = ({
  svgRef, width, height, spiData, mapData, setClicked, setClickedSubCat,
  yearValue, loading, setLoading, zoomState, setZoomState,
  setCountryValue, tooltipContext }) => {

  let loadingSpinner = require('../assets/loadingMap.gif');
  

  useEffect(() => {

  function ready(data) {

    //Check Height Vs Width, use the width for small screens and height for large.
    let checkedSize = Math.min(height, width)

    let projection = d3.geoEqualEarth()
      .scale(checkedSize / 3)
      .translate([width / 2, height / 2])

    let path = d3.geoPath().projection(projection);

    let mapFeatures = feature(data[0], data[0].objects.countries).features;

    let spiCountryGroup = d3.group(data[1], s => s["SPI country code"]);
    function spiMatcher(id) { return spiCountryGroup.get(id); };
    function getSpiData(d) {
      let spiMatch;
      if (d.properties.ISO_A3_EH === '-99') {
        spiMatch = spiMatcher(d.properties.GU_A3);
      } else {
        spiMatch = spiMatcher(d.properties.ISO_A3_EH);
      }
      return spiMatch;
    }
    function countryMouseOver(event, d) {
      let spiMatch = getSpiData(d);
      let name = spiMatch ? spiMatch[0]["Country"] : "World";
      setCountryValue(name);
    };

    let zoomed = (event, d) => {
      const { transform } = event;
      // Save the Current Zoom level so we can scale tooltips. 
      setZoomState({ x: transform.x, y: transform.y, k: transform.k });

      svg.selectAll(".country, .border, .toolTipTarget")
        .attr('transform', transform)
        .attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`)
        .attr("stroke-width", 1 / transform.k);
    };

    const zoom = d3.zoom()
      .translateExtent([[-.25 * width, -.25 * height], [width * 1.5, height * 1.25]])
      .scaleExtent([1, 10])
      .on('zoom', zoomed)

    // *** Top Level Selector (ViewBox) ***
    let svg = d3.select(svgRef.current)
      .attr("id", "viewbox")
      .attr("viewBox", [0, 0, width, height])
      .attr('preserveAspectRatio', 'xMinYMid')
      .on('zoom', zoom)

    svg.selectAll('*').remove();

    let g = svg.append("g").attr('class', 'countries');

    svg.call(zoom);


    // *** Country groupings ***
    let countries = g.selectAll(".country")
      .data(mapFeatures.filter(d => d.properties.ISO_A3_EH !== "ATA"))
      .join("path")
      .attr("d", path)
      .attr("class", "country")
      .attr("id", (d, i) => {
        let match = getSpiData(d);
        return (match ? `${match[0]['SPI country code']}` : `i${i}`);
      })
      .attr("cursor", "pointer")
      .attr("fill", d => {
        let match = getSpiData(d);
        return match ? colorScale(match[0]['Social Progress Index']) : "#c4c2c4"
      })
      .on("click", countryMouseOver)
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
      .attr('id', (d, i) => {
        let match = getSpiData(d)
        //ID has to adjust for the spiMatch function to find it proper target.
        return (match ? `${match[0]['SPI country code']}_target` : `i${i}_target`)
      })
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

  };

    setLoading(true);
    if (spiData.length === 0) return;

    Promise.all([mapData, spiData]).then(function (values) {
      setLoading(false);
      ready(values);
    });

    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearValue, svgRef, height, width, spiData]);

  while (loading) return (<img src={loadingSpinner} alt={'loading spinner'} id="loading-spinner" className="loading-spinner" />)

  return (
    <svg ref={svgRef} height={height} width={width} id="map">
      <ToolTip
        tooltipContext={tooltipContext}
        zoomState={zoomState}
        setClicked={setClicked}
        setClickedSubCat={setClickedSubCat}
      />
    </svg>
  );
};

export default MapMaker;