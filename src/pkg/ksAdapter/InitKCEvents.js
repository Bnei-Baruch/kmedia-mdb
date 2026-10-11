import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { actions } from '../../redux/modules/auth';
import { KC_UPDATE_USER, KC_UPDATE_TOKEN } from './adapter';
import logger from '../../logger/logger';

const NAMESPACE = 'InitKCEvents';

const eventsToRedux = dispatch => {
  window.addEventListener(KC_UPDATE_USER, ({ detail: user }) => {
    dispatch(actions.updateUser(user));
  });
  window.addEventListener(KC_UPDATE_TOKEN, ({ detail: token }) => {
    logger.log(NAMESPACE, 'KC_UPDATE_TOKEN', token);
    dispatch(actions.updateToken(token));
  });
};

const InitKCEvents = () => {
  logger.log(NAMESPACE, 'InitKCEvents');
  const dispatch = useDispatch();
  useEffect(() => {
    eventsToRedux(dispatch);
  }, [dispatch]);

  return null;
};

export default InitKCEvents;
