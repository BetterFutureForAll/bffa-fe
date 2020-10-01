import { GET_SCORE } from '../actions/scoreActions';

export default function reducer(state = {}, action) {
  switch(action.type) {
    case GET_SCORE:
      return action.payload;
    default:
      return state;
  }
}