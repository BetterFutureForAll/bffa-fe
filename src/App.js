import React, { useRef} from 'react';
import './Reset.css';
import './App.css';
import MapContainer from './containers/Map';
import { useModal } from './hooks/hooks';
import ModalDefinitions from './containers/ModalDefinitions';
import Portal from './containers/Portal'

function App() {
  let { showModal, toggleModal } = useModal();
  let target = "modal-ref";
  let modalRef = useRef(null);
  let children = 
  <> 
  <ModalDefinitions
    toggleModal={toggleModal}
    showModal={showModal}
    modalRef={modalRef}
    // countryValue={countryValue}
  />
  </>;

  return (
    <div className="App">
      <div id={target} >
      <Portal
        id={target}
        children={showModal? children : null}
      />
      <MapContainer
        showModal={showModal}
        toggleModal={toggleModal}
      />
      </div>
    </div>
  );
}

export default App;
