import React from "react";
import Component from "./Component";
import { getComponentsByDimension, componentImgImport } from "../services/SocialProgress";

const Dimension = ({ name, components, definitionsData, spiData, defContext, img }) => {
  let id = name.replace(/ /g, "_");
  console.log(components);



  return (
    <div className="dimension" id={id}>
      <div className="dimension-title">
        <img className="dimension_img" alt={''} src={img} />
        <h3>{`${name}`}</h3>
      </div>
      <div className="component-box">
        {/* {components.map((key)=>{
        let imgDescription = componentImgImport(key)
        return <Component 
        name={key} key={key} 
        definitionData={definitionsData} 
        spiData={spiData} 
        defContext={defContext} 
        img={imgDescription[0]} />
      })} */}
      </div>
    </div>
  );
};

export default Dimension;