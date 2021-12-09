import React, { useRef} from 'react';
// import './Reset.css';
import './App.css';
import MapContainer from './containers/Map';
import { useModal } from './hooks/hooks';
import ModalDefinitions from './containers/ModalDefinitions';
import Portal from './containers/Portal';
import { useWindowSize, useHandleCountryChange, useCountries } from './hooks/hooks';

function App() {
  let { showModal, toggleModal } = useModal();
  let target = "modal-ref";
  let modalRef = useRef(null);
  let [width, height] = useWindowSize();
  let [countryValue, setCountryValue] = useHandleCountryChange();
  let [countries] = useCountries();
  
  let handleCountryChange = e => setCountryValue(e.target.value);

  let selectCountries = (
    <select onChange={handleCountryChange} value={countryValue}>
      {countries.map(item => (
        <option key={item} value={item} onSelect={handleCountryChange}>
          {item}
        </option>
      ))}
    </select>
  );

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
        selectCountries={selectCountries}
        countryValue={countryValue}
        setCountryValue={setCountryValue}
      />
      </div>
    </div>
  );
}

export default App;
