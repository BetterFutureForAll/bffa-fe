import React from 'react';
import './App.css';
import Modal from './components/Modal';
import MapContainer from './containers/Map';
import { useModal } from './hooks/hooks';

function App() {
  let { showModal, toggleModal } = useModal();

  return (
    <div className="App">
      <Modal
        showModal={showModal}
        toggleModal={toggleModal}
      ></Modal>
      <MapContainer
        showModal={showModal}
        toggleModal={toggleModal}
      />
    </div>
  );
}

export default App;
