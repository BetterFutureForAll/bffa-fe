import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { feature, mesh } from "topojson-client";
import { forEach, transform } from 'lodash';


const MapMaker = ({ svgRef, setClicked, yearValue, setMouse, width, height }) => {

  var margin = { top: 50, left: 10, right: 10, bottom: 25, }


  // import topoJSON and CSV here
  let localGeoData = process.env.PUBLIC_URL + '/topoMap.json';
  let hardData = require('../assets/2011-2020-Social-Progress-Index.csv');

  let petalPath = 'M 0 0 c 100 100 80 0 100 0 C 80 0 100 -100 0 0';

  let subPetalPath = "M 0 0 L 85 15 A 1 1 0 0 0 85 -15 L 0 0";


  let spiScale = d3.scaleLinear().domain([0, 100]).range([0, 100]);

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

    let yellowGreenBlue = d3.scaleLinear().domain([0,100]).range(["#ffffd9","#feffd8","#feffd6","#fdfed5","#fdfed4","#fcfed3","#fcfed2","#fbfdd0","#fafdcf","#fafdce","#f9fdcd","#f9fdcb","#f8fcca","#f7fcc9","#f7fcc8","#f6fcc7","#f6fbc6","#f5fbc5","#f4fbc4","#f4fbc3","#f3fac2","#f2fac1","#f1fac0","#f1f9bf","#f0f9be","#eff9bd","#eff9bc","#eef8bb","#edf8bb","#ecf8ba","#ebf7b9","#eaf7b9","#eaf7b8","#e9f6b8","#e8f6b7","#e7f6b7","#e6f5b6","#e5f5b6","#e4f4b5","#e3f4b5","#e2f4b5","#e1f3b4","#e0f3b4","#dff2b4","#ddf2b4","#dcf1b4","#dbf1b4","#daf0b4","#d9f0b3","#d7efb3","#d6efb3","#d5eeb3","#d3eeb3","#d2edb3","#d1edb4","#cfecb4","#ceecb4","#ccebb4","#cbebb4","#c9eab4","#c8e9b4","#c6e9b4","#c4e8b4","#c3e7b5","#c1e7b5","#bfe6b5","#bde5b5","#bce5b5","#bae4b5","#b8e3b6","#b6e2b6","#b4e2b6","#b2e1b6","#b0e0b6","#aedfb6","#acdfb7","#aadeb7","#a8ddb7","#a6dcb7","#a4dbb7","#a2dbb8","#a0dab8","#9ed9b8","#9cd8b8","#99d7b9","#97d7b9","#95d6b9","#93d5b9","#91d4b9","#8fd3ba","#8dd2ba","#8ad2ba","#88d1ba","#86d0bb","#84cfbb","#82cebb","#80cebb","#7ecdbc","#7cccbc","#7acbbc","#78cabc","#76cabd","#73c9bd","#71c8bd","#6fc7bd","#6dc6be","#6bc6be","#6ac5be","#68c4be","#66c3bf","#64c3bf","#62c2bf","#60c1bf","#5ec0c0","#5cbfc0","#5abfc0","#59bec0","#57bdc0","#55bcc1","#53bbc1","#52bac1","#50bac1","#4eb9c1","#4db8c1","#4bb7c1","#49b6c2","#48b5c2","#46b4c2","#45b3c2","#43b2c2","#42b1c2","#40b0c2","#3fafc2","#3daec2","#3cadc2","#3bacc2","#39abc2","#38aac2","#37a9c2","#35a8c2","#34a7c2","#33a6c2","#32a5c2","#31a3c1","#30a2c1","#2fa1c1","#2ea0c1","#2d9fc1","#2c9dc0","#2b9cc0","#2a9bc0","#299ac0","#2898bf","#2897bf","#2796bf","#2695be","#2693be","#2592be","#2591bd","#248fbd","#248ebc","#238cbc","#238bbb","#228abb","#2288ba","#2287ba","#2185b9","#2184b9","#2182b8","#2181b8","#217fb7","#217eb6","#207cb6","#207bb5","#2079b5","#2078b4","#2076b3","#2075b3","#2073b2","#2072b1","#2070b1","#216fb0","#216daf","#216cae","#216aae","#2169ad","#2167ac","#2166ac","#2164ab","#2163aa","#2261aa","#2260a9","#225ea8","#225da7","#225ca7","#225aa6","#2259a5","#2257a5","#2256a4","#2354a3","#2353a3","#2352a2","#2350a1","#234fa0","#234ea0","#234c9f","#234b9e","#234a9d","#23499d","#23479c","#23469b","#23459a","#224499","#224298","#224197","#224096","#223f95","#223e94","#213d93","#213c92","#213a91","#203990","#20388f","#20378d","#1f368c","#1f358b","#1e348a","#1e3388","#1d3287","#1d3185","#1c3184","#1c3082","#1b2f81","#1a2e7f","#1a2d7e","#192c7c","#182b7a","#172b79","#172a77","#162975","#152874","#142772","#132770","#13266e","#12256c","#11246b","#102469","#0f2367","#0e2265","#0d2163","#0d2161","#0c2060","#0b1f5e","#0a1e5c","#091e5a","#081d58"]);



  function ready(data) {

    let projection = d3.geoEqualEarth()
      .scale(200)
      .translate([(width + margin.left + margin.right) / 2, (height + margin.top + margin.bottom) / 2]);

    let zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", zoomed);

    let path = d3.geoPath().projection(projection);

    let spiCountryGroup = d3.group(data[1], s => s["SPI country code"]);
    let countriesDataSet = feature(data[0], data[0].objects.countries).features
    let countryObjects = feature(data[0], data[0].objects.countries)

    // Map Binds to SPI data here, may need to move to UseEffect
    countriesDataSet.forEach(function (f) {

      // catch unassigned ISO's (French colonies and other territories)
      if (f.properties.ISO_A3 === "-99") {
        f.properties.ISO_A3 = f.properties.GU_A3;
        //french colonies still assigned as FRA
        console.log();
      }

      // Clean up PARTIAL data, either place holder / null / Data Unavailable
      let d = spiCountryGroup.get(f.properties.ISO_A3) || null;


      let spi = d ? +d[0]["Social Progress Index"] : null;
      let spiSize = spiScale(spi);

      let basicNeeds = d ? +d[0]["Basic Human Needs"] : null;
      let basicSize = spiScale(basicNeeds);

      let basicSubCat = d ? [
                            d[0]["Nutrition and Basic Medical Care"],  
                            d[0]['Water and Sanitation'],
                            d[0]['Shelter'],
                            d[0]['Personal Safety']
                            ] : 
                            [0,0,0,0];

      let foundations = d ? +d[0]["Foundations of Wellbeing"] : 0;
      let foundationSize = spiScale(foundations);

      let foundationsSubCat = d ? [d[0]["Access to Basic Knowledge"], d[0]['Access to Information and Communications'], d[0]['Health and Wellness'], d[0]['Environmental Quality'],] : [0, 0, 0, 0];

      let opportunity = d ? +d[0]["Opportunity"] : 0;
      let oppSize = spiScale(opportunity);

      let opportunitySubCat = d ? [d[0]["Personal Rights"], d[0]["Personal Freedom and Choice"], d[0]["Inclusiveness"], d[0]["Access to Advanced Education"],] : [0, 0, 0, 0];

      // Individual Map Colors
      f.properties.spi = d ? d[0] : { "Social Progress Index": null };
      f.properties.color = spi ? scoreColor(spi) : null;


      // petals change to reflect 3 categories (basic needs etc)
      f.properties.flower = {
        petals: [
          { angle: 30, petalPath, center: path.centroid(f), petSize: basicSize, colorRef: basicNeeds, text: 'Basic Human Needs', subCat: basicSubCat },
          { angle: 150, petalPath, center: path.centroid(f), petSize: foundationSize, colorRef: foundations, text: 'Foundations of Wellbeing', subCat: foundationsSubCat },
          { angle: 270, petalPath, center: path.centroid(f), petSize: oppSize, colorRef: opportunity, text: 'Opportunity', subCat: opportunitySubCat }
        ],
        subPetals: [
          //Basic Needs
          { angle: 0, subPetalPath, center: path.centroid(f), petSize: spiScale(basicSubCat[0]), colorRef: spiScale(basicSubCat[0]), text: `Nutrition and Basic Medical Care: ${basicSubCat[0]}` },
          { angle: 20, subPetalPath, center: path.centroid(f), petSize: spiScale(basicSubCat[1]), colorRef: spiScale(basicSubCat[1]), text: `Water and Sanitation: ${basicSubCat[1]}` },
          { angle: 40, subPetalPath, center: path.centroid(f), petSize: spiScale(basicSubCat[2]), colorRef: spiScale(basicSubCat[2]), text: `Shelter: ${basicSubCat[2]}` },
          { angle: 60, subPetalPath, center: path.centroid(f), petSize: spiScale(basicSubCat[3]), colorRef: spiScale(basicSubCat[3]), text: `Personal Safety: ${basicSubCat[3]}` },
          // Foundations
          { angle: 120, subPetalPath, center: path.centroid(f), petSize: spiScale(foundationsSubCat[0]), colorRef: spiScale(foundationsSubCat[0]), text: `Access to Basic Knowledge: ${foundationsSubCat[0]}` },
          { angle: 140, subPetalPath, center: path.centroid(f), petSize: spiScale(foundationsSubCat[1]), colorRef: spiScale(foundationsSubCat[1]), text: `Access to Information and Communications: ${foundationsSubCat[1]}` },
          { angle: 160, subPetalPath, center: path.centroid(f), petSize: spiScale(foundationsSubCat[2]), colorRef: spiScale(foundationsSubCat[2]), text: `Health and Wellness: ${foundationsSubCat[2]}` },
          { angle: 180, subPetalPath, center: path.centroid(f), petSize: spiScale(foundationsSubCat[3]), colorRef: spiScale(foundationsSubCat[3]), text: `Environmental Quality: ${foundationsSubCat[3]}` },
          // Opportunity
          { angle: 240, subPetalPath, center: path.centroid(f), petSize: spiScale(opportunitySubCat[0]), colorRef: spiScale(opportunitySubCat[0]), text: `Personal Rights: ${opportunitySubCat[0]}` },
          { angle: 260, subPetalPath, center: path.centroid(f), petSize: spiScale(opportunitySubCat[1]), colorRef: spiScale(opportunitySubCat[1]), text: `Personal Freedom and Choice: ${opportunitySubCat[1]}` },
          { angle: 280, subPetalPath, center: path.centroid(f), petSize: spiScale(opportunitySubCat[2]), colorRef: spiScale(opportunitySubCat[2]), text: `Inclusiveness: ${opportunitySubCat[2]}` },
          { angle: 300, subPetalPath, center: path.centroid(f), petSize: spiScale(opportunitySubCat[3]), colorRef: spiScale(opportunitySubCat[3]), text: `Access to Advanced Education: ${opportunitySubCat[3]}` },
        ],
        spiScale: spiSize,
        spi,
        center: path.centroid(f),
        bounds: path.bounds(f),
      };
    })

    // *** Top Level Selector (ViewBox) ***
    let svg = d3.select(svgRef.current)

    let g = svg.join("g")
      .append("svg")
      .attr("viewBox", [0, 0, `${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`])
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      svg.exit().remove();

    // *** Country groupings ***
    let countries = g.selectAll(".country")
      .data(countriesDataSet)
      .join("path")
      .attr("d", path)
      .attr("class", "country")
      .attr("id", d => d.properties.ISO_A3)
      .attr("cursor", "pointer")
      .attr("fill", d => { return d.properties.color || "#c4c2c4" })
      .on("click", clicked)
      .on("mouseover", onHover)
      // .on("mouseout", reset)
      .append("title")
      .attr("style", "bold")
      .text(d => { return d.properties.NAME_LONG })
      countries.exit().remove();

    // *** borders / whitespace mesh ***
    let whiteSpace = g.append("path")
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path(mesh(data[0], data[0].objects.countries, (a, b) => a !== b)))
      
    whiteSpace.exit().remove();

    // *** Tool Tip *** 
    let toolTip = g.selectAll(".tooltip")
    .data(countriesDataSet, d => { return d })
    .join("g")
    .append("svg")
      .attr("id", d => d.properties.ISO_A3)
      .attr("class", "tooltip")

    toolTip
      .append("circle")
      .attr("cx", d => d.properties.flower.center[0])
      .attr("cy", d => d.properties.flower.center[1])
      .attr("r", d =>  d.properties.flower.spiScale ? spiScale(100): null)
      .style('fill', '#c4c2c4')
      .style("opacity", "0.5")
      .style('stroke', 'black')
    toolTip.exit().remove();

    toolTip
      .append("circle")
      .attr('id', 'inner')
      .attr("cx", d => d.properties.flower.center[0])
      .attr("cy", d => d.properties.flower.center[1])
      .attr("r", d =>  d.properties.flower.spiScale)
      .style('fill', d => d.properties.color)
      .style('stroke', 'black')
      // .style("opacity", "0.5")
      .append("title")
      .text(d=> { return `Social Progress Index \n ${d.properties.flower.spi}`})
    toolTip.exit().remove();


// *** Individual Flower Petals ***
    toolTip
      .selectAll('.petalBackgroundPath')
      .data(d => d.properties.flower.petals)
      .join('path')
      .attr('class', 'petalBackgroundPath')
      .attr('d', d => d.petalPath)
      .attr('transform', d => `translate(${d.center[0]}, ${d.center[1]}) rotate(${d.angle}) scale(${spiScale(100) * .01})`)
      .style('stroke', 'black')
      .style('fill', d => { return scoreColor(d.colorRef) })
      .style("opacity", "0.25")
      toolTip.exit().remove();

    toolTip
      .selectAll('.petalPath')
      .data(d => d.properties.flower.petals)
      .join('path')
      .attr('class', 'petalPath')
      .attr('d', d => d.petalPath)
      .attr('transform', d => `translate(${d.center[0]}, ${d.center[1]}) rotate(${d.angle}) scale(${d.petSize * .01})`)
      .style('stroke', 'black')
      .style('fill', d => { return scoreColor(d.colorRef) })
      .on("click", expandPetal)
      .join('text')
      .append('title')
      .text(d => {
        if(d.text === "Basic Human Needs"){ 
        return `${d.text} : ${d.colorRef} \n Nutrition and Basic Medical Care : ${d.subCat[0]} \n Water and Sanitation : ${d.subCat[1]} \n Shelter : ${d.subCat[2]} \n Personal Safety ${d.subCat[3]}`
        }
        if(d.text === "Foundations of Wellbeing") {
          return `${d.text} : ${d.colorRef} \n Access to Basic Knowledge : ${d.subCat[0]} \n Access to Information and Communications : ${d.subCat[1]} \n Health and Wellness : ${d.subCat[2]} \n Environmental Quality : ${d.subCat[3]}`
        }
        if(d.text === "Opportunity") {
          return `${d.text} : ${d.colorRef} \n Personal Rights : ${d.subCat[0]} \n Personal Freedom and Choice : ${d.subCat[1]} \n Inclusiveness : ${d.subCat[2]} \n Access to Advanced Education : ${d.subCat[3]}`
        }
      })
      toolTip.exit().remove();

// *** Sub Petals ***

      //background
    toolTip
      .selectAll('.subPetalBackgroundPath')
      .data(d =>
        { return d.properties.flower.subPetals }
      )
      .join('path')
      .attr('class', 'subPetalBackgroundPath')
      .attr('d', d => d.subPetalPath)
      .attr('transform', d => `translate(${d.center[0]}, ${d.center[1]}) rotate(${d.angle}) scale(${spiScale(100) * .01})`)
      // .style('stroke', 'white')
      .style('fill', d => { return scoreColor(d.colorRef) })
      .style("opacity", "0.25")
      
      //scaled
    toolTip
      .selectAll('.subPetalPath')
      .data(d => d.properties.flower.subPetals)
      .join('path')
      .attr('class', 'subPetalPath')
      .attr('d', d => d.subPetalPath)
      .attr('transform', d => `translate(${d.center[0]}, ${d.center[1]}) rotate(${d.angle}) scale(${d.petSize * .01})`)
      .style('stroke', 'black')
      .style('fill', d => { return scoreColor(d.colorRef) })
      .style("opacity", "0.75")
      // .attr("path", "M 0 0 L 100 0")
      .append("title")
      .append("text")
      .text(d => d.text)
      toolTip.exit().remove();


    toolTip
      .append('text')
      .attr('class', 'name')
      .attr('text-anchor', 'middle')
      .attr('transform', d => `translate(${d.properties.flower.center[0]},${d.properties.flower.center[1] + 110})`)
      .text(d => d.properties.NAME_LONG)
      toolTip.exit().remove();
    
    toolTip.selectAll(".subPetalPath").attr("visibility", "hidden")
    toolTip.selectAll(".subPetalBackgroundPath").attr("visibility", "hidden")

    toolTip
      .attr("visibility", "hidden")

    // *** Event Listeners ***
    function reset() {
      console.log('RESET');
      d3.selectAll(".tooltip").attr("visibility", "hidden");
      setClicked(undefined);
    }

    function onHover(event, d) {
      event.stopPropagation();
      setTimeout(function(){
        d3.selectAll(".tooltip").attr("visibility", "hidden");
        // console.log(event, d, this);
        setMouse([event.screenX, event.screenY])
        d3.selectAll(`#${d.properties.ISO_A3}.tooltip`).attr("visibility", "visible");
      }, 1000)
      d3.select(this)
    }

    function expandPetal(event, d) {
      console.log("Expand the Petal", event, d, this);
      // d3.selectAll(`#${d.properties.ISO_A3}.subPetalPath`).attr("visibility", "visible");
      // d3.selectAll(`#${d.properties.ISO_A3}.subPetalBackgroundPath`).attr("visibility", "visible");
      // d3.selectAll(this).selectAll(".subPetalBackgroundPath").attr("visibility", "visible")
      d3.selectAll(this).attr("visibility", "visible")
    }

    function clicked(event, d) {
      let [[x0, y0], [x1, y1]] = path.bounds(d);
      event.stopPropagation();
      console.log('petal clicked', event, d.properties);
      reset();
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
    console.log("UseEffect Fired");

    Promise.all([mapData, spiData]).then(function (values) {
      console.log(values);
      d3.select(svgRef.current).exit().remove();
      ready(values);
    });


  }, [yearValue]);

  return (
    <svg ref={svgRef} height={height} width={width} id="map"></svg>
  );
};

export default MapMaker;