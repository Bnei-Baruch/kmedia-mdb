import { call, put, select } from 'redux-saga/effects';
import UAParser from 'ua-parser-js';

import { actions, selectors } from '../redux/modules/device';

function* onDeviceInit() {
  // we expect the server to set this for us
  let deviceInfo = yield select(state => selectors.getDeviceInfo(state.device));

  if (!deviceInfo) {
    deviceInfo = new UAParser().getResult();
    yield put(actions.setDeviceInfo(deviceInfo));
  }

  // determine if user gesture is required for play
  // if so we use native player else we use our beloved custom one.

  // default to us being on desktop or not
  const autoPlayAllowed = deviceInfo.device.type === undefined;

  // Stop autoplay allowed based test for choosing player.
  // Desktop browsers tend to disallow it these days.
  // https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
  // https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/

  // try {
  //   yield call(() => {
  //     const v = document.createElement('video');
  //     v.preload = 'auto';
  //     v.src   = '';
  //     // v.src   = 'someting-meant-to-throw-NotSupportedError-when-play-is-allowed';
  //     return v.play();
  //   });
  // } catch (error) {
  //   console.log('autoPlayAllowed:', error.name, error);
  //   if (error.name === 'NotAllowedError') {
  //     autoPlayAllowed = false;
  //   } else if (error.name === 'NotSupportedError') {
  //     autoPlayAllowed = true;
  //   }
  // }

  yield put(actions.setAutoPlayAllowed(autoPlayAllowed));
}

export const sagas = [onDeviceInit];
