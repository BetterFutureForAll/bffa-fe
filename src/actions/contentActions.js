export const GET_CONTENT = 'GET_CONTENT';
export const SET_CONTENT = 'SET_CONTENT';

export const setContent = (content) => dispatch => {
  dispatch({
    type: SET_CONTENT,
    payload: content
  });
};