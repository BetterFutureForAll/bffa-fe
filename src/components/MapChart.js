/* eslint-disable quotes */
import React, { memo, useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";
import { getScore } from '../services/SocialProgress';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
  let [colors, setColors] = useState('');
  
  let colorMaker = (score) => {
    // let score = Math.random() * 100;
    let color = scoreToColor(score);
    // let coloredStyle = {
    //   default: {
    //     fill: `${color}`,
    //     outline: "none"
    //   },
    //   hover: {
    //     fill: "#F53",
    //     outline: "none"
    //   },
    //   pressed: {
    //     fill: "#E42",
    //     outline: "none"
    //   }
    // };
    setColors(color);
  };
  



  
  return (
    <>
      <ComposableMap data-tip="" projectionConfig={{ scale: 200 }}>
        <ZoomableGroup>
          <Geographies geography={geoUrl} >
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    const { NAME, POP_EST, ISO_A3 } = geo.properties;
                    getScore(NAME, ISO_A3, data).then((SCORE) => {
                      colorMaker(SCORE);
                      setTooltipContent(`${NAME} — ${rounded(POP_EST)}, Year: ${year}, Social Progress Index - ${SCORE}`);
                    });
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  style={{
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
                  }}
                />
              ))
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
