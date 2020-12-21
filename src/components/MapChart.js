/* eslint-disable quotes */
import React, { memo, useEffect, useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";
import { getScore } from '../services/SocialProgress';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as d3 from 'd3';

import { scoreToColor } from '../hooks/hooks';

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const rounded = num => {
  if(num > 1000000000) {
    return Math.round(num / 100000000) / 10 + "Bn";
  } else if(num > 1000000) {
    return Math.round(num / 100000) / 10 + "M";
  } else {
    return Math.round(num / 100) / 10 + "K";
  }
};


const MapChart = ({ setTooltipContent, data, year }) => {
  //Append data to geoUrl?
  //append data['SPI country code] to ISO_A3 of geo 


  let [colors, setColors] = useState('');
  useEffect(()=>{
    // assign colors and append to data to match up with ISO_A3.
    let colorMap = { name: null, score: null };
    d3.json(geoUrl, function(result) {
      result.map(property => {
        if(property.ISO_A3 === data['SPI country code']) {
          colorMap = {
            name: property.ISO_A3,
            score: property['Social Progress Index']
          };
        }
        return colorMap;
      });
    });
  }, [data, year]);

  let colorMaker = (score) => {
    let color = scoreToColor(score);
    setColors(color);

    let coloredStyle = {
      default: {
        fill: "#D6D6DA",
        outline: "none"
      },
      hover: {
        fill: `${colors}`,
        outline: "none"
      },
      pressed: {
        fill: "#E42",
        outline: "none"
      }
    };
    return coloredStyle;
  }; 


  return (
    <>
      <ComposableMap data-tip="" projectionConfig={{ scale: 200 }}>
        <ZoomableGroup>
          <Geographies geography={geoUrl} >
            {({ geographies }) =>
              geographies.map(geo => {
                const target = data.find(t => t['SPI country code'] === geo.properties.ISO_A3);
                const rank = target ? target['SPI Rank'] : 'Unranked';
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      const { NAME, POP_EST, ISO_A3 } = geo.properties;
                      getScore(NAME, ISO_A3, data).then((SCORE) => {
                        colorMaker(SCORE);
                        console.log(target);
                        setTooltipContent(
                          `${NAME}, <br/>
                          Population, ${rounded(POP_EST)}, <br/>
                          Social Progress Index: ${SCORE}, <br/>
                          Global Rank: ${rank} in ${year} `);
                      });
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
                        outline: "none"
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
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
