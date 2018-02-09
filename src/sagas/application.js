import { delay } from 'redux-saga';
import { put } from 'redux-saga/effects';

import { actions as system } from '../redux/modules/system';

export default function* application() {
  //
  // Bootstrap the saga middleware with initial sagas
  //
  // allSagas.forEach(saga => sagaMiddleWare.run(saga));

  //
  // Tell everybody, that we're booting now
  //
  yield put(system.boot());

  // Future: Do Whatever bootstrap logic here
  // Load configuration, load translations, etc...

  // Future: Hydrate server state
  // Deep merges state fetched from server with the state saved in the local storage
  yield put(system.init({}));

  //
  // Just make sure that everybody does their initialization homework
  //
  yield delay(0);

  //
  // Inform everybody, that we're ready now
  //
  yield put(system.ready());
}
