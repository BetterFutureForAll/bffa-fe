import React, { useRef, useState, useEffect } from 'react';
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


function ModalDefinitions({ countryValue, clicked, clickedSubCat }) {

  let rawDefinitions = require('../assets/GlobalDefinitions.csv');

  let clickedBasic;
  let clickedFoundation;
  let clickedOpportunity;

  let parsedDefinitions = d3.csv(rawDefinitions);

  let dimensionGroups = parsedDefinitions.then(result => d3.group(result, d => d["Dimension"], d => d.Component));
  let basicGroup = dimensionGroups.get(["Basic Human Needs"]);

  useEffect(() => {
    if (clicked) {
      clickedBasic = clicked['Basic Human Needs'];
      clickedFoundation = clicked['Foundations of Wellbeing'];
      clickedOpportunity = clicked['Opportunity'];
    }
    console.log('modal clicked :', clicked)
    console.log("basicGroup: ", basicGroup);
    parsedDefinitions.then((result)=>{
      console.log("parsedDefinitions", result);
    })
  }, [clicked]);

  let lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  return (
    <>
      <div className={"dimension"} id={"basics_div"}>
        <img className={"dimension_img"} alt='basics logo' src={basic_needs} ></img>
        <h2>Basic Human Needs</h2>
        <div className={"category"}>
          <img className={"category_img"} alt='nutrition logo' src={basic_nutrition} ></img>
          <p>{lorem}</p>
        </div>
        <div className={"category"}>
          <img className={"category_img"} alt='water logo' src={basic_water} ></img>
          <p>{lorem}</p>
        </div>
        <div className={"category"}>
          <img className={"category_img"} alt='shelter logo' src={basic_shelter} ></img>
          <p>{lorem}</p>
        </div>
        <div className={"category"}>
          <img className={"category_img"} alt='safety logo' src={basic_safety} ></img>
          <p>{lorem}</p>
        </div>

      </div>
      <div className={"dimension"} id={"foundations_div"}>
        <img className={"dimension_img"} alt='foundations logo' src={foundations} ></img>
        <h2>Foundations of Well Being</h2>
        <div className={"category"}>
          <img className={"category_img"} alt='knowledge logo' src={foundations_knowledge} ></img>
          <p>{lorem}</p>
        </div>
        <div className={"category"}>
          <img className={"category_img"} alt='communication logo' src={foundations_communication} ></img>
          <p>{lorem}</p>
        </div>
        <div className={"category"}>
          <img className={"category_img"} alt='health logo' src={foundations_health} ></img>
          <p>{lorem}</p>
        </div>
        <div className={"category"}>
          <img className={"category_img"} alt='environmental logo' src={foundations_environmental} ></img>
          <p>{lorem}</p>
        </div>
      </div>
      <div className={"dimension"} id={"opportunity_div"}>
        <img className={"dimension_img"} alt='opportunity logo' src={opportunity} ></img>
        <h2>Opportunity for Success</h2>
        <div className={"category"}>
          <img className={"category_img"} alt='rights logo' src={opportunity_rights} ></img>
          <p>{lorem}</p>
        </div>
        <div className={"category"}>
          <img className={"category_img"} alt='freedom logo' src={opportunity_freedom} ></img>
          <p>{lorem}</p>
        </div>
        <div className={"category"}>
          <img className={"category_img"} alt='inclusiveness logo' src={opportunity_inclusiveness} ></img>
          <p>{lorem}</p>
        </div>
        <div className={"category"}>
          <img className={"category_img"} alt='education logo' src={opportunity_education} ></img>
          <p>{lorem}</p>
        </div>
      </div>

    </>
  );

};

export default ModalDefinitions;