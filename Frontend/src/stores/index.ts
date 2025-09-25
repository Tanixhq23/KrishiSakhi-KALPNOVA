import { configureStore } from '@reduxjs/toolkit';
import farmerReducer from './farmerSlice';

const store = configureStore({
  reducer: {
    farmer: farmerReducer,
  },
});

export default store;
