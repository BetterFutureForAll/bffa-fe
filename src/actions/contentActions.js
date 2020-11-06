export const GET_CONTENT = 'GET_CONTENT';
export const SET_CONTENT = 'SET_CONTENT';

const setContent = (content) => ({
  type: SET_CONTENT,
  payload: content
});
const getContent = (content) => ({
  type: GET_CONTENT,
  payload: content
});
const actions = {
  setContent,
  getContent
};

export default actions;