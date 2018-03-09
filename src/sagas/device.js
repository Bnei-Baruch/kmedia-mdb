import { call, put, select } from 'redux-saga/effects';

import { actions, selectors } from '../redux/modules/device';

function* onDeviceInit() {
  // we expect the server to set this for us
  const deviceInfo = yield select(state => selectors.getDeviceInfo(state.device));

  // determine if user gesture is required for play
  // if so we use native player else we use our beloved custom one.

  // default to us being on desktop or not
  let autoPlayAllowed = deviceInfo.device.type === undefined;

  try {
    yield call(() => {
      const v = document.createElement('video');
      v.src   = 'someting-meant-to-throw-NotSupportedError-when-play-is-allowed';
      return v.play();
    });
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      autoPlayAllowed = false;
    } else if (error.name === 'NotSupportedError') {
      autoPlayAllowed = true;
    }
  }

  yield put(actions.setAutoPlayAllowed(autoPlayAllowed));
}

export const sagas = [onDeviceInit];
