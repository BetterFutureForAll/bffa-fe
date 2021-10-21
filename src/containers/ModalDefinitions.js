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


function ModalDefinitions({ countryValue, clicked, clickedSubCat, toggleModal }) {

  let rawDefinitions = require('../assets/GlobalDefinitions.csv');

  let clickedBasic;
  let clickedFoundation;
  let clickedOpportunity;

  let parsedDefinitions = d3.csv(rawDefinitions);

  let linkRef = <a href={"https://www.socialprogress.org/index/global/definitions#0/0/0"}>ⓘ</a>;


  // function tabulateModal(data) {
  //   // Dimension,Component,Indicator name,Definition,Source,Link
  //   const subgroups = data.columns.slice(1);

  //   console.log('subGroups:', subgroups);
  //   // assign keys
  //   let dimensionGroups = d3.group(data, d => d["Dimension"]);

  //   let componentGroup = d3.group(data, d=> d['Component']);
  //   let indicatorGroup = d3.group(data, d=> d['Indicator name']);
  //   let definitionGroup = d3.group(data, d=> d['Definition']);

  //   let basicNeedsData = dimensionGroups.get("Basic Human Needs");
  //   let foundationsData = dimensionGroups.get("Foundations of Wellbeing");
  //   let opportunityData = dimensionGroups.get("Opportunity");
  //   let nutrition = dimensionGroups.get("Nutrition and Basic Medical Care")

  // let dimensions = [];
  // data.forEach((element) => {
  //   if(element['Dimension']) {
  //     if(!dimensions.includes(element['Dimension'])) {
  //       dimensions.push(element['Dimension']);
  //     }
  //   }
  // });

  // console.log('dimensions:', dimensions);

  // d3.selectAll('.dimension')
  //   .data(dimensions)
  //   //enter update exit
  //   .join("div")
  //   .attr("class", "dimension")
  //   .attr("id", d => d)
  //   .append("img")
  //     .attr("src", d => {
  //       console.log('src Datum',d);
  //       if(d==="Basic Human Needs") { return basic_needs }
  //       if(d==="Foundations of Wellbeing") { return foundations }
  //       if(d==="Opportunity") { return opportunity }
  //     });

  // }


  // let basicDiv = modal
  // .data(basicNeedsData)
  // .join('div')
  // .attr('class', 'indicator')
  // .attr('id', d => d['Indicator name'])
  // .text(d=> d['Indicator name'])

  // let foundationDiv = modal
  // .data(foundationsData)
  // .join('div')
  // .attr('class', 'indicator')
  // .attr('id', d => d['Indicator name'])
  // .text(d=> d['Indicator name'])

  // let opportunityDiv = modal
  // .data(opportunityData)
  // .join('div')
  // .attr('class', 'indicator')
  // .attr('id', d => d["Indicator name"])
  // .text(d => d["Indicator name"])


  useEffect(() => {
    parsedDefinitions.then((data) => {
      // tabulateModal(data);
      console.log("parsedDefinitions", data);
    })

  }, [parsedDefinitions]);

  // return (
  //   <>
  //     <div className={"dimension"}></div>
  //   </>
  // );

  return (
    <div className="modal-wrapper" >
        <div className="button">
          <button type="button"
            className="modal-close-button"
            onClick={toggleModal}>
            X
          </button>
        </div>
      <div className="modal">
        <div className={"dimension"} id={"basics_div"}>
          <img className={"dimension_img"} alt='basics logo' src={basic_needs} ></img>
          <h2>Basic Human Needs</h2>
          <div className={"category"}>
            <img className={"category_img"} alt='nutrition logo' src={basic_nutrition} ></img>
            <div className="textField">
              <h3>Nutrition & Basic Medical Care</h3>
              <p>Do people have enough food to eat and are they receiving basic medical care? {linkRef}</p>
            </div>
            <div className="indicator">
            </div>
          </div>
          <div className={"category"}>
            <img className={"category_img"} alt='water logo' src={basic_water} ></img>
            <div className="textField">
              <h3>Water & Sanitation</h3>
              <p>Can people drink water and keep themselves clean without getting sick? {linkRef}</p>
            </div>
          </div>
          <div className={"category"}>
            <img className={"category_img"} alt='shelter logo' src={basic_shelter} ></img>
            <div className="textField">
              <h3>Shelter</h3>
              <p>Do people have adequate housing with basic utilities? {linkRef}</p>
            </div>
          </div>
          <div className={"category"}>
            <img className={"category_img"} alt='safety logo' src={basic_safety} ></img>
            <div className="textField">
              <h3>Personal Safety</h3>
              <p>Do people feel safe? {linkRef}</p>
            </div>
          </div>

        </div>
        <div className={"dimension"} id={"foundations_div"}>
          <img className={"dimension_img"} alt='foundations logo' src={foundations} ></img>
          <h2>Foundations of Well Being</h2>
          <div className={"category"}>
            <img className={"category_img"} alt='knowledge logo' src={foundations_knowledge} ></img>
            <div className="textField">
              <h3>Access to Basic Knowledge</h3>
              <p>Do people have access to an educational foundation? {linkRef}</p>
            </div>
          </div>
          <div className={"category"}>
            <img className={"category_img"} alt='communication logo' src={foundations_communication} ></img>
            <div className="textField">
              <h3>Access to Information and Communications</h3>
              <p>Can people freely access ideas and in formation from anywhere in the world? {linkRef}</p>
            </div>
          </div>
          <div className={"category"}>
            <img className={"category_img"} alt='health logo' src={foundations_health} ></img>
            <div className="textField">
              <h3>Health & Wellness</h3>
              <p>Do people live long and healthy lives? {linkRef}</p>
            </div>
          </div>
          <div className={"category"}>
            <img className={"category_img"} alt='environmental logo' src={foundations_environmental} ></img>
            <div className="textField">
              <h3>Environmental Quality</h3>
              <p>Is this society using its resources so they will be available for future generations? {linkRef}</p>
            </div>
          </div>
        </div>
        <div className={"dimension"} id={"opportunity_div"}>
          <img className={"dimension_img"} alt='opportunity logo' src={opportunity} ></img>
          <h2>Opportunity for Success</h2>
          <div className={"category"}>
            <img className={"category_img"} alt='rights logo' src={opportunity_rights} ></img>
            <div className="textField">
              <h3>Personal Rights</h3>
              <p>Are people’s rights as individuals protected? {linkRef}</p>
            </div>
          </div>
          <div className={"category"}>
            <img className={"category_img"} alt='freedom logo' src={opportunity_freedom} ></img>
            <div className="textField">
              <h3>Personal Freedom & Choice</h3>
              <p>Are people free to make their own life choices? {linkRef}</p>
            </div>
          </div>
          <div className={"category"}>
            <img className={"category_img"} alt='inclusiveness logo' src={opportunity_inclusiveness} ></img>
            <div className="textField">
              <h3>Inclusiveness</h3>
              <p>Is no one excluded from the opportunity to be a contributing member of society? {linkRef}</p>
            </div>
          </div>
          <div className={"category"}>
            <img className={"category_img"} alt='education logo' src={opportunity_education} ></img>
            <div className="textField">
              <h3>Access to Advanced Education</h3>
              <p>Do people have access to the world’s most advanced knowledge? {linkRef}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default ModalDefinitions;