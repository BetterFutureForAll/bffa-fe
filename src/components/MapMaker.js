import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from "topojson-client";
import { colorScale } from '../services/SocialProgress';

const MapMaker = ({ mapProps, setZoomState, setCountryValue }) => {

  let {
    loading,
    mapData,
    svgRef,
    size,
    spiData,
  } = mapProps;

  let [width, height] = size;
  useEffect(() => {
    if (mapData && spiData && !loading) {
      function ready(data) {
      //Check Width for scale.
      let checkedSize = Math.min(width, height);
      console.log('size',checkedSize, width)
      let projection = d3.geoEqualEarth()
        .scale(checkedSize / 5)
        .translate([width / 2, height / 2])

      let path = d3.geoPath().projection(projection);
      let mapFeatures = feature(data[0], data[0].objects.countries).features;

      let spiCountryGroup = d3.group(data[1], d => d.spicountrycode);

      function spiMatcher(id) { return spiCountryGroup.get(id); };

      function getSpiData(d) {
        let spiMatch;
        spiMatch = spiMatcher(d.properties.mapId);
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
        .translateExtent([[-.15 * width, -.15 * height], [width * 1.5, height * 1.25]])
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
        .on("click", countryMouseOver)
        .on("mouseenter", (event, d) => {
          d3.select(event.target).style("opacity", ".8");
        })
        .on("mouseleave",
          d => { d3.select(d.target).style("opacity", "1"); })
        .append("title")
        .text(d => { return `${d.properties.name}` })

      countries.exit().remove();

      g.selectAll(`.toolTipTarget`)
        //** Filter Country matches here  */
        .data(mapFeatures.filter(d => d.properties.mapId !== "ATA"))
        .join('circle')
        .attr('class', 'toolTipTarget')
        .attr('id', (d, i) => {
          let match = getSpiData(d);
          if (d === 'WWW') console.log('target', match, d);
          //ID has to adjust for the spiMatch function to find it proper target.
          return (match ? `${match[0].spicountrycode}_target` : `${i}_target`)
        })
        .attr("cx", d => path.centroid(d)[0])
        .attr("cy", d => path.centroid(d)[1])
        .attr("r", 0)

      //append a centerTarget for the world.
      g.selectAll(`.toolTipTarget`)
        .append('circle')
        .attr('id', "world_target")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
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

    ready([mapData, spiData]);
  };

  }, [loading, mapData, spiData, height, width, svgRef, setZoomState, setCountryValue]);

  return (
    <></>
  );
};

export default MapMaker;


// import { useState, useCallback, useEffect } from 'react';
// import * as d3 from 'd3';
// import { feature, mesh } from 'topojson-client';
// import { colorScale } from '../services/SocialProgress';

// const useMapMaker = ({ setLoading, setZoomState, setCountryValue }) => {
//   const [mapData, setMapData] = useState(null);
//   const [spiData, setSpiData] = useState(null);
//   const [width, setWidth] = useState(0);
//   const [height, setHeight] = useState(0);
//   const svgRef = useRef(null);

//   const loadMapData = useCallback(() => {
//     Promise.all([
//       fetch('/path/to/mapData.json').then((response) => response.json()),
//       fetch('/path/to/spiData.json').then((response) => response.json()),
//     ]).then(([mapData, spiData]) => {
//       setMapData(mapData);
//       setSpiData(spiData);
//       setLoading(false);
//     });
//   }, [setLoading]);

//   useEffect(() => {
//     loadMapData();
//   }, [loadMapData]);

//   useEffect(() => {
//     if (mapData && spiData) {
//       const { width: newWidth, height: newHeight } = svgRef.current.getBoundingClientRect();
//       setWidth(newWidth);
//       setHeight(newHeight);

//       function ready(data) {
//         // Check Width for scale.
//         let checkedSize = Math.min(width);
//         let projection = d3.geoEqualEarth()
//           .scale(checkedSize / 6)
//           .translate([width / 2, height / 2])

//         let path = d3.geoPath().projection(projection);
//         let mapFeatures = feature(data[0], data[0].objects.countries).features;

//         let spiCountryGroup = d3.group(data[1], d => d.spicountrycode);

//         function spiMatcher(id) { return spiCountryGroup.get(id); };

//         function getSpiData(d) {
//           let spiMatch;
//           spiMatch = spiMatcher(d.properties.mapId);
//           return spiMatch;
//         }

//         function countryMouseOver(event, d) {
//           let spiMatch = getSpiData(d);
//           let name = spiMatch ? spiMatch[0].country : 'World';
//           setCountryValue(name);
//         };

//         let zoomed = (event, d) => {
//           const { transform } = event;
//           // Save the Current Zoom level so we can scale tooltips.
//           setZoomState({ x: transform.x, y: transform.y, k: transform.k });

//           svg.selectAll('.country, .border, .toolTipTarget')
//             .attr('transform', transform)
//             .attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`)
//             .attr('stroke-width', 1 / transform.k);
//         };

//         const zoom = d3.zoom()
//           .translateExtent([[-.25 * width, -.25 * height], [width * 1.5, height * 1.25]])
//           .scaleExtent([1, 10])
//           .on('zoom', zoomed);

//         // *** Top Level Selector (ViewBox) ***
//         let svg = d3.select(svgRef.current)
//           .attr('id', 'viewbox')
//           .