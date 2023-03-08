import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from "topojson-client";
import { colorScale } from '../services/SocialProgress';
import ToolTip from './ToolTip';
import { countryIdTable } from '../assets/iso.json'

const MapMaker = ({
  svgRef, width, height, spiData, setClicked, setClickedSubCat,
  yearValue, loading, setLoading, zoomState, setZoomState,
  setCountryValue, tooltipContext }) => {

  let mapData = d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    .then(data => { 
      data.objects.countries.geometries.forEach((r) => {
        var result = countryIdTable.filter(function (iso) {
          return iso['country-code'] === r.id;
        });
        // assign an ISO-Alpha to each country geometry 
        r.properties['mapId'] = (result[0] !== undefined) ? result[0]["alpha-3"] : null;
      })
      return data;
    })

  let loadingSpinner = require('../assets/loadingMap.gif');

  useEffect(() => {

    function ready(data) {
      //Check Width for scale.
      let checkedSize = Math.min(width);
      let projection = d3.geoEqualEarth()
        .scale(checkedSize / 6)
        .translate([width / 2, height / 2])

      let path = d3.geoPath().projection(projection);
      let mapFeatures = feature(data[0], data[0].objects.countries).features;

      let spiCountryGroup = d3.group(data[1], d => d.spicountrycode);

      function spiMatcher(id) { return spiCountryGroup.get(id); };

      function getSpiData(d) {
        let spiMatch;
        spiMatch = spiMatcher(d.properties.mapId);
        if(!spiMatch) { console.log(d.properties)}
        return spiMatch;
      }

      function countryMouseOver(event, d) {
        let spiMatch = getSpiData(d);
        let name = spiMatch ? spiMatch[0].country : "World";
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
        .data(mapFeatures.filter(d => d.properties.mapId !== "ATA"))
        .join("path")
        .attr("d", path)
        .attr("class", "country")
        .attr("id", (d, i) => {
          let match = getSpiData(d);
          return (match ? `${match[0].spicountrycode}` : `i${i}`);
        })
        .attr("cursor", "pointer")
        .attr("fill", d => {
          let match = getSpiData(d);
          return match ? colorScale((match[0].score_spi || 0)) : "#c4c2c4"
        })
        .append("title")
        .text(d => { return `${d.properties.name}` })
        .on("click", countryMouseOver)
        .on("mouseenter", (event, d) => {
          d3.select(event.path[0]).style("opacity", ".8");
        })
        .on("mouseleave",
          d => { d3.select(d.path[0]).style("opacity", "1"); })

      countries.exit().remove();

      g.selectAll(`.toolTipTarget`)
        //** Filter Country matches here  */
        .data(mapFeatures.filter(d => d.properties.mapId !== "ATA"))
        .join('circle')
        .attr('class', 'toolTipTarget')
        .attr('id', (d, i) => {
          let match = getSpiData(d);
          if(d === 'WWW')console.log('target',match, d);
          //ID has to adjust for the spiMatch function to find it proper target.
          return (match ? `${match[0].spicountrycode}_target` : `${i}_target`)
        })
        .attr("cx", d => path.centroid(d)[0])
        .attr("cy", d => path.centroid(d)[1])
        .attr("r", 0)
//append a centerTarget for the world.
var bbox = d3.select('#viewbox').node().getBBox();
let center = [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2];
      g.selectAll(`.toolTipTarget`)
        .append('circle')
        .attr('id', "world_target")
        .attr("cx", center[0])
        .attr("cy", center[1])
        .attr("r", 0);

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