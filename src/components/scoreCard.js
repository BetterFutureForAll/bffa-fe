import React from 'react';



const ScoreCard = ({ NAME, Pop, data, geo, year }) => {

  const notFound = 'Score Not Found'
  const target = data.find(t => t['SPI country code'] === geo.properties.ISO_A3);
  const rank = target ? target['SPI Rank'] : 'Unranked';
  const basicNeeds = target ? target['Basic Human Needs'] : notFound;
  const foundations = target ? target['Foundations of Wellbeing'] : notFound;
  const opportunity = target ? target['Opportunity'] : notFound;
  const SCORE = target ? target['Social Progress Index'] : notFound;

  const content =     
  `${NAME}, <br/>
  Population, ${Pop}, <br/>
  Social Progress Index: ${SCORE}, <br/>
  Basic Human Needs: ${basicNeeds}, <br/>
  Foundations of Wellbeing: ${foundations}, <br/>
  Opportunity: ${opportunity}, <br/>
  Global Rank: ${rank} in ${year} `

  return (
  <div class="Tool-Tip">
    <span>{content}</span>
  </div>
  
);
};



export default ScoreCard;