import { SET_CONTENT, GET_CONTENT } from '../actions/contentActions';

const initialState = "";

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case SET_CONTENT:
      console.log('payload = ' + action.payload)
      return state += action.payload;
    case GET_CONTENT:
      return state;
    default:
      return state;
  }
}