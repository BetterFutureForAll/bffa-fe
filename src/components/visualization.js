import * as d3 from 'd3';
import * as world from '../assets/world.topojson';

//importing topojson isnt working in a React context

export default function visualization() {
  var margin = { top: 50, left: 50, right: 50, bottom: 50 },
    height = 400 - margin.top - margin.bottom,
    width = 800 - margin.right - margin.left;

  var svg = d3.select("#map")
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // import topoJSON and CSV here
  // Possibly use a remote hosted topoJSON file

  console.log(world);

  Promise.all([
    d3.json(world),
    ready()
  ])

  // Projection is created here, round globe to flat monitor.
  var projection = d3.geoMercator()
    .translate([width / 2, height / 2])
    .scale(100)

  var path = d3.geoPath()
    .projection(projection)

  function ready(error, data) {
    console.log(data);

    var countries = world.feature(data, data.objects.countries).features

    svg.selectAll(".country")
      .data(countries)
      .enter().append("path")
      .attr("class", "country")
      .attr("d", path)

  }

};