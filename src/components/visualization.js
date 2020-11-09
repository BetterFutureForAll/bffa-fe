(function() {
  var margin = { top: 50, left: 50, right: 50, bottom: 50 },
    height = 400 - margin.top - margin.bottom,
    width = 800 - margin.right - margin.left;

  var svg = d3.select("#map")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var projection = d3.geoMercator()
      .translate([ width / 2, height / 2 ])

  var path = d3.geoPath()
    .projection(projection)

  function ready (error, data) {
    console.log(data);

  }

})