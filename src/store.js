import { createStore } from '@reduxjs/toolkit';
import reducer from './reducers';

export default createStore(
  reducer
);