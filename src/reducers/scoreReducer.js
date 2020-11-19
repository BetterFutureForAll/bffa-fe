import { GET_SCORE, GET_SPI, GET_YEARS } from '../actions/scoreActions';

const initialState = {
  name: '',
  longName: '',
  spiData: {},
  years: []
}

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case GET_SCORE:
      return action.payload;
    case GET_SPI:
      return {...action.payload, state };
    case GET_YEARS:
      return state.years;
    default:
      return state;
  }
}