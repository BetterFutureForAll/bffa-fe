import React, { useEffect } from 'react';
import * as d3 from 'd3';

import basic_needs from '../assets/bffa_icons/0_0_basic.png';
import basic_nutrition from '../assets/bffa_icons/0_1_nutrition.png';
import basic_water from '../assets/bffa_icons/0_2_water.png';
import basic_shelter from '../assets/bffa_icons/0_3_shelter.png';
import basic_safety from '../assets/bffa_icons/0_4_safety.png';

import foundations from '../assets/bffa_icons/1_0_foundations.png';
import foundations_knowledge from '../assets/bffa_icons/1_1_knowledge.png';
import foundations_communication from '../assets/bffa_icons/1_2_communications.png';
import foundations_health from '../assets/bffa_icons/1_3_health.png';
import foundations_environmental from '../assets/bffa_icons/1_4_environmental.png';

import opportunity from '../assets/bffa_icons/2_0_opportunity.png';
import opportunity_rights from '../assets/bffa_icons/2_1_rights.png';
import opportunity_freedom from '../assets/bffa_icons/2_2_freedom.png';
import opportunity_inclusiveness from '../assets/bffa_icons/2_3_inclusiveness.png';
import opportunity_education from '../assets/bffa_icons/2_4_education.png';


function ModalDefinitions({ countryValue, clicked, clickedSubCat, toggleModal, modalRef }) {

  let rawDefinitions = require('../assets/GlobalDefinitions.csv');

  // let clickedBasic;
  // let clickedFoundation;
  // let clickedOpportunity;

  let parsedDefinitions = d3.csv(rawDefinitions);

  let linkRef = <a href={"https://www.socialprogress.org/index/global/definitions#0/0/0"}>ⓘ</a>;


  function tabulateModal(data) {
    // Dimension,Component,Indicator name,Definition,Source,Link
    // let columnHeaders = data.columns.slice(0);

    // Group data on each column
    let groupedData = d3.group(data, d => d["Dimension"], d => d["Component"], d => d['Indicator name'])

    console.log('grouped', groupedData);

    let modal = d3.select(modalRef.current);
    let dimDiv = modal.append('div').attr('class', 'modal')

    let dimensionsDiv = dimDiv.selectAll('.dimension')
      .data(groupedData, d => d[0])
      .join("div")
      .attr("class", "dimension")
      .attr("id", d => {
        if (d[0].length === 0) {
          return "footer";
        }
        return d[0]
      });

    dimensionsDiv
      .each((d, i, event) => {
        d3.select(event[i])
          .append('h2')
          .text(d => {
            console.log('h2', d);
            return d[0]
          })
      })

    let componentDiv = dimensionsDiv
      .each((d, i, event) => {
        d3.select(event[i])
          .selectAll('.component')
          .data(d[1])
          .join("div")
          .attr("class", "component")
          .attr("id", d => d[0])
      });
      

    let indicatorDiv =
      d3.selectAll('.component')
        .each((d, i, event) => {
          d3.select(event[i])
            .selectAll('.indicator')
            .data(d[1])
            .join("div")
            .attr("class", "indicator")
            .attr("id", d => {
              return d[0]
            })
        })

    let indicatorDefinitions =
      d3.selectAll('.indicator')
        .each((d, i, event) => {
          // console.log("event", event[i]);
          // console.log("d", d);
          // console.log("d1", d[1][0]);
          d3.select(event[i])
            .selectAll('.definitions')
            .data([d[1][0]])
            .join("p")
            .attr("class", "definitions")
            .text(d => {
              return d['Indicator name']
            })
        })

  }

  useEffect(() => {
    parsedDefinitions.then((data) => {
      tabulateModal(data);
      console.log(data);
    })

  }, [parsedDefinitions]);

  return (
    <div className="modal-wrapper" ref={modalRef} >
      <div className="button">
        <button type="button"
          className="modal-close-button"
          onClick={toggleModal}>
          X
        </button>
      </div>
    </div>
  );

  // return (
  //   <div className="modal-wrapper" >
  //     <div className="button">
  //       <button type="button"
  //         className="modal-close-button"
  //         onClick={toggleModal}>
  //         X
  //       </button>
  //     </div>
  //     <div className="modal">
  //       <div className={"dimension"} id={"basics_div"}>
  //         <img className={"dimension_img"} alt='basics logo' src={basic_needs} ></img>
  //         <h2>Basic Human Needs</h2>
  //         <div className={"component"} id="Nutrition and Basic Medical Care">
  //           <img className={"component_img"} alt='nutrition logo' src={basic_nutrition} ></img>
  //           <h3>Nutrition & Basic Medical Care</h3>
  //           <p>Do people have enough food to eat and are they receiving basic medical care? {linkRef}</p>
  //           <div className="indicator-box" id="Nutrition and Basic Medical Care">
  //           </div>
  //         </div>
  //         <div className={"component"} id="Water and Sanitation">
  //           <img className={"component_img"} alt='water logo' src={basic_water} ></img>
  //           <h3>Water & Sanitation</h3>
  //           <p>Can people drink water and keep themselves clean without getting sick? {linkRef}</p>
  //           <div className="indicator-box" id="Water and Sanitation">
  //           </div>
  //         </div>
  //         <div className={"component"} id="Shelter">
  //           <img className={"component_img"} alt='shelter logo' src={basic_shelter} ></img>
  //           <h3>Shelter</h3>
  //           <p>Do people have adequate housing with basic utilities? {linkRef}</p>
  //           <div className="indicator-box" id="Shelter">
  //           </div>
  //         </div>
  //         <div className={"component"} id="Personal Safety">
  //           <img className={"component_img"} alt='safety logo' src={basic_safety} ></img>
  //           <h3>Personal Safety</h3>
  //           <p>Do people feel safe? {linkRef}</p>
  //           <div className="indicator-box" id="Personal Safety">
  //           </div>
  //         </div>

  //       </div>
  //       <div className={"dimension"} id={"foundations_div"}>
  //         <img className={"dimension_img"} alt='foundations logo' src={foundations} ></img>
  //         <h2>Foundations of Well Being</h2>
  //         <div className={"component"} id="Access to Basic Knowledge">
  //           <img className={"component_img"} alt='knowledge logo' src={foundations_knowledge} ></img>
  //           <h3>Access to Basic Knowledge</h3>
  //           <p>Do people have access to an educational foundation? {linkRef}</p>
  //           <div className="indicator-box" id="Access to Basic Knowledge">
  //           </div>
  //         </div>
  //         <div className={"component"} id="Access to Information and Communications">
  //           <img className={"component_img"} alt='communication logo' src={foundations_communication} ></img>
  //           <h3>Access to Information and Communications</h3>
  //           <p>Can people freely access ideas and in formation from anywhere in the world? {linkRef}</p>
  //           <div className="indicator-box" id="Access to Information and Communications">
  //           </div>
  //         </div>
  //         <div className={"component"} id="Health and Wellness">
  //           <img className={"component_img"} alt='health logo' src={foundations_health} ></img>
  //           <h3>Health & Wellness</h3>
  //           <p>Do people live long and healthy lives? {linkRef}</p>
  //           <div className="indicator-box" id="Health and Wellness">
  //           </div>
  //         </div>
  //         <div className={"component"} id="Environmental Quality">
  //           <img className={"component_img"} alt='environmental logo' src={foundations_environmental} ></img>
  //           <h3>Environmental Quality</h3>
  //           <p>Is this society using its resources so they will be available for future generations? {linkRef}</p>
  //           <div className="indicator-box" id="Environmental Quality">
  //           </div>
  //         </div>
  //       </div>
  //       <div className={"dimension"} id={"opportunity_div"}>
  //         <img className={"dimension_img"} alt='opportunity logo' src={opportunity} ></img>
  //         <h2>Opportunity for Success</h2>
  //         <div className={"component"} id="Personal Rights">
  //           <img className={"component_img"} alt='rights logo' src={opportunity_rights} ></img>
  //           <h3>Personal Rights</h3>
  //           <p>Are people’s rights as individuals protected? {linkRef}</p>
  //           <div className="indicator-box" id="Personal Rights">
  //           </div>
  //         </div>
  //         <div className={"component"} id="Personal Freedom and Choice">
  //           <img className={"component_img"} alt='freedom logo' src={opportunity_freedom} ></img>
  //           <h3>Personal Freedom & Choice</h3>
  //           <p>Are people free to make their own life choices? {linkRef}</p>
  //           <div className="indicator-box" id="Personal Freedom and Choice">
  //           </div>
  //         </div>
  //         <div className={"component"} id="Inclusiveness">
  //           <img className={"component_img"} alt='inclusiveness logo' src={opportunity_inclusiveness} ></img>
  //           <h3>Inclusiveness</h3>
  //           <p>Is no one excluded from the opportunity to be a contributing member of society? {linkRef}</p>
  //           <div className="indicator-box" id="Inclusiveness">
  //           </div>
  //         </div>
  //         <div className={"component"} id="Access to Advanced Education">
  //           <img className={"component_img"} alt='education logo' src={opportunity_education} ></img>
  //           <h3>Access to Advanced Education</h3>
  //           <p>Do people have access to the world’s most advanced knowledge? {linkRef}</p>
  //           <div className="indicator-box" id="Access to Advanced Education">
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default ModalDefinitions;