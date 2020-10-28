import { GET_CONTENT, GET_SPI } from '../actions/contentActions';

const initialState = "";

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case GET_CONTENT:
      return {...action.payload, state };
    case GET_SPI:
      return {...action.payload, state };
    default:
      return state;
  }
}