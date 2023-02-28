import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { actions } from '../../redux/modules/auth';
import { KC_UPDATE_USER, KC_UPDATE_TOKEN } from './adapter';

const eventsToRedux = dispatch => {
  window.addEventListener(KC_UPDATE_USER, ({ detail: user }) => {
    dispatch(actions.updateUser(user));
  });
  window.addEventListener(KC_UPDATE_TOKEN, ({ detail: token }) => {
    dispatch(actions.updateToken(token));
  });
};

const InitKCEvents = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    eventsToRedux(dispatch);
  }, [dispatch]);

  return null;
};

export default InitKCEvents;
