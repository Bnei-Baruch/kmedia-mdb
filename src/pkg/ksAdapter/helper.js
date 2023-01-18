import { KC_UPDATE_USER, KC_UPDATE_TOKEN } from './adapter';
import { actions } from '../../redux/modules/auth';

export const eventsToRedux = (dispatch) => {
  window.addEventListener(KC_UPDATE_USER, ({ detail: user }) => {
    dispatch(actions.updateUser(user));
  });
  window.addEventListener(KC_UPDATE_TOKEN, ({ detail: token }) => {
    dispatch(actions.updateToken(token));
  });
};
