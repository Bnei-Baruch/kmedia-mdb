import { call, put, select } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';

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
    yield put(actions.fetchLikutimByTagsSuccess({ content_units, key }));
  } catch (err) {
    yield put(actions.fetchLikutimByTagsFailure({ err, key }));
  }
}

function* watchFetchLikutimByTagSuccess() {
  yield takeEvery(types.FETCH_LIKUTIM_BY_TAGS, fetchLikutimByTag);
}

export const sagas = [watchFetchLikutimByTagSuccess];
