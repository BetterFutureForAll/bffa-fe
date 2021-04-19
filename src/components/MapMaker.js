import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from "topojson-client";


const MapMaker = ({ clicked, setClicked, yearValue, setMouse, width, height }) => {

  // import topoJSON and CSV here
  let localGeoData = process.env.PUBLIC_URL + '/topoMap.json';
  let hardData = require('../assets/2011-2020-Social-Progress-Index.csv');

  let petalPath = 'M 0 0 c 0 75 37 40 45 45 C 40 37 75 0 0 0';

  let scoreColor = d3.scaleLinear()
    .domain([0, 20, 40, 60, 80, 100])
    .range([
      '#c4c2c4',
      // '#f64c5c',
      '#c574fb',
      '#7484fb',
      '#00e4fb',
      '#00eb9b',
      '#20c30f'
    ]);

  function ready(data) {

    let projection = d3.geoEqualEarth()
      .scale(200)
      .translate([width / 2, height / 2]);

    let zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", zoomed);

    let path = d3.geoPath().projection(projection);

    let spiCountryGroup = d3.group(data[1], s => s["SPI country code"]);
    let countriesDataSet = feature(data[0], data[0].objects.countries).features
    let countryObjects = feature(data[0], data[0].objects.countries)

    // Map Binds to SPI data here, may need to move to UseEffect
    countriesDataSet.forEach(function (f) {

      let d = spiCountryGroup.get(f.properties.ISO_A3) || null;

      const spiScale = d3.scaleLinear().domain([0, 100]).range([0, 1]);

      let spi = d ? +d[0]["Social Progress Index"] : null;
      const spiSize = spiScale(spi);

      let basicNeeds = d ? +d[0]["Basic Human Needs"] : null;
      const basicSize = spiScale(basicNeeds);

      let foundations = d ? +d[0]["Foundations of Wellbeing"] : 0;
      const foundationSize = spiScale(foundations);

      let opportunity = d ? +d[0]["Opportunity"] : 0;
      const oppSize = spiScale(opportunity);

      f.properties.spi = d ? d[0] : { "Social Progress Index": null };
      f.properties.color = spi? scoreColor(spi) : null;
      // petals change to reflect 3 categories (basic needs etc)
      f.properties.flower = {
        petals: [
          { angle: -20, petalPath, center: path.centroid(f), petSize: basicSize, colorRef: basicNeeds, text: 'Basic Human Needs' },
          { angle: 100, petalPath, center: path.centroid(f), petSize: foundationSize, colorRef: foundations, text: 'Foundations of Wellbeing' },
          { angle: 220, petalPath, center: path.centroid(f), petSize: oppSize, colorRef: opportunity, text: 'Opportunity' }
        ],
        spiScale: spiSize,
        center: path.centroid(f),
        radius: (path.bounds(f)[0][1] - path.bounds(f)[0][1]),
        path: path.bounds(f)
      };
    })

    console.log('spi', spiCountryGroup);
    console.log('dataSet', countriesDataSet);

    // ***********  Top Level Selector (ViewBox) *************
    //extract into a useEffect fn for React reusability 
    let svg = d3.select("#map")
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .on("click", reset)
      .call(zoom)

    let g = svg.join("g")

    let countries = g.selectAll(".country")
      .data(countriesDataSet)
      .join("path")
      .attr("d", path)
      .attr("class", "country")
      .attr("id", d=> d.properties.ISO_A3)
      .attr("cursor", "pointer")
      .attr("fill", d => { return d.properties.color || "#c4c2c4" })
      .on("click", clicked)
      .on("mouseover", onHover)
      .append("title")
      .text(d => { return d.properties.NAME_LONG });

    let toolTip = g.selectAll(".tooltip")
      .data(countriesDataSet, d => { return d })
      .join("g")
      .attr("id", d=> d.properties.ISO_A3)
      .attr("class", "tooltip")
      .on("click", clicked)

    toolTip
      .append("circle")
      .attr("cx", d => d.properties.flower.center[0])
      .attr("cy", d => d.properties.flower.center[1])
      .attr("r", d => { 
        
        return d.properties.flower.spiScale ? 50 : null})
      .style('fill', 'black')
      .style("opacity", "0.5")
      toolTip.exit().remove();

    toolTip
      .append("circle")
      .attr('id', 'inner')
      .attr("cx", d => d.properties.flower.center[0])
      .attr("cy", d => d.properties.flower.center[1])
      .attr("r", d => { return d.properties.flower.spiScale * 50 })
      .style('fill', d => d.properties.color)
      .style("opacity", "0.5")
      toolTip.exit().remove();
    
    toolTip
      .selectAll('path')
      .data(d => d.properties.flower.petals)
      .join('path')
      .attr('id', 'petalPath')
      .attr('d', d => d.petalPath)
      .attr('transform', d => `translate(${d.center[0]}, ${d.center[1]}) rotate(${d.angle}) scale(${d.petSize})`)
      .style('stroke', 'black')
      .style('fill', d => { return scoreColor(d.colorRef) })
      .join('text')
      .append('title')
      // .text(d => d.text)
      .on("click", function(d) {
        console.log('Expand Function', d);
      })

    toolTip
      .attr("visibility", "hidden")

    // *** borders / whitespace mesh ***

    let whiteSpace = g.append("path")
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path(mesh(data[0], data[0].objects.countries, (a, b) => a !== b)))
    whiteSpace.exit().remove();

    function reset() {
      // countries.transition().style("fill", null);
      console.log('RESET');
      d3.selectAll(".tooltip").attr("visibility", "hidden");
      setClicked(undefined)
      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
      );
    }
    function onHover(event, d) {
      d3.selectAll(".tooltip").attr("visibility", "hidden");
      event.stopPropagation();
      console.log(event, d);
      // console.log(d3.selectAll(`#${d.properties.NAME}.tooltip`));
      setClicked(d.properties.ISO_A3);
      setMouse([event.screenX, event.screenY])
      console.log('mouseOver', d.properties.ISO_A3);
      d3.selectAll(`#${d.properties.ISO_A3}.tooltip`).attr("visibility", "visible");
    }

    function clicked(event, d) {
      let [[x0, y0], [x1, y1]] = path.bounds(d);
      event.stopPropagation();
      reset();
      // setClicked(d.properties.ISO_A3);
      countries.transition().style("fill", null);
      svg.transition().duration(750).call(
        zoom.transform,
        // d3.zoomIdentity
        //   .translate(width / 2, height / 2)
        //   .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
        //   .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
        // d3.pointer(event, svg.node())
      );
    }

    function zoomed(event) {
      const { transform } = event;
      g.attr("transform", transform);
      g.attr("stroke-width", 1 / transform.k);
    }

  };

  useEffect(() => {

    //render the geoData into a map
    let mapData = d3.json(localGeoData);
    let spiData = d3.csv(hardData).then((spi) => {
      let years = d3.group(spi, d => d['SPI year'])
      return years.get(yearValue);
    });

    Promise.all([mapData, spiData]).then(function (values) {
      console.log(values);
      ready(values);
    });

  }, [yearValue]);

  return (
    <div height={height} width={width} id="map"></div>
  );
};

export default MapMaker;