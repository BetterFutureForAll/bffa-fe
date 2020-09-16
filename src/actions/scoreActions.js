import { getScore } from '../services/SocialProgress';

export const GET_SCORE = 'GET_SCORE';
export const createScore = score => dispatch => {
  getScore(score)
    .then(createdScore => dispatch({
      type: GET_SCORE,
      payload: createdScore
    }));
};