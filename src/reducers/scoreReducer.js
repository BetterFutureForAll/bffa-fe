import { GET_SCORE, GET_SPI } from '../actions/scoreActions';

const initialState = {
  name: '',
  longName: '',
  spiData: {}
}

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case GET_SCORE:
      return action.payload;
    case GET_SPI:
      return {...action.payload, state };
    default:
      return state;
  }
}