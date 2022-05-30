import React, { useEffect } from 'react';
import * as d3 from 'd3';

function ModalDefinitions({ modalRef, spiData, defContext }) {

  let currentDefinitions = require('../assets/definitions-2021.csv');
  let parsedDefinitions = d3.csv(currentDefinitions, function (data) {
    //re-key the parsedDefinitions if needed
    return data;
  });

  function componentImgImport(d) {
    switch (d[0]) {
      case "Nutrition and Basic Medical Care": return 'Do people have enough food to eat and are they receiving basic medical care? ';
      case "Water and Sanitation": return 'Can people drink water and keep themselves clean without getting sick?';
      case "Shelter": return 'Do people have adequate housing with basic utilities?';
      case "Personal Safety": return 'Do people feel safe?';

      case "Access to Basic Knowledge": return 'Do people have access to an educational foundation?';
      case "Access to Information and Communications": return 'Can people freely access ideas and in formation from anywhere in the world?';
      case "Health and Wellness": return 'Do people live long and healthy lives?';
      case "Environmental Quality": return 'Is this society using its resources so they will be available for future generations?';

      case "Personal Rights": return 'Are people’s rights as individuals protected?';
      case "Personal Freedom and Choice": return 'Are people free to make their own life choices?';
      case "Inclusiveness": return 'Is no one excluded from the opportunity to be a contributing member of society?';
      case "Access to Advanced Education": return 'Do people have access to the world’s most advanced knowledge?';

      default: return '';
    };
  };

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
        .join(
          enter => enter
            .append("div")
            .attr("class", (d, i) => { return `dim-${i} dimension`; })
            .attr("id", d => {
              if (d[0].length === 0) {
                return "footer";
              }
              //class and ID to isolate footer
              let id = (d[0]).replace(/ /g, "_");
              return id;
            }));

      //Dimensions Title Bar
      let divTitle = dimensionsDiv.append('div').attr("id", d => {
        if (d[0].length === 0) {
          return "footer";
        }
        //class and ID to isolate footer
        let id = (d[0]).replace(/ /g, "_");
        return `${id}_title`;
      }).attr('class', 'dimension-title').on('click', addComponents);
      divTitle.append("h3").text('+').attr("class", "dimension_img");
      divTitle.append('h4').text(d => {
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

      // Components
      function addComponents(event, d) {
        d3.selectAll('.component-box').remove();
        d3.selectAll('.dimension_img').text('+');
        d3.selectAll('.dimension-title').on('click', addComponents);
        d3.select(this).on('click', collapseDimension);
        d3.select(this).select('.dimension_img').text('-');
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
        componentTitle.append("h3").text('+').attr("class", "component_img");
        componentTitle.append('h4').text(d => {
          //Rounded Number
          let target = d[0];
          let value = +spiData[0][`${target}`];
          let result = `${d[0]}:  ${value.toFixed()}`;
          return result;
        });
        componentTitle.append('p').text(d => {
          let result = componentImgImport(d);
          return result;
        })
        d3.select(this).exit().remove();
      };

      function collapseDimension() {
        d3.select(this).select('.dimension_img').text('+');
        d3.select(this).on('click', addComponents);
        d3.selectAll('.component-box').remove();
      }

      function addIndicators(event, d) {
        d3.selectAll('.indicator-box').remove();
        d3.selectAll('.component_img').text('+');
        d3.selectAll('.component-title').on('click', addIndicators);
        d3.select(this).on('click', collapseComponent)
        d3.select(this).select('.component_img').text('-');

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
            let match = spiData[0][`${target}`]
            if (!match) return;
            // //round the match value
            let rounded = (+match).toFixed(3);
            let result = `(${rounded})`;
            return result;
          }).style('font-weight', 600).attr('class', 'indicator-score');
        //substrings

        indicator.append('tspan')
          .text(d => {
            if (!d[1]) return;
            let match = d[1][0]['Unit'];
            let subString = match ? match : null;
            return `    ${subString}`;
          }).attr('class', 'indicator-substring')


      }
      function collapseComponent() {
        d3.select(this).select('.component_img').text('+');
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
            return d[1][0]['Definition']
          })
          .attr("class", "indicator-definition");
        indicator.append("a")
          .attr("href", d => { return `${d[1][0]['Link']}` })
          .text(d => {
            return `${d[1][0]['Source']} ⓘ`
          })
          .attr("class", "indicator-source")
          .attr("target", "_blank")
          .attr("rel", "noopener noreferrer");
      }

      function collapseIndicator() {
        d3.select(this).style("list-style-type", "disclosure-closed");
        d3.select(this).on('click', expandIndicators);
        d3.selectAll('.indicator-definitions').remove();
      }

      if (defContext.dimension) {
        document.querySelector(`#${defContext.dimension}_title`).click();
      }

      if (defContext.component && document.querySelector(`#${defContext.component}_title`)) {
        document.querySelector(`#${defContext.component}_title`).click();
      }

      d3.selectAll('#remove').remove();
    };

    parsedDefinitions.then((data) => {
      if (!spiData) return;
      tabulateModal(data);
    })

  }, [parsedDefinitions, modalRef, spiData, defContext]);

  return (
    <div className="modal-wrapper" ref={modalRef} >
    </div>
  );

};

export default ModalDefinitions;