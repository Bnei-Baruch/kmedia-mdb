import { put, takeEvery, select, call } from 'redux-saga/effects';
import { actions, types, selectors } from '../redux/modules/fetchImage';
import { knownFallbackImages } from '../helpers/images';

const buffer = [];

function* bufferFetch({ payload }) {
  const { src } = payload;

  const d = yield select(state => selectors.getBySrc(state.fetchImage, src));
  if (d?.src || d?.wip || d?.err) return;

  yield put(actions.startWIP(src));

  if (buffer.length === 0) {
    yield fetch(payload);
    return;
  }

  buffer.push(payload);

  if (!buffer.run) return;
  buffer.run = true;
  while (buffer.length > 0) {
    if (!buffer.wip) {
      const p = buffer.unshift();
      yield fetch(p);
    }
  }

  buffer.run = false;
}

function* fetch(payload) {
  buffer.wip               = true;
  const { src, fallbacks } = payload;

  let img;
  const arr = [src, ...fallbacks];

  for (const i in arr) {
    if (knownFallbackImages.includes(arr[i])) {
      img = arr[i];
      break;
    }

    try {
      img = yield call(tryFetch, arr[i]);
      if (img) break;
    } catch (e) {
      console.log(src, e);
    }
  }

  if (img) {
    yield put(actions.fetchSuccess({ src, img }));
  } else {
    yield put(actions.fetchFailure({ src, err: 'cant load image' }));
  }

  buffer.wip = false;
}

async function tryFetch(src) {
  const promise = new Promise((resolve, reject) => {
    const displayImage   = new window.Image();
    displayImage.onerror = err => reject({ err });
    displayImage.onload  = r => resolve(src);

    displayImage.src = src;
  });
  const res     = await promise;
  return res;
}

function* watchTrim() {
  yield takeEvery([types.FETCH], bufferFetch);
}

export const sagas = [watchTrim,];
