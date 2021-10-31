import { all, call, put, takeLatest, select } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { IsCollectionContentType } from '../helpers/consts';
import { AB_RECOMMEND_NEW } from '../helpers/ab-testing';
import { actions, types, selectors as recommended } from '../redux/modules/recommended';
import { actions as mdbActions, selectors as mdbSelectors } from '../redux/modules/mdb';
import { selectors as settings } from '../redux/modules/settings';
import {
  CT_LESSONS_SERIES,
} from '../helpers/consts';

const WATCHING_NOW_MIN = 50;
const POPULAR_MIN      = 100;

export function* fetchRecommended(action) {
  const { id, tags, collections, size, skip, variant } = action.payload;
  try {
    const language = yield select(state => settings.getContentLanguage(state.settings));
    const skipUids = yield select(state => recommended.getSkipUids(state.recommended));
    const skipSet  = new Set(skipUids);
    skip.forEach(uid => {
      if (!skipSet.has(uid)) {
        skipUids.push(uid);
      }
    });

    const specs = [];  // Order important due to skip uids.
    if (variant === AB_RECOMMEND_NEW) {
      // Same Topic - WatchingNow, Popular, Latest.
      tags.forEach(tag => {
        specs.push({
          'name': 'RoundRobinSuggester', 'specs': [
            {
              'name': 'DataContentUnitsSuggester',
              'filters': [{ 'filter_selector': 2, 'args': [tag] }, { 'filter_selector': 8 }],
              'order_selector': 5
            },
            {
              'name': 'DataContentUnitsSuggester',
              'filters': [{ 'filter_selector': 2, 'args': [tag] }, { 'filter_selector': 9 }],
              'order_selector': 4
            },
            {
              'name': 'DataContentUnitsSuggester',
              'filters': [{ 'filter_selector': 2, 'args': [tag] }],
              'order_selector': 0
            },
          ]
        });
      });
      collections.forEach(collection => {
        // Same collection - WatchingNow, Popular, Latest.
        specs.push({
          'name': 'RoundRobinSuggester', 'specs': [
            {
              'name': 'DataContentUnitsSuggester',
              'filters': [{ 'filter_selector': 4, 'args': [collection.id] }, { 'filter_selector': 8 }],
              'order_selector': 5
            },
            {
              'name': 'DataContentUnitsSuggester',
              'filters': [{ 'filter_selector': 4, 'args': [collection.id] }, { 'filter_selector': 9 }],
              'order_selector': 4
            },
            {
              'name': 'DataContentUnitsSuggester',
              'filters': [{ 'filter_selector': 4, 'args': [collection.id] }],
              'order_selector': 0
            },
          ]
        });
      });
    }

    specs.push({ name: 'Default' });

    const requestData = Api.recommendedRequestData({
      uid: id,
      languages: [language],
      skipUids,
      size,
      specs,
      watchingNowMin: WATCHING_NOW_MIN,
      popularMin: POPULAR_MIN,
    });
    const { data }    = yield call(Api.recommended, requestData);

    // Append predefined, constant recommentations.
    if (variant === AB_RECOMMEND_NEW) {
      data.feeds.splice(data.feeds.length - 1, 0, [
        { content_type: CT_LESSONS_SERIES, uid: 'ReQUUOtN' },
      ]);
    }

    if (Array.isArray(data.feeds) && data.feeds.length > 0) {
      const fetchList = [
        fetchMissingUnits(data.feeds.flat().filter(item => item && !IsCollectionContentType(item.content_type))),
        fetchMissingCollections(data.feeds.flat().filter(item => item && IsCollectionContentType(item.content_type))),
      ];
      const viewUids = new Set();
      for (let i = 0; i < data.feeds.length; ++i) {
        if (Array.isArray(data.feeds[i]) && data.feeds[i].length > 0) {
          data.feeds[i].forEach(f => viewUids.add(f.uid));
        }
      }

      fetchList.push(fetchViewsByUIDs(Array.from(viewUids)));

      if (variant === AB_RECOMMEND_NEW) {
        const watchingUids = new Set();
        for (let i = 0; i < data.feeds.length; ++i) {
          if (Array.isArray(data.feeds[i]) && data.feeds[i].length > 0) {
            data.feeds[i].forEach(f => watchingUids.add(f.uid));
          }
        }

        fetchList.push(fetchWatchingNow(Array.from(watchingUids)));
      }

      yield all(fetchList);
    }

    const keysLength = Object.keys(data.feeds).length;
    const expectedLength = variant === AB_RECOMMEND_NEW ? specs.length + 1 : specs.length;
    if (keysLength !== expectedLength) {
      throw new Error(`Expected recommended feeds size to be ${expectedLength}`);
    }

    const feeds = { 'default': data.feeds[data.feeds.length - 1] };
    if (variant === AB_RECOMMEND_NEW) {
      let index = 0;
      tags.forEach(tag => {
        feeds[`same-topic-${tag}`] = data.feeds[index];
        index++;
      });
      collections.forEach(collection => {
        feeds[`same-collection-${collection.id}`] = data.feeds[index];
        index++;
      });
      // One before last.
      feeds['series'] = data.feeds[index];
    }

    yield put(actions.fetchRecommendedSuccess({ feeds, requestData }));
  } catch (err) {
    yield put(actions.fetchRecommendedFailure(err));
  }
}

function* fetchViews(action) {
  yield fetchViewsByUIDs(action.payload);
}

function* fetchViewsByUIDs(uids) {
  uids = yield select(state => uids.filter(uid => recommended.getViews(uid, state.recommended) === -1));
  if (uids.length > 0) {
    const { data } = yield call(Api.views, uids);
    const views    = uids.reduce((acc, uid, i) => {
      acc[uid] = data.views[i];
      return acc;
    }, {});
    yield put(actions.receiveViews(views));
  }
}

function* fetchWatchingNow(uids) {
  uids = yield select(state => uids.filter(uid => recommended.getWatchingNow(uid, state.recommended) === -1));
  if (uids.length > 0) {
    const { data } = yield call(Api.watchingNow, uids);
    const views    = uids.reduce((acc, uid, i) => {
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

function* watchFetchViews() {
  yield takeLatest(types.FETCH_VIEWS, fetchViews);
}

export const sagas = [
  watchFetchRecommended,
  watchFetchViews,
];
