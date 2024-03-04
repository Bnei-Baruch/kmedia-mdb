import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { CT_LIKUTIM } from '../helpers/consts';
import { actions, types, selectors } from '../redux/modules/likutim';
import { actions as mdbActions } from '../redux/modules/mdb';
import { selectors as settings } from '../redux/modules/settings';

function* fetchLikutimByTag(action) {
  const key = action.payload;

  const language = yield select(state => settings.getContentLanguage(state.settings));
  const byTag    = yield select(state => selectors.getByTag(state.likutim));

  if (byTag(key)) {
    yield put(actions.fetchLikutimByTagsSuccess({ content_units: [], key }));
    return;
  }

  try {
    const params = {
      content_type: CT_LIKUTIM,
      language,
      pageSize: 10000,
      tag: key.split('_'),
      with_tags: true,
      roots_only: true
    };

    const { data: { content_units } } = yield call(Api.units, params);

    yield put(mdbActions.receiveContentUnits(content_units));
    yield put(actions.fetchByTagSuccess({ content_units, key }));
  } catch (err) {
    yield put(actions.fetchByTagFailure({ err, key }));
  }
}

function* watchFetchLikutimByTagSuccess() {
  yield takeLatest(types['likutim/fetchByTag'], fetchLikutimByTag);
}

export const sagas = [watchFetchLikutimByTagSuccess];
