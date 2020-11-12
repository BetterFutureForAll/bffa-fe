import { getSpiData } from '../selectors/contentSelector';
import { getScore } from '../services/SocialProgress';

export const GET_SCORE = 'GET_SCORE';
export const GET_SPI = 'GET_SPI';

export const createScore = (name, longName, spiData) => dispatch => {
  return getScore(name, longName, spiData)
    .then(createdScore => dispatch({
      type: GET_SCORE,
      payload: createdScore
    }));
};

export const createSPI = (data) => dispatch => {
  return getSpiData(data)
    .then(createdSPI => dispatch({
      type: GET_SPI,
      payload: createdSPI
    }));
};