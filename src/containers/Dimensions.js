import React, { useEffect } from "react";
import Dimension from '../components/Dimension';
import { imgImport, getComponentsByDimension } from "../services/SocialProgress";

const Dimensions = ({ definitionsData, dimensions, modalRef, spiData, defContext, setLoading }) => {
  // useEffect(()=>{
  //   setLoading(false);
  // },[definitionsData])

  return (
    <div className="modal-wrapper" ref={modalRef} >
      <div className="modal">
        {dimensions.map((key) => {
          let img = imgImport(key);
          let components = getComponentsByDimension(key).then((result) => {
            return result
          });
          return <Dimension
            name={key}
            components={components}
            img={img}
          />
        })}
      </div>
    </div>
  );
};

export default Dimensions;