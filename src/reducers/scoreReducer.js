import { GET_SCORE } from '../actions/scoreActions';

const initialState = {
  name: '',
  longName: '',
  spiData: {}
}

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case GET_SCORE:
      return action.payload;
    default:
      return state;
  }
}