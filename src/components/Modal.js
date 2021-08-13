import React from 'react';
import ReactDOM from 'react-dom';
import indicatorPNG from '../assets/2020-indicator.png';
// import PropTypes from 'prop-types';

const Modal = ({ showModal, toggleModal }) => showModal ? ReactDOM.createPortal(
  <React.Fragment>
    <div className="modal-overlay" />
    <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog" onClick={toggleModal}></div>
    <div className="modal">
      <div className="modal-header">
        <button type="button" className="modal-close-button" onClick={toggleModal}>
          X
          </button>
      </div>
      <section id="modal_img">
        <img className="modal_png" alt={'Indicator Definitions of Social Progress'} src={indicatorPNG} />
      </section>
    </div>
  </React.Fragment>, document.body
) : null;

// Modal.propTypes = {
//   showModal: PropTypes.bool,
//   toggleModal: PropTypes.func
// };

export default Modal;