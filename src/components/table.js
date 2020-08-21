import React, {Component} from 'react';
import * as csvData from '../assets/definitions.csv';
import * as d3 from 'd3';

export function Tabulate(data, display_columns, backend_columns) {
    var table = d3.select("div#symbolTable").append("table")
            .attr("style", "margin-left: 100px"),
        thead = table.append("thead"),
        tbody = table.append("tbody");
    thead.append("tr")
        .selectAll("th")
        .data(display_columns)
        .enter()
        .append("th")
            .text(function(column) { return column; });
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");
    var cells = rows.selectAll("td")
        .data(function(row) {
            return backend_columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
        .attr("style", "font-family: Courier") // sets the font style
            .html(function(d) { return d.value; });
    
    return table;
};
  
d3.csv(csvData,function (data) {
    var columns = ['Dimension','Component','Indicator name','Definition','Source','Link']
    Tabulate(data,columns)
  })
