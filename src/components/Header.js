import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import {
  colorScale,
  // basicColorScale,
  // foundationsColorScale,
  // opportunityColorScale
} from '../services/SocialProgress';

const Header = ({ width, height, selectYears, yearValue, selectCountries, handleSubmit }) => {

  //check height vs width first to keep things squared

  let legendRef = useRef(null);
  // let legendPetals = useRef(null);
  let controlBarHeight = height / 10;
  let quarterWidth = (width / 4);
  let squareSize = (width / 3 ) / 12 ;
  let radiusScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, (controlBarHeight/2)]);


  
  useEffect(() => {
    
    // let petalPath = 'M 0 0 c 100 100 80 0 100 0 C 80 0 100 -100 0 0';

    let legendData = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

    // let categoryCircles = ["Foundations of Wellbeing", "Opportunity", "Basic Needs"];

    function ready() {

      var svg = d3.select(legendRef.current)

      svg
        .selectAll("rect")
        .data(legendData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => {
          return 0 + (i * squareSize)
        })
        .attr("y", 0)
        .attr("height", squareSize)
        .attr("width", squareSize)
        .style("fill", d => colorScale(d))
        .join('text')
        .append('title')
        .text(d=> d)

      // var svgPetals = d3.select(legendPetals.current)
      //   .attr("preserveAspectRatio", "xMinYMin meet")
      //   .attr("id", "viewbox")
      //   .attr("viewBox", [0, 0, quarterWidth, controlBarHeight])

      // var circles = svgPetals
      //   .selectAll("circle")
      //   .data(categoryCircles)

      // circles
      //   .join("circle")
      //   .attr("cx", (d, i) => {
      //     return width / 18 + (i * (width / 9)) 
      //   })
      //   .attr("cy", controlBarHeight / 2)
      //   .attr("r", controlBarHeight / 2)
      //   .style('fill', basicColorScale(0));

      // let text = circles
      //   .join('text')
      //   .attr('class', 'title')
      //   .attr('text-anchor', 'middle')
      //   .attr('alignment-baseline', 'ideographic')
      //   .style("font-size", "50%")
      //   .attr("x", (d, i) => {
      //     return width / 18 + (i * (width / 9)) 
      //   })
      //   .attr("y", controlBarHeight)
      //   .text(d => { return d; });
      // text.exit().remove();

      // svgPetals
      //   .selectAll('.petalLegend')
      //   .data(categoryCircles)
      //   .join('path')
      //   .attr('class', 'petalLegend')
      //   .attr('d', d => petalPath)
      //   .attr('transform',
      //     (d, i) => {
      //       let angle;
      //       if (d === "Basic Needs") {
      //         angle = 30;
      //       }
      //       if (d === "Opportunity") {
      //         angle = 270;
      //       }
      //       if (d === "Foundations of Wellbeing") {
      //         angle = 150;
      //       }
      //       return `translate(${width / 18+ (i * (width / 9))}, ${controlBarHeight / 2}) rotate(${angle}) scale(${radiusScale(1)})`
      //     })
      //   .style('stroke', 'black')
      //   .style('fill', d => {
      //     if (d === " ") {
      //       return basicColorScale(0)
      //     }
      //     if (d === "Basic Needs") {
      //       return basicColorScale(75)
      //     }
      //     if (d === "Opportunity") {
      //       return opportunityColorScale(75)
      //     }
      //     if (d === "Foundations of Wellbeing") {
      //       return foundationsColorScale(75)
      //     }
      //   });


    }


    ready();

  }, [width, height, controlBarHeight, quarterWidth, squareSize, radiusScale])

    // Get the modal
var modal = document.getElementById("myModal");

// When the user clicks on the button, open the modal

// function openButton()  {
//   console.log('Definitions Clicked');
//   // modal.style.display = "block";
// }

// When the user clicks on <span> (x), close the modal
// function closeButton() {
//   modal.style.display = "none";
// }

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
}

  return (
    <>
      <svg ref={legendRef} id={"legend"} className={'legend'} height={squareSize} width={width / 3}></svg>


      {/* <button id="myBtn" onClick={openButton}>Definitions</button> */}

      {/* <div id="myModal" className="modal" display="none">
        <div className="modal-content" display="none">
          <span className="closeButton" onClick={closeButton}>&times;</span>
          <p>Definitions</p>
        </div>
      </div> */}


      {/* <svg ref={legendPetals} id={"legendPetals"} className={'legend'} height={controlBarHeight} width={width / 3}></svg> */}

      <form onSubmit={handleSubmit}>
        <label id="years" value={yearValue} >Year </label>
        {selectYears}
        {/* {selectCountries} */}
      </form>
    </>
  );
};

Header.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  selectYears: PropTypes.object,
  yearValue: PropTypes.string,
  handleSubmit: PropTypes.func
};

export default Header;
