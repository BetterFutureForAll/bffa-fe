import React, { useRef} from 'react';
// import './Reset.css';
import './App.css';
import MapContainer from './containers/Map';
import { useModal } from './hooks/hooks';
import ModalDefinitions from './containers/ModalDefinitions';
import Portal from './containers/Portal';
import { useWindowSize, useHandleCountryChange } from './hooks/hooks';

function App() {
  let { showModal, toggleModal } = useModal();
  let target = "modal-ref";
  let modalRef = useRef(null);
  let [width, height] = useWindowSize();
  let [countryValue, handleCountryChange, setCountryValue] = useHandleCountryChange();

  let children =
  <> 
  <ModalDefinitions
    toggleModal={toggleModal}
    showModal={showModal}
    modalRef={modalRef}
  />
  </>;


  return (
    <div className="App">
      <div id={target} >
      <Portal
        id={target}
        children={showModal? children : null}
        width={width}
        height={height}
      />
      <MapContainer
        showModal={showModal}
        toggleModal={toggleModal}
        width={width}
        height={height}
        countryValue={countryValue}
        setCountryValue={setCountryValue}
        handleCountryChange={handleCountryChange}
      />
      </div>
    </div>
  );
}

export default App;
