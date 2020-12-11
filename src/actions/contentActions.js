export const GET_CONTENT = 'GET_CONTENT';
export const SET_CONTENT = 'SET_CONTENT';

export const setContent = (content) => ({ 
  type: SET_CONTENT, 
  payload: content 
});


// export const CREATE_SCORE = 'CREATE_SCORE';
// export const createScore = name => dispatch => {
//   getScore(name)
//     .then(createdScore => dispatch({
//       type: CREATE_SCORE,
//       payload: createdScore
//     }));
// };
