import React, { useEffect } from 'react';
import * as d3 from 'd3';

import logo from '../assets/bffa_icons/BFFA_Logo.png'
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

function ModalDefinitions({ toggleModal, modalRef, spiData, defContext }) {

  let currentDefinitions = require('../assets/definitions-2021.csv');
  let parsedDefinitions = d3.csv(currentDefinitions, function (data) {
    //re-key the parsedDefinitions if needed
    return data;
  })

  useEffect(() => {
    function tabulateModal(data) {
      // Dimension,Component,Indicator name, unit ,Definition,Source,Link
      // Group data on each column, indicator will hold the unique values.
      let groupedData = d3.group(data, d => d["Dimension"], d => d["Component"], d => d['Indicator name'])

      let modal = d3.select(modalRef.current);
      modal.selectAll('.modal').remove();
      let dimDiv = modal.append('div').attr('class', 'modal');

      let dimensionsDiv = dimDiv.selectAll('.dimension')
        .data(groupedData, d => d[0])
        .join(div => {
          let imgImport = (d) => {
            switch (d[0]) {
              case "Basic Human Needs": return basic_needs;
              case "Foundations of Wellbeing": return foundations;
              case "Opportunity": return opportunity;
              default: return logo;
            };
          };
          let enter = div.append("div");
          //class and ID to isolate footer
          enter
            .attr("class", (d, i) => { return `dim-${i} dimension`; })
            // Clean Whitespace or find unique ID that is a valid D3.selection
            .attr("id", d => {
              if (d[0].length === 0) {
                return "footer";
              }
              let id = (d[0]).replace(/ /g, "_");
              return id;
            });
          let divTitle = enter.append('div').attr('class', 'dimension-title')
          divTitle.append("img").attr('src', d => imgImport(d)).attr("class", "dimension_img");
          divTitle.append('h3').text(d => {
            let target = d[0]
            d[0] === '' ? target = '*' : target = d[0];
            if (target === "*" || undefined) {
              return "*";
            } else {
              let value = +spiData[0][`${target}`];
              let result = `${d[0]}:  ${value.toFixed()}`;
              return result;
            }
          });
          // dimDiv.style("list-style-type", "disclosure-closed");
          dimDiv.exit().remove();
          return enter;
        },
          //exit statement may need to be fixed to help stop duplication of elements
          exit => exit.remove());



      // Component Div
      dimensionsDiv
        .each((d, i, event) => {
          d3.select(event[i])
            .append('div')
            .attr('class', 'component-box')
            .selectAll('.component')
            .data(d[1])
            .join(div => {
              //append each individual component, and clean the whitespace for ID's
              let enter = div.append('div').attr("class", "component").attr("id", d => {
                let parsedId = d[0].replace(/ /g, "_");
                return parsedId;
              })
              let componentImgImport = (d) => {
                switch (d[0]) {
                  case "Nutrition and Basic Medical Care": return [basic_nutrition, 'Do people have enough food to eat and are they receiving basic medical care? '];
                  case "Water and Sanitation": return [basic_water, 'Can people drink water and keep themselves clean without getting sick?'];
                  case "Shelter": return [basic_shelter, 'Do people have adequate housing with basic utilities?'];
                  case "Personal Safety": return [basic_safety, 'Do people feel safe?'];

                  case "Access to Basic Knowledge": return [foundations_knowledge, 'Do people have access to an educational foundation?'];
                  case "Access to Information and Communications": return [foundations_communication, 'Can people freely access ideas and in formation from anywhere in the world?'];
                  case "Health and Wellness": return [foundations_health, 'Do people live long and healthy lives?'];
                  case "Environmental Quality": return [foundations_environmental, 'Is this society using its resources so they will be available for future generations?'];

                  case "Personal Rights": return [opportunity_rights, 'Are people’s rights as individuals protected?'];
                  case "Personal Freedom and Choice": return [opportunity_freedom, 'Are people free to make their own life choices?'];
                  case "Inclusiveness": return [opportunity_inclusiveness, 'Is no one excluded from the opportunity to be a contributing member of society?'];
                  case "Access to Advanced Education": return [opportunity_education, 'Do people have access to the world’s most advanced knowledge?'];

                  default: return [null, ''];
                };
              };

              let componentTitle = enter.append('div').attr('class', 'component-title')

              componentTitle.append("img")
                .attr('src', d => {
                  let result = componentImgImport(d);
                  return result[0]
                })
                .attr("class", "component_img");

              componentTitle.append('h3').text(d => {
                //Rounded Number
                let target = d[0];
                let value = +spiData[0][`${target}`];
                let result = `${d[0]}:  ${value.toFixed()}`;
                return result;
              });

              componentTitle.append('p').text(d => {
                let result = componentImgImport(d);
                return result[1];
              })
                .style('fill', 'Orange');

            })
        });


      let indicatorDiv =
        d3.selectAll('.component')
          .each((d, i, event) => {
            d3.select(event[i])
              .append('ul')
              .attr('class', 'indicator-box')
              .selectAll('.indicator')
              .data(d[1])
              .join(div => {
                let enter = div.append("li")
                  .attr("class", "indicator")
                  .attr("id", d => d[0]);
                enter.append('tspan')
                  .text(d => {
                    // let match = d[0].match(/\((.*)\)/);
                    // let subString = match ? d[0].substring(0, match.index) : d[0];
                    return d[0];
                  }).attr('class', 'indicator-name');
                //Indicator Scores
                enter.append('tspan')
                  .text((d, i) => {
                    let target = d[0];
                    let match = spiData[0][`${target}`]
                    if (!match) return;
                    // //round the match value
                    let rounded = (+match).toFixed(3);
                    let result = `(${rounded})`;
                    return result;
                  }).style('font-weight', 600).attr('class', 'indicator-score')


                enter.append('tspan')
                  .text(d => {
                    let match = d[1][0]['Unit'];
                    let subString = match ? match : null;
                    return subString;
                  }).attr('class', 'indicator-substring')

                let indicatorDef = enter.append('div')
                  .attr('class', 'indicator-definitions')

                //Definitions
                indicatorDef.append('p')
                  .text(d => {
                    return d[1][0]['Definition']
                  })
                  .attr("class", "indicator-definition")

                //Source Links
                indicatorDef
                  .append("a")
                  .attr("href", d => { return `${d[1][0]['Link']}` })
                  .text(d => {
                    // if (d[1][0]['Source'] === '') return;
                    return `${d[1][0]['Source']} ⓘ`
                  })
                  .attr("class", "indicator-source")
                  .attr("target", "_blank")
                  .attr("rel", "noopener noreferrer");


                // Open Indicator Boxes
                enter.on('mouseenter', showIndicators)
                // Close Indicator Boxes
                enter.on('mouseleave', hideIndicators)

                enter.on('click', () => {
                  // toggle open/close indicators 
                })

              });
          });

      function showIndicators(event, d) {
        d3.select(event.target).selectAll(".indicator-definitions").style("display", "flex");
        d3.select(event.target).selectAll(".indicator-substring").style("display", "flex");
        d3.select(event.target).style("list-style-type", "disclosure-open");
      };

      function hideIndicators(event, d) {
        d3.select(event.target).selectAll(".indicator-definitions").style("display", "none");
        d3.select(event.target).selectAll(".indicator-substring").style("display", "none");
        d3.select(event.target).style("list-style-type", "disclosure-closed");
      };

      function hideComponents(event, d) {
        var clickedTarget = event.target,
          currentTarget = this;
        d3.select(this).selectAll(".component").style("display", () => {
          return (currentTarget === clickedTarget) ? "none" : "none";
        });
      };

      function hideAllComponents() {
        d3.selectAll(".component").style("display", "none");
        // d3.selectAll(`.indicator`).style("display", "none");
        // d3.selectAll(`.indicator-box`).style("display", "none");
      }

      function showComponents(event, d) {
        hideAllComponents();
        // Flower "Event" Control
        if (!event) {
          d3.selectAll(`#${defContext.dimension}`).selectAll(`.component`).style("display", "flex");

          d3.selectAll(`#${defContext.dimension}`).selectAll(".indicator-box").style("display", "none");
          d3.selectAll(`#${defContext.dimension}`).select(`#${defContext.component}`).select(".indicator-box").style("display", "block").style("list-style-type", "disclosure-closed");;
          return;
        };
        // Manual clicking on definitions 
        var clickedTarget = event.target;
        var currentTarget = this;
        // d3.select(event.target).selectAll(".component-box").style("display", "none");
        d3.select(this).selectAll(".component").style("display", () => {
          return (currentTarget === clickedTarget) ? "flex" : "none";
        });
        d3.select(this).selectAll(".indicator-box").style("display", () => {
          return (currentTarget === clickedTarget) ? "block" : "none";
        }).style("list-style-type", "disclosure-closed");

      };


      d3.selectAll('.dimension').on('mouseenter', showComponents);
      d3.selectAll('.dimension').on('mouseleave', hideComponents);

      indicatorDiv.selectAll(".indicator-definitions").style("display", "none");
      indicatorDiv.selectAll(".indicator-substring").style("display", "none");
      d3.selectAll('#remove').remove();
      hideAllComponents();
      showComponents();
    };

    parsedDefinitions.then((data) => {
      if (!spiData) return;
      tabulateModal(data);
    })

  }, [parsedDefinitions, modalRef, toggleModal, spiData, defContext]);

  return (
    <div className="modal-wrapper" ref={modalRef} >
    </div>
  );

};

export default ModalDefinitions;