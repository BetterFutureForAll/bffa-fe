import { GET_CONTENT } from '../actions/contentActions';

const initialState = "";

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case GET_CONTENT:
      return {...action.payload, state };
    default:
      return state;
  }
}