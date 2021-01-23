import React, { useEffect } from 'react';
import * as d3 from 'd3';
import * as topojson from "topojson-client";



const MapMaker = (data) => {

  var margin = { top: 50, left: 50, right: 50, bottom: 50 },
    height = 400 - margin.top - margin.bottom,
    width = 800 - margin.right - margin.left;

  var svg = d3.select("#map")
  .append("svg")
  .attr("height", height + margin.top + margin.bottom)
  .attr("width", width + margin.left + margin.right)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;


  // import topoJSON and CSV here
  // Possibly use a remote hosted topoJSON file
  var world = require('../assets/world.topojson.json');
  
  console.log(world.objects.countries);




  // Projection is created here, round globe to flat monitor.
  var projection = d3.geoMercator()
    .translate([width / 2, height / 2])
    .scale(100)

  var path = d3.geoPath()
    .projection(projection)

  function ready(error, data) {
    console.log(data)
    var countries = topojson.feature(data, data.objects.countries).features
    svg.selectAll(".country")
      .data(countries)
      .enter().append("path")
      //attr can be set for anything we want. attr(property, value)
      //this is how we can mix a bar chart with "Z indexes" representing the SPI score.
      .attr("class", "country")
      .attr("d", path)

  }
  useEffect(() => {
    d3.json(world).then((d)=>{
      console.log(d);
      ready()
    })
  });

  return (
    <svg id="map"></svg>
  );
};

export default MapMaker;