import React, { useLayoutEffect } from 'react';
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

import { dataKeys, componentQuestionMatch } from '../services/SocialProgress';

function ModalDefinitions({ modalRef, spiByCountry, defContext, parsedDefinitions, setClickedCallback, setClickedSubCat }) {

  // function componentQuestionMatch(d) {
  //   switch (d[0]) {
  //     case "Nutrition and Basic Medical Care": return 'Do people have enough food to eat and are they receiving basic medical care? ';
  //     case "Water and Sanitation": return 'Can people drink water and keep themselves clean without getting sick?';
  //     case "Shelter": return 'Do people have adequate housing with basic utilities?';
  //     case "Personal Safety": return 'Do people feel safe?';

  //     case "Access to Basic Knowledge": return 'Do people have access to an educational foundation?';
  //     case "Access to Information and Communications": return 'Can people freely access ideas and in formation from anywhere in the world?';
  //     case "Health and Wellness": return 'Do people live long and healthy lives?';
  //     case "Environmental Quality": return 'Is this society using its resources so they will be available for future generations?';

  //     case "Personal Rights": return 'Are people’s rights as individuals protected?';
  //     case "Personal Freedom and Choice": return 'Are people free to make their own life choices?';
  //     case "Inclusiveness": return 'Is no one excluded from the opportunity to be a contributing member of society?';
  //     case "Access to Advanced Education": return 'Do people have access to the world’s most advanced knowledge?';

  //     default: return '';
  //   };
  // };

  
  useLayoutEffect(() => {
    if(!spiByCountry) return;

    let BasicImageArray = [basic_nutrition, basic_water, basic_shelter, basic_safety];
    let FoundationImageArray = [foundations_knowledge, foundations_communication, foundations_health, foundations_environmental];
    let OpportunityImageArray = [opportunity_rights, opportunity_freedom, opportunity_inclusiveness, opportunity_education];

    function tabulateModal(spiData) {

      // Group data on each column, indicator will hold the unique values.
      let cleanDef = parsedDefinitions.filter(function (element) {
        return element["dimension"] !== undefined;
      });
      let groupedData = d3.group(cleanDef, d => d["dimension"], d => d["component"], d => d['indicator_name'])

      function keyMatcher(target) {
        const dataKeysArray = Object.values(dataKeys);
        const targetFixer = (target) => target.replace(/and/, '&').trim().toLowerCase();
      
        for (let i = 0; i < dataKeysArray.length; i++) {
          const key = dataKeysArray[i];
          const keyFixer = (key) => key.replace(/[\n\r]*\((.*)\)[ \n\r]*/g, '').replace(/and/, '&').trim().toLowerCase();
          if (keyFixer(key) === targetFixer(target)) {
            return Object.keys(dataKeys)[i];
          }
        }
        return null;
      }

      let modal = d3.select(modalRef.current);
      modal.selectAll('.modal').remove();
      let dimDiv = modal.append('div').attr('class', 'modal');

      let dimensionsDiv = dimDiv.selectAll('.dimension')
        .data(groupedData, d => d[0])
        .join(
          enter => enter
            .append("div")
            .attr("class", (d, i) => { return `dim-${i} dimension`; })
            .attr("id", d => {
              if (!d[0]) {
                return "remove";
              }
              //class and ID to isolate footer
              let id = (d[0]).replace(/ /g, "_");
              return id;
            }));

      //Dimensions Title Bar
      let divTitle = dimensionsDiv.append('div').attr("id", d => {
        if (!d[0]) {
          return "footer";
        }
        // //class and ID to isolate footer
        let id = (d[0]).replace(/ /g, "_");
        return `${id}_title`;
      }).attr('class', 'dimension-title').on('click', addComponents);
      //indicator icon 
      divTitle.append("h3").text('+').attr("class", "dimension_icon");
      //images
      divTitle.append("img").attr("src", (d, i) => {
        switch (i) {
          case 0: return basic_needs;
          case 1: return foundations;
          case 2: return opportunity;
          default: return;
        }
      }).attr('class', 'dimension_img');

      divTitle.append('h4').text(d => {
        let target = d[0]
        d[0] === '' ? target = '*' : target = d[0];
        if (target === "*" || undefined) {
          return "GDP is Not Destiny";
        } else {
          let value = +spiData[0][`${keyMatcher(target)}`];
          let score = value ? value.toFixed() : "N/A";
          let result = `${d[0]}:  ${score}`;
          return result;
        }
      });

      // Components
      function addComponents(event, d) {
        d3.selectAll('.component-box').remove();
        d3.selectAll('.dimension_icon').text('+');
        d3.selectAll('.dimension-title').on('click', addComponents);
        setClickedCallback(d[0]);
        d3.select(this).on('click', collapseDimension);
        d3.select(this).select('.dimension_icon').text('-');
        let component = d3.select(this.parentNode)
          .append('div').attr('class', 'component-box')
          .selectAll('.component')
          .data(d[1])
          .join(
            enter => enter.append('div').attr("class", "component").attr("id", d => {
              let parsedId = d[0].replace(/ /g, "_");
              return parsedId;
            }),
            exit => exit.remove()
          );
        d3.select(this).each(() => d3.select(this).exit());
        //Title Bar
        let componentTitle = component.append('div').attr("id", d => {
          let parsedId = d[0].replace(/ /g, "_");
          return `${parsedId}_title`;
        }).attr('class', 'component-title').on('click', addIndicators);

        //Append Icons 
        componentTitle.append("img").attr("src", (d, i) => {
          let target = this.parentNode.id;
          switch (target) {
            case "Basic_Human_Needs": return BasicImageArray[i];
            case "Foundations_of_Wellbeing": return FoundationImageArray[i];
            case "Opportunity": return OpportunityImageArray[i];
            default: return;
          }
        }).attr('class', 'component_img');

        //Component Control
        componentTitle.append("h3").text('+').attr("class", "component_icon");

        //Title and Score 
        componentTitle.append('h4').text(d => {
          let target = d[0];
          let value = +spiData[0][`${keyMatcher(target)}`];
          let score = value ? value.toFixed() : "N/A";
          let result = `${d[0]}:  ${score}`;
          return result;
        });
        componentTitle.append('p').text(d => {
          let result = componentQuestionMatch(d);
          return result;
        })
        d3.select(this).exit().remove();
      };

      function collapseDimension() {
        d3.select(this).select('.dimension_icon').text('+');
        d3.select(this).on('click', addComponents);
        d3.selectAll('.component-box').remove();
      }

      function addIndicators(event, d) {
        d3.selectAll('.indicator-box').remove();
        d3.selectAll('.component_icon').text('+');
        d3.selectAll('.component-title').on('click', addIndicators);
        d3.select(this).on('click', collapseComponent);
        d3.select(this).select('.component_icon').text('-');
        setClickedSubCat(d[0]);
        let indicator = d3.select(this.parentNode).append('ul')
          .attr('class', 'indicator-box')
          .selectAll('.indicator')
          .data(d[1])
          .join(
            enter => enter.append("li")
              .attr("class", "indicator")
              .attr("id", d => d[0]),
            exit => exit.remove()
          ).on('click', expandIndicators);
        //name
        indicator.append('tspan')
          .text(d => {
            return d[0];
          }).attr('class', 'indicator-name');

        //score
        indicator.append('tspan')
          .text((d, i) => {
            let target = d[0];
            let match = spiData[0][`${keyMatcher(target)}`]
            if (!match) return "N/A";
            // //round the match value
            let rounded = (+match).toFixed(3);
            let result = `(${rounded})`;
            return result;
          }).style('font-weight', 600).attr('class', 'indicator-score');
        //substrings

        indicator.append('tspan')
          .text(d => {
            if (!d[1]) return;
            let match = d[1][0]['unit_of_measurement'];
            let subString = match ? match : null;
            return `    ${subString}`;
          }).attr('class', 'indicator-substring')


      }
      function collapseComponent() {
        d3.select(this).select('.component_img').text('+');
        d3.select(this).select('.component_img').style('background-color', 'transparent');;
        d3.select(this).on('click', addIndicators);
        d3.selectAll('.indicator-box').remove();
      }

      function expandIndicators(event, d) {
        d3.selectAll('.indicator-definitions').remove();
        d3.selectAll('.indicator').style("list-style-type", "disclosure-closed");
        d3.selectAll('.indicator').on('click', expandIndicators);
        d3.select(this).on('click', collapseIndicator)
        d3.select(this).style("list-style-type", "disclosure-open");
        let indicator = d3.select(this)
          .append('div')
          .attr('class', 'indicator-definitions');
        indicator.append('p')
          .text(d => {
            return d[1][0]['definition']
          })
          .attr("class", "indicator-definition");
        // ******************************************** Check for Multiple Links **********
        indicator
          .selectAll('.citation')
          .data(d[1][0].citations)
          .join(enter => {
            return enter.append('a')
              .attr('class', 'citation')
              .attr("href", d => {
                return d.citation[0];
              })
              .text(d => {
                let result = d.citation[1] ? d.citation[1] : d.citation[0];
                return `${result}\n`
              })
              .attr("class", "indicator-link")
              .attr("target", "_blank")
              .attr("rel", "noopener noreferrer");
          });
      }

      function collapseIndicator() {
        d3.select(this).style("list-style-type", "disclosure-closed");
        d3.select(this).on('click', expandIndicators);
        d3.selectAll('.indicator-definitions').remove();
      }

      if (defContext.dimension) {
        d3.select(`#${defContext.dimension}_title`).dispatch('click');
      }

      if (defContext.component && d3.select(`#${defContext.component}_title`)) {
        d3.select(`#${defContext.component}_title`).dispatch('click');
      }

      d3.selectAll('#remove').remove();
    };

    tabulateModal(spiByCountry);

  }, [modalRef, spiByCountry, defContext, parsedDefinitions, setClickedCallback, setClickedSubCat]);

  return (
    <div className="modal-wrapper" ref={modalRef} >
    </div>
  );

};

export default ModalDefinitions;