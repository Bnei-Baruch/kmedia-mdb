import { all, call, put, takeLatest, select } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { IsCollectionContentType } from '../helpers/consts';
import { AB_RECOMMEND_NEW } from '../helpers/ab-testing';
import { actions, types, selectors as recommended } from '../redux/modules/recommended';
import { actions as mdbActions, selectors as mdbSelectors } from '../redux/modules/mdb';
import { selectors as settings } from '../redux/modules/settings';


export function* fetchRecommended(action) {
  const { id, size, skip, variant } = action.payload;
  try {
    const language = yield select(state => settings.getContentLanguage(state.settings));
    const skipUids = yield select(state => recommended.getSkipUids(state.recommended));
    const skipSet = new Set(skipUids);
    skip.forEach(uid => {
      if (!skipSet.has(uid)) {
        skipUids.push(uid);
      }
    });

    const specs = [];  // Order important due to skip uids.
    if (variant === AB_RECOMMEND_NEW) {
      // Same Topic - WatchingNow, Popular, Latest.
      specs.push({ "name": "RoundRobinSuggester", "specs": [
        { "name": "DataContentUnitsSuggester", "filters": [{ "filter_selector": 5 }, { "filter_selector": 8 }], "order_selector": 5 },
        { "name": "DataContentUnitsSuggester", "filters": [{ "filter_selector": 5 }], "order_selector": 4 },
        { "name": "DataContentUnitsSuggester", "filters": [{ "filter_selector": 5 }], "order_selector": 0 },
      ] });
      // Any Topic - WatchingNow, Popular, Latest.
      specs.push({ "name": "RoundRobinSuggester", "specs": [
        { "name": "DataContentUnitsSuggester", "filters": [{ "filter_selector": 8 }], "order_selector": 5 },
        { "name": "DataContentUnitsSuggester", "order_selector": 4 },
        { "name": "DataContentUnitsSuggester", "order_selector": 0 },
      ] });
    }

    specs.push({ name: 'Default' });

    const requestData = Api.recommendedRequestData({ uid: id, languages: [language], skipUids, size, specs });
    const { data } = yield call(Api.recommended, requestData);

    if (Array.isArray(data.feeds) && data.feeds.length > 0) {
      const fetchList = [
        fetchMissingUnits(data.feeds.flat().filter(item => item && !IsCollectionContentType(item.content_type))),
        fetchMissingCollections(data.feeds.flat().filter(item => item && IsCollectionContentType(item.content_type))),
      ];
      if (variant === AB_RECOMMEND_NEW) {
        for (let i = 0; i < data.feeds.length; ++i) {
          if (Array.isArray(data.feeds[i]) && data.feeds[i].length > 0) {
            fetchList.push(fetchViews(data.feeds[i]));
            fetchList.push(fetchWatchingNow(data.feeds[i]));
          }
        }
      }

      yield all(fetchList);
    }

    const keysLength = Object.keys(data.feeds).length;
    if (keysLength !== specs.length) {
      throw new Error(`Expected recommended feeds size to be ${specs.length}`);
    }

    const feeds = { 'default': data.feeds[data.feeds.length-1] };
    if (variant === AB_RECOMMEND_NEW) {
      feeds['same-topic'] = data.feeds[0];
      feeds['any-topic'] = data.feeds[1];
    }

    yield put(actions.fetchRecommendedSuccess({ feeds, requestData }));
  } catch (err) {
    yield put(actions.fetchRecommendedFailure(err));
  }
}

function* fetchViews(recommendedItems) {
  const uids = yield select(state => recommendedItems.map(item => item.uid).filter(uid => recommended.getViews(uid, state.recommended) === -1));
  if (uids.length > 0) {
    const { data } = yield call(Api.views, uids);
    const views = uids.reduce((acc, uid, i) => {
      acc[uid] = data.views[i];
      return acc;
    }, {});
    yield put(actions.receiveViews(views));
  }
}

function* fetchWatchingNow(recommendedItems) {
  const uids = yield select(state => recommendedItems.map(item => item.uid).filter(uid => recommended.getWatchingNow(uid, state.recommended) === -1));
  if (uids.length > 0) {
    const { data } = yield call(Api.watchingNow, uids);
    const views = uids.reduce((acc, uid, i) => {
      acc[uid] = data.watching_now[i];
      return acc;
    }, {});
    yield put(actions.receiveWatchingNow(views));
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
