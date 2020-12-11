import { combineReducers } from 'redux';
import scores from './scoreReducer';
import content from './contentReducer';

export default combineReducers({
  scores,
  content
});
