import React from "react";
import Indicator from "./Indicator";

const Component = ({ name, definitionData, spiData, defContext }) => {

  let id = name.replace(/ /g, "_");
  //forEach component return a list of indicators

  return (
    <li className="component" id={id} >
      <div class="component-title">
        <img class="component_img" alt={''}> </img>
        <h3>{name}:{'ScoreGoesHere'}</h3>
        <p ></p>
      </div>
      <ul className="indicator-box">
        {/* {Array.from(definitionData, ([key, values]) => 
          <Indicator name={key} definitionData={values} spiData={spiData} defContext={defContext} />
        )} */}
      </ul>
    </li>
  );
};

export default Component;