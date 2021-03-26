/* eslint-disable quotes */
import React, { memo } from "react";
import ReactDOM from 'react-dom';
import { ReactDOMServer } from 'react-dom/server';

import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { scoreToColor } from '../hooks/hooks';
import DrawFlowers from "./DrawFlowers";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const rounded = num => {
  if (num > 1000000000) {
    return Math.round(num / 100000000) / 10 + "Bn";
  } else if (num > 1000000) {
    return Math.round(num / 100000) / 10 + "M";
  } else {
    return Math.round(num / 100) / 10 + "K";
  }
};




const MapChart = ({ setTooltipContent, data, year, svgRef, countryValue }) => {

  let notFound = `SPI Score Unavailable for ${year}`;



  return (
    <>
      <ComposableMap data-tip="" projectionConfig={{ scale: 200 }}>
        <ZoomableGroup>
          <Geographies geography={geoUrl} >
            {({ geographies }) =>
              geographies.map(geo => {
                // this whole target function can be extracted to DRY it out.

                //ERROR check target, Breaks on some countries like Venezuela.
                // const notFound = 'Score Not Found'
                const target = data.find(t => t['SPI country code'] === geo.properties.ISO_A3 || t['Country'] === geo.properties.NAME_LONG );
                const rank = target ? target['SPI Rank'] : 'Unranked';
                const basicNeeds = target ? target['Basic Human Needs'] : notFound;
                const foundations = target ? target['Foundations of Wellbeing'] : notFound;
                const opportunity = target ? target['Opportunity'] : notFound;
                const SCORE = target ? target['Social Progress Index'] : notFound;
                const countryTarget = target ? target['Country'] : undefined;
              
                // colorMaker(data, SCORE);


                // const flowerTarget = flowers.find(t => t.name === geo.properties.NAME_LONG)

                return (

                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      // console.log(flowerContent);
                      const { NAME, POP_EST } = geo.properties;
                      console.log('target', countryTarget);
                      let flowerCard = <DrawFlowers 
                        svgRef={svgRef} 
                        yearValue={year}
                        countryValue={countryTarget}
                        />;                 
                      let card = 
                      `<h2>${NAME}</h2><b>
                      Population: ${rounded(POP_EST)}, <br/>
                      <p style="color:${scoreToColor(SCORE)}">Social Progress Index: ${SCORE}, </p>
                      <p style="color:${scoreToColor(basicNeeds)}">Basic Human Needs: ${basicNeeds}, </p>
                      <p style="color:${scoreToColor(foundations)}">Foundations of Wellbeing: ${foundations}, </p>
                      <p style="color:${scoreToColor(opportunity)}">Opportunity: ${opportunity}, </p>
                      <div> </div>
                      Global Rank: ${rank} in ${year} </b>`;
                      console.log(flowerCard);
                      setTooltipContent(card);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                    }}
                    style={{
                      default: {
                        fill: `${target ? scoreToColor(target['Social Progress Index']) : "#EEE"}`,
                        outline: "black"
                      },
                      hover: {
                        fill: `${target ? scoreToColor(target['Social Progress Index']) : "#EEE"}`,
                        outline: "black"
                      },
                      pressed: {
                        fill: "#E42",
                        outline: "black"
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

  <DrawFlowers 
  spiByYear={data}
  svgRef={svgRef} 
  yearValue={year}
  countryValue={countryValue}
  />

  
    </>
  );
};

MapChart.propTypes = {
  setTooltipContent: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  year: PropTypes.string.isRequired
};

//connect or memo, or both? 
export default connect()(memo(MapChart));
