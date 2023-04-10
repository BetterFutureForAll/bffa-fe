import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from "topojson-client";
import { colorScale } from '../services/SocialProgress';

const MapMaker = ({ mapProps, setCountryValue, countryValue }) => {

  let {
    loading,
    mapData,
    svgRef,
    size,
    spiData,
    yearValue
  } = mapProps;

  let [width, height] = size;

  useEffect(() => {
    if (mapData && spiData && !loading) {

      function ready(data) {
        let checkedSize = Math.min(width, height);
        let projection = d3.geoEqualEarth()
          .scale(checkedSize / 5)
          .translate([width / 2, height / 2])

        let path = d3.geoPath().projection(projection);
        let mapFeatures = feature(data[0], data[0].objects.countries).features;

        let spiCountryGroup = d3.group(data[1], d => d.spicountrycode);
        let spiNameGroup = d3.group(data[1], d => d.country);

        function getSpiData(d) {
          return spiCountryGroup.get(d.properties.mapId);
        }

        function countryMouseOver(event, d) {
          if(!d.properties) return
            let spiMatch = getSpiData(d);
            let mapName = spiMatch ? spiMatch[0].country : "World";
            setCountryValue(mapName);
        };

        let zoomed = (event, d) => {
          const { transform } = event;
          svg.selectAll(".country, .border, .toolTipTarget")
            .attr('transform', transform)
            .attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`)
            .attr("stroke-width", 1 / transform.k);
        };

        const zoom = d3.zoom()
          .translateExtent([[-.15 * width, -.15 * height], [width * 1.5, height * 1.25]])
          .scaleExtent([1, 10])
          .on('zoom', zoomed)

        function zoomToTarget(value) {
          let target = spiNameGroup.get(value)
          let targetId = `#${target[0].spicountrycode}_target`;
          if(!target || svg.select(targetId).empty()) return zoomToCenter();
          let bounds = svg.select(targetId).node().getBBox();
          const cx = bounds.x + bounds.width / 2;
          const cy = bounds.y + bounds.height / 2;
          const scale = 3;
          const transform = d3.zoomIdentity.translate(width / 2 - scale * cx, height / 2 - scale * cy).scale(scale);
          svg.transition().duration(500).call(zoom.transform, transform);
        }

        function zoomToCenter(event, d) {
          const transform = d3.zoomIdentity.scale(1)
          svg.transition().duration(500).call(zoom.transform, transform);
        }

        // *** Top Level Selector (ViewBox) ***
        let svg = d3.select(svgRef.current)
          .attr("id", "viewbox")
          .attr("viewBox", [0, 0, width, height])
          .attr('preserveAspectRatio', 'xMinYMid')
          .on('zoom', zoom)

        // svg.selectAll('*').remove();
        
        //White rectangle to allow clicks outside of countries to zoomToCenter
        svg.selectAll('.background')
        .data([1]).join('rect')
        .attr('class', 'background')
        .attr("width", width).attr("height", height)
        .attr("fill", "white")
        .on('click', zoomToCenter)

        svg.call(zoom);
        svg.selectAll('.countries').remove();
        
        // *** Country groupings ***
        let g = svg.selectAll('.countries').data([1]).join("g").attr('class', 'countries');
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

        //Programmatically call zoom after rerender due to values possibly changing from dropdown.
        if(countryValue === "World") zoomToCenter();
        else zoomToTarget(countryValue);

        //if that map renders after the tooltip, put the tooltip back on top. 
        d3.selectAll('.graphicTooltip').raise();
      };

      ready([mapData, spiData]);

    };

  }, [loading, mapData, spiData, height, width, svgRef, setCountryValue, countryValue, yearValue]);

  return (
    <></>
  );
};

export default MapMaker;
