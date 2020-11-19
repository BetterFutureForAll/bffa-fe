import React, { memo } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";
import { spiData, getScore } from '../services/SocialProgress';
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

const MapChart = ({ setTooltipContent }) => {
  return (
    <>
      <ComposableMap data-tip="" projectionConfig={{ scale: 200 }}>
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                key={geo.rsmKey}
                geography={geo}
                //with Redux onMouseEnter will have to be dispatched.

// May have to extract onMouseEnter/onMouseLeave and set it a prop function to work with Redux
            
                onMouseEnter={() => {
                    const { NAME, POP_EST, NAME_LONG } = geo.properties;
                    //SPI Score comes in here
                    // getScore will have to be extracted to MapContainer, in order to keep the data at the state level
                    // Or will have to be wired to have access to setting data in State
                    getScore(NAME, NAME_LONG, spiData).then((SCORE)=> {
                      console.log(NAME + ' : ' + SCORE);
                      //setToolTip may be able to stay here but will need its data as props
                      setTooltipContent(`${NAME} — ${rounded(POP_EST)}, Social Progress Index - ${SCORE}`);
                    })
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
                      fill: "#F53",
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
  setTooltipContent: PropTypes.func.isRequired
};
//connect or memo, or both? 
export default memo(MapChart);
