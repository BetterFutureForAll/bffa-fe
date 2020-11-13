import React from "react";
import './App.css';
import MapContainer from './containers/Map';
import { connect } from 'react-redux';
import { setContent, SET_CONTENT }from './actions/contentActions';

function App() {

  return (
    <div className="App">
        <MapContainer />
    </div>
  );
}
const mapStateToProps = state => ({
  content: state.content,
  scores: state.scores
});

const mapDispatchToProps = dispatch => {
  return{
    setContent: ()=> dispatch({ type: SET_CONTENT })
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
