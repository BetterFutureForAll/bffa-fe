import React, { useState, useEffect } from 'react';
// import ReactDOM from ReactDOM;
import * as csvData from '../assets/definitions.csv';
import { csv }from 'd3';

const Tabulate = () => {

  // useEffect(() => { 

  // },[]);

    var tabulate = function (data,columns) {
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
          .data(function(row) {
            return columns.map(function (column) {
              return { column: column, value: row[column] }
            })
          })
          .enter()
        .append('td')
          .text(function (d) { return d.value })
    
          return table;
    }
      
    d3.csv(csvData,function (data) {
        var columns = ['Dimension','Component','Indicator name','Definition','Source','Link']
        tabulate(data,columns)
    })

    console.log(data);
};

export default Tabulate;
