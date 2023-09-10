import { configureStore } from '@reduxjs/toolkit';
import { useSelector as useReduxSelector, useDispatch as useReduxDispatch, } from 'react-redux';

import { reducer } from './rootReducer';
import { middleware } from './middleware';
import { createWrapper } from 'next-redux-wrapper';

const makeStore = () => configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(middleware);
  },
});

export const wrapper     = createWrapper(makeStore);
export const useDispatch = useReduxDispatch;
export const useSelector = useReduxSelector;
