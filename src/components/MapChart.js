import React, { memo } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";
import { getScore } from '../services/SocialProgress';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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

function scoreToColor(score) {
  var r, g, b = 0;
  if (score < 50) {
    r = 255;
    g = Math.round(5.1 * score);
  }
  else {
    g = 255;
    r = Math.round(510 - 5.10 * score);
  }
  var h = r * 0x10000 + g * 0x100 + b * 0x1;
  return '#' + ('000000' + h.toString(16)).slice(-6);
};


let colorMaker = () => {
  let score = Math.random() * 100;
  let color = scoreToColor(score);
  let coloredStyle = {
    default: {
      fill: `${color}`,
      outline: "none"
    },
    hover: {
      fill: "#F53",
      outline: "none"
    },
    pressed: {
      fill: "#E42",
      outline: "none"
    }
  };
  return coloredStyle;
};

let color = "#E42"
// ({ NAME, ISO_A3, data }) => getScore(NAME, ISO_A3, data).then(SCORE => scoreToColor(SCORE));

const MapChart = ({ setTooltipContent, data, year }) => {
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
                      setTooltipContent(`${NAME} — ${rounded(POP_EST)}, Year: ${year}, Social Progress Index - ${SCORE}`);
                    })
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  style={
                    colorMaker()
                  }
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
  setTooltipContent: PropTypes.func.isRequired
};

//connect or memo, or both? 
export default connect()(memo(MapChart));
