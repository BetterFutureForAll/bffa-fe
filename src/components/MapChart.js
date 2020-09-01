import React, { memo } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";

import * as csvData from '../assets/2019-global.csv';
import * as d3 from 'd3';

// Can Data from SPI spreadsheets be integrated here?    d3.csv(csvData,function (data) {};
// add SPI score as a geo.property or reference to the CSV?

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

// geo.properties { NAME } corresponds to csvData { Country }
// this has access to SPI data, need to link data.Country to NAME, then attach the Social Progress Index score to its corresponding GeoLocation
const spiData = d3.csv(csvData,function (data) {
  console.log(data)
  return data;
});

// loop, map, or build a reducer to set the SPI data for Name = spitData.Country
const getSPI = (Name, spiData) => {
  console.log(Name);
  console.log(spiData);
  // spiData.map(Name => {
  //   if(Name===spiData.Country) {
  //     console.log(spiData.Country)
  //     return spiData.Country.SPI;
  //   }
  //   else return 'SPI not found';
  // })
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
                onMouseEnter={() => {
                    const { NAME, POP_EST } = geo.properties;
                    //Link cvsData to geo.property so the mouseover event sets the data from our cvsData instead of geo.
                    const SPI = getSPI(NAME, spiData);
                    console.log(SPI);

                    setTooltipContent(`${NAME} — ${rounded(POP_EST)}, SPI ${SPI}`);
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

export default memo(MapChart);
