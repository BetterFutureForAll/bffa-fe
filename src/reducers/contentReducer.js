import { SET_CONTENT, GET_CONTENT } from '../actions/contentActions';

const initialState = {
content:  ""
};

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case SET_CONTENT:
      return { ...state, content: action.payload };
    case GET_CONTENT:
      return state;
    default:
      return state;
  }
}