import { all, call, put, takeLatest, select } from 'redux-saga/effects';

import Api from '../helpers/Api';
import {IsCollectionContentType} from '../helpers/consts';
import { actions, types, selectors as recommended } from '../redux/modules/recommended';
import { actions as mdbActions, selectors as mdbSelectors } from '../redux/modules/mdb';
import { selectors as settings } from '../redux/modules/settings';


export function* fetchRecommended(action) {
  const {id, size, skip} = action.payload;
  try {
    const language = yield select(state => settings.getContentLanguage(state.settings));
    const skipUids = yield select(state => recommended.getSkipUids(state.recommended));
    const skipSet = new Set(skipUids);
    skip.forEach((uid) => {
      if (!skipSet.has(uid)) {
        skipUids.push(uid);
      }
    });

    const requestData = Api.recommendedRequestData({uid: id, languages: [language], skipUids, size})
    const { data } = yield call(Api.recommended, requestData);
    const recommendedItems = data.feed;

    if (Array.isArray(recommendedItems) && recommendedItems.length > 0){
      yield all([
        fetchMissingUnits(recommendedItems.filter(item => !IsCollectionContentType(item.content_type))),
        fetchMissingCollections(recommendedItems.filter(item => IsCollectionContentType(item.content_type))),
      ]);
    }

    yield put(actions.fetchRecommendedSuccess({recommendedItems, requestData}));
  }
  catch (err) {
    yield put(actions.fetchRecommendedFailure(err));
  }
}

function* fetchMissingUnits(recommendedItems) {
  const missingUnitIds = yield select(state => recommendedItems
    .filter(item => !mdbSelectors.getUnitById(state.mdb, item.uid))
    .map(item => item.uid));

  if (missingUnitIds.length > 0) {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.units, { id: missingUnitIds, language });
    yield put(mdbActions.receiveContentUnits(data.content_units));
  }
}
  
function* fetchMissingCollections(recommendedItems) {
  const missingCollectionIds = yield select(state => recommendedItems
    .filter(item => !mdbSelectors.getCollectionById(state.mdb, item.uid))
    .map(item => item.uid));
  
  if (missingCollectionIds.length > 0) {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.collections, { id: missingCollectionIds, language });
    yield put(mdbActions.receiveCollections(data.collections));
  }
}

function* watchFetchRecommended() {
  yield takeLatest(types.FETCH_RECOMMENDED, fetchRecommended);
}

export const sagas = [
  watchFetchRecommended,
]
