import { configureStore, } from '@reduxjs/toolkit';
import { reducer } from './rootReducer';
import { middleware } from './middleware';

export const reduxStore = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(middleware)
  },
})
