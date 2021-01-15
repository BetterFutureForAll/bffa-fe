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

import ScoreCard from './scoreCard';
import FlowerMaker from './FlowerMaker';

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


const MapChart = ({ setTooltipContent, data, year }) => {

  let [colors, setColors] = useState('');
  useEffect(() => {
    // assign colors and append to data to match up with ISO_A3.
    let colorMap = { name: null, score: null };
    d3.json(geoUrl, function (result) {
      result.map(property => {
        if (property.ISO_A3 === data['SPI country code']) {
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
                const notFound = 'Score Not Found'
                console.log(data);
                const target = data.find(t => t['SPI country code'] === geo.properties.ISO_A3);
                const rank = target ? target['SPI Rank'] : 'Unranked';
                const basicNeeds = target ? target['Basic Human Needs'] : notFound;
                const foundations = target ? target['Foundations of Wellbeing'] : notFound;
                const opportunity = target ? target['Opportunity'] : notFound;
                const SCORE = target ? target['Social Progress Index'] : notFound;
                colorMaker(data, SCORE)

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      const { NAME, POP_EST, ISO_A3 } = geo.properties;
                      //create scoreCards here. 

                      let Pop = rounded(POP_EST);
                      ScoreCard({ NAME, Pop, data, geo, year })


                      // setTooltipContent(
                      //     <FlowerMaker data={data}></FlowerMaker>
                      //   )


                      // getScore(NAME, ISO_A3, data).then((SCORE) => {
                      // setTooltipContent(
                      //   SCORE==='Score not Found' ? notFound :
                      //   <ScoreCard 
                      //   NAME = {NAME}
                      //   POP_EST = {rounded(POP_EST)}
                      //   SCORE = {SCORE}
                      //   basicNeeds = {basicNeeds}
                      //   foundations = {foundations}
                      //   opportunity = {opportunity}
                      //   rank = {rank}
                      //   year = {year}
                      //   />
                      // )
                      // });

                      setTooltipContent(
                        SCORE === 'Score not Found' ? notFound :
                          `<h2>${NAME}</h2><b>
                          Population: ${rounded(POP_EST)}, <br/>
                          <p style="color:${scoreToColor(SCORE)}">Social Progress Index: ${SCORE}, </p>
                          <p style="color:${scoreToColor(basicNeeds)}">Basic Human Needs: ${basicNeeds}, </p>
                          <p style="color:${scoreToColor(foundations)}">Foundations of Wellbeing: ${foundations}, </p>
                          <p style="color:${scoreToColor(opportunity)}">Opportunity: ${opportunity}, </p>
                          Global Rank: ${rank} in ${year} </b>`
                      );


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
