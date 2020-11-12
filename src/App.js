import React from "react";
import './App.css';
import MapContainer from './containers/Map';
import { connect } from 'react-redux';
import { setContent }from './actions/contentActions';

function App() {

  return (
    <div className="App">
        <MapContainer />
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    content: state.content
  }
};
// const mapDispatchToProps = dispatch => {
//   dispatch(setContent())
// };

export default connect(
  mapStateToProps,
  setContent
)(App);
