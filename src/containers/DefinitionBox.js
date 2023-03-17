import React, { useLayoutEffect } from 'react';
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

import { dataKeys } from '../services/SocialProgress';
import { definitionsArray } from '../assets/definitions.json';

const DefinitionBox = () => {


  


  return (
    <div className='modal'>
      <div class="dim-0 dimension" id="Basic_Human_Needs">
        <div id="Basic_Human_Needs_title" class="dimension-title">
          <h3 class="dimension_icon">-</h3><img src="/static/media/0_0_basic.5cee9e76.png" class="dimension_img" />
          <h4>Basic Human Needs:  76</h4>
        </div>
        <div class="component-box">
          <div class="component" id="Nutrition_and_Basic_Medical_Care">
            <div id="Nutrition_and_Basic_Medical_Care_title" class="component-title">
              <img src={{}} class="component_img"></img>
              <h3 class="component_icon">-</h3>
              <h4>Nutrition and Basic Medical Care:  82</h4>
              <p>Do people have enough food to eat and are they receiving basic medical care? </p>
            </div>
            <ul class="indicator-box">
              <li class="indicator" id="Infectious diseases " style="list-style-type: disclosure-open;">
                <tspan class="indicator-name">Infectious diseases </tspan>
                <tspan class="indicator-score" style="font-weight: 600;">(5412.513)</tspan>
                <tspan class="indicator-substring">(DALYs/100,000)</tspan>
                <div class="indicator-definitions">
                  <p class="indicator-definition">Age-standardized Disability-Adjusted Life Years (DALYs) rate caused by HIV/AIDS, tuberculosis, diarrhea, intestinal infections, respiratory infections, otitis media, meningitis, encephalitis, diptheria, whooping cough, tetanus, measles, varicella, herpes zoster, malaria, Chagas disease, leishmaniasis, typanosomiasis, schistosomiasis, cysticercosis, cycstic echinococcosis, lymphatic filariasis, onchocerciasis, trachoma, dengue, yellow feber, rabies, intestinal nematode infections, food-borne trematodiases, leprosy, ebola, zika virus, guinea worm disease, sexually transmitted diseases (excluding HIV), hepatitis, and other infectious diseases per 100,000 people.</p>
                  <a class="indicator-link" href="http://ghdx.healthdata.org/gbd-results-tool" target="_blank" rel="noopener noreferrer">Institute for Health Metrics and Evaluation"</a>
                </div>
              </li>
              <li class="indicator" id="Child mortality rate " style="list-style-type: disclosure-closed;"><tspan class="indicator-name">Child mortality rate </tspan>
                <tspan class="indicator-score" style="font-weight: 600;">(26.249)</tspan>
                <tspan class="indicator-substring">    (deaths/1,000 live births) </tspan></li>
              <li class="indicator" id="Child stunting " style="list-style-type: disclosure-closed;">
                <tspan class="indicator-name">Child stunting </tspan><tspan class="indicator-score" style="font-weight: 600;">(13.803)</tspan>
                <tspan class="indicator-substring">    (0=low risk; 100=high risk) </tspan></li>
              <li class="indicator" id="Maternal mortality rate " style="list-style-type: disclosure-closed;">
                <tspan class="indicator-name">Maternal mortality rate </tspan><tspan class="indicator-score" style="font-weight: 600;">(97.051)</tspan>
                <tspan class="indicator-substring">    (deaths/100,000 live births) </tspan></li><li class="indicator" id="Undernourishment " style="list-style-type: disclosure-closed;">
                <tspan class="indicator-name">Undernourishment </tspan><tspan class="indicator-score" style="font-weight: 600;">(9.508)</tspan>
                <tspan class="indicator-substring">    (% of pop.) </tspan></li>
              <li class="indicator" id="Diet low in fruits and vegetables" style="list-style-type: disclosure-closed;">
                <tspan class="indicator-name">Diet low in fruits and vegetables</tspan>
                <tspan class="indicator-score" style="font-weight: 600;">(52.489)</tspan>
                <tspan class="indicator-substring">    (0=low risk; 100=high risk) </tspan>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
};
