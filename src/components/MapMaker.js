import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from "topojson-client";
import DrawFlowers from './DrawFlowers';
import { scoreToColor } from '../hooks/hooks';
import { getScore } from '../services/SocialProgress';

const MapMaker = ({ clicked, setClicked, yearValue }) => {

  // import topoJSON and CSV here
  let localGeoData = process.env.PUBLIC_URL + '/topoMap.json';
  let hardData = require('../assets/2011-2020-Social-Progress-Index.csv');

  var margin = { top: 50, left: 50, right: 50, bottom: 50 };

  let width = 1000;
  let height = 500;

  function ready(data) {

    var projection = d3.geoEqualEarth()
      .scale(200)
      .translate([width / 2, height / 2]);

    let zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", zoomed);

    var path = d3.geoPath().projection(projection);

    var svg = d3.select("#map")
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .on("click", reset);

    svg.exit().remove();

    let g = svg.append("g")
    g.exit().remove();

    svg.call(zoom);

    let spiCountryGroup = d3.group(data[1], s => s["SPI country code"]);
    var countriesDataSet = feature(data[0], data[0].objects.countries).features
    var countryObjects = feature(data[0], data[0].objects.countries)
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


    // Map Binds to SPI data here, may need to move to UseEffect
    countriesDataSet.forEach(function (f) {
      // console.log('get', spiCountryGroup.get(f.properties.ISO_A3));
      let d = spiCountryGroup.get(f.properties.ISO_A3);

      const spiScale = d3.scaleLinear().domain([0, 100]).range([0, 1]);
      
      let spi = d? +d[0]["Social Progress Index"] : 0;
      const spiSize = spiScale(spi);
      
      let basicNeeds = d? +d[0]["Basic Human Needs"] : 0;
      const basicSize = spiScale(basicNeeds);
      
      let foundations = d? +d[0]["Foundations of Wellbeing"] : 0;
      const foundationSize = spiScale(foundations);
      
      let opportunity = d? +d[0]["Opportunity"] : 0;
      const oppSize = spiScale(opportunity);
      
      let petalPath = 'M 0 0 c 0 75 37 40 45 45 C 40 37 75 0 0 0';
      
      f.properties.spi = d? d[0] : { "Social Progress Index": 0 };
      f.properties.color = scoreColor(spi);
      // petals change to reflect 3 categories (basic needs etc)
      f.properties.flower = {
        petals: [
          { angle: -20, petalPath, petSize: basicSize, colorRef: basicNeeds, text: 'Basic Human Needs' },
          { angle: 100, petalPath, petSize: foundationSize, colorRef: foundations, text: 'Foundations of Wellbeing' },
          { angle: 220, petalPath, petSize: oppSize, colorRef: opportunity, text: 'Opportunity' }
        ],
        spiScale: spiSize
      };
    })

    console.log('spi', spiCountryGroup);
    console.log('dataSet', countriesDataSet);

    var countries = g.selectAll("path")
      .data(countriesDataSet)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "#country")
      .attr("cursor", "pointer")
      .attr("fill", d => { return d.properties.color })
      .on("click", clicked)

    countries
      .append("title")
      .text(d => { return d.properties.NAME });

    countries.exit().remove();

    // borders / whitespace mesh
    g.append("path")
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path(mesh(data[0], data[0].objects.countries, (a, b) => a !== b)));

    function reset() {
      // countries.transition().style("fill", null);
      console.log('RESET');
      // toolTip.style("visibility", "hidden");
      setClicked('WWW')
      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
      );
    }

    function clicked(event, d) {
      const [[x0, y0], [x1, y1]] = path.bounds(d);
      event.stopPropagation();
      reset();
      setClicked(d.properties.ISO_A3);
      // countries.transition().style("fill", null);
      // d3.select(this).transition().style("fill", "red");
      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
        d3.pointer(event, svg.node())
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
      // spi.ISO_A3 = spi['SPI country code'];
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