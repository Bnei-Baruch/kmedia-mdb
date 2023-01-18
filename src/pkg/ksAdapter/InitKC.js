import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { eventsToRedux } from './helper';

const InitKC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    console.log('InitKC effect');
    eventsToRedux(dispatch);
  }, [dispatch]);

  return null;
};

export default InitKC;
