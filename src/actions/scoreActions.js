import { getScore } from '../services/SocialProgress';

export const GET_SCORE = 'GET_SCORE';

export const createScore = (name, longName, spiData) => dispatch => {
  return getScore(name, longName, spiData)
    .then(createdScore => dispatch({
      type: GET_SCORE,
      payload: createdScore
    }));
};