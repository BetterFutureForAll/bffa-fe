import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

const definitions = require('../services/SocialProgress');

// This will be a table of definitions. Need to actually make it into a REACT COMPONENT, so that D3 and React don't fight for DOM.


const Tabulate = (data, columns) => {

  var table = d3.select('body').append('table')
  var thead = table.append('thead')
  var tbody = table.append('tbody')

  thead.append('tr')
    .selectAll('th')
    .data(columns)
    .enter()
    .append('th')
    .text(function (d) { return d })

  var rows = tbody.selectAll('tr')
    .data(data)
    .enter()
    .append('tr')

  var cells = rows.selectAll('td')
    .data(function (row) {
      return columns.map(function (column) {
        return { value: row[column] }
      })
    })
    .enter()
    .append('td')
    .text(function (d) { return d.value })

  return table;
};

useEffect(() => {
  let data = d3.csv(definitions);
  var columns = ['Dimension', 'Component', 'Indicator name', 'Definition', 'Source', 'Link']
  Tabulate(data, columns)
  console.log(data);
  

})


export default Tabulate;
