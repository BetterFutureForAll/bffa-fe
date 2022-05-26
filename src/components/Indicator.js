import React, { useState } from "react";

const Indicator = ({ name, definitionData, spiData, defContext }) => {
  
  //return individual indicator as li
  let id = name.replace(/ /g, "_");

  let lorem = "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  let fakeLink = "https://www.lipsum.com/"
  let definition = (name) => (
    <>
      <p class="indicator-definition">{lorem, name}</p>
      <a href=""> {fakeLink}</a>
    </>
  );

  let [isActive, setIsActive] = useState(false)
  // onClick={setDefContext(!indicator.isActive)}
  return (

    <li className="indicator" id={id} >
        <tspan class="indicator-name"> {name} </tspan>
        <tspan class="indicator-score"> {spiData} </tspan>
        <tspan class="indicator-substring"> {spiData} </tspan>
        <div>{isActive ? '-' : '+'}</div>
        {isActive && <div className="indicator-definitions">{definition(name)}</div> }
    </li>
  );
};

export default Indicator;