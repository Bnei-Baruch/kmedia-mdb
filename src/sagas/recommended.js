import { all, call, put, takeLatest, select } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { IsCollectionContentType, IsUnitContentType } from '../helpers/consts';
import { AB_RECOMMEND_NEW, AB_RECOMMEND_RANDOM } from '../helpers/ab-testing';
import { actions, types, selectors as recommended } from '../redux/modules/recommended';
import { actions as mdbActions, selectors as mdbSelectors } from '../redux/modules/mdb';
import { selectors as settings } from '../redux/modules/settings';
import { selectors as sourcesSelectors } from '../redux/modules/sources';
import { getSourcesCollections } from '../helpers/utils';
import {
  CT_LESSONS_SERIES,
  CT_TAG,
  UNIT_LESSONS_TYPE,
} from '../helpers/consts';

const WATCHING_NOW_MIN = 50;
const POPULAR_MIN      = 100;

export function* fetchRecommended(action) {
  const { id, content_type, tags, sources, collections, size, skip, variant } = action.payload;
  try {
    const isLesson = UNIT_LESSONS_TYPE.includes(content_type);
    const language = yield select(state => settings.getContentLanguage(state.settings));
    const skipUids = yield select(state => recommended.getSkipUids(state.recommended));
    const skipSet  = new Set(skipUids);
    skip.forEach(uid => {
      if (!skipSet.has(uid)) {
        skipUids.push(uid);
      }
    });
    const getPathById = yield select(state => sourcesSelectors.getPathByID(state.sources));
    const sourcesCollections = yield select(state => getSourcesCollections(sources, getPathById));

    const specs = [];  // Order important due to skip uids.
    if (variant === AB_RECOMMEND_NEW) {
      // Random Programs
      specs.push({
        'name': 'DataContentUnitsSuggester',
        'filters': [{ 'filter_selector': 1, 'args': ['VIDEO_PROGRAM'] }],
        'order_selector': 3,
      });
      if (isLesson) {
        sources.forEach(source => {
          // Same source.
          specs.push({
            'name': 'RoundRobinSuggester', 'specs': [
              {
                'name': 'DataContentUnitsSuggester',
                'filters': [{ 'filter_selector': 3 /* Sources */, 'args': [source] }, { 'filter_selector': 8 /* WatchingNowFilter */ }],
                'order_selector': 5  // WatchingNow
              },
              {
                'name': 'DataContentUnitsSuggester',
                'filters': [{ 'filter_selector': 3 /* Sources */, 'args': [source] }],
                'order_selector': 3  // Random
              },
              {
                'name': 'DataContentUnitsSuggester',
                'filters': [{ 'filter_selector': 3 /* Sources */, 'args': [source] }],
                'order_selector': 0  // Last
              },
            ]
          });
        });
        sourcesCollections.forEach(sourcesCollection => {
          // Same source collection.
          // NOTE: Currently it will take one-level-up as "Source Collection" which might not be what we want.
          // Sometimes we want to take several levels up such as with Zohar and more nested sources.
          // We have to try out and decide later on proper "Source Collection" definition.
          specs.push({
            'name': 'RoundRobinSuggester', 'specs': [
              {
                'name': 'DataContentUnitsSuggester',
                'filters': [{ 'filter_selector': 3 /* Sources */, 'args': sourcesCollection.children }, { 'filter_selector': 8 /* WatchingNowFilter */ }],
                'order_selector': 5  // WatchingNow
              },
              {
                'name': 'DataContentUnitsSuggester',
                'filters': [{ 'filter_selector': 3 /* Sources */, 'args': sourcesCollection.children }],
                'order_selector': 3  // Random
              },
              {
                'name': 'DataContentUnitsSuggester',
                'filters': [{ 'filter_selector': 3 /* Sources */, 'args': sourcesCollection.children }],
                'order_selector': 0  // Last
              },
            ]
          });
        });
      } else {
        // Same Topic - WatchingNow, Random, Latest.
        tags.forEach(tag => {
          specs.push({
            'name': 'RoundRobinSuggester', 'specs': [
              {
                'name': 'DataContentUnitsSuggester',
                'filters': [{ 'filter_selector': 2 /* Tags */, 'args': [tag] }, { 'filter_selector': 8 /* WatchingNowFilter */ }],
                'order_selector': 5  // WatchingNow
              },
              {
                'name': 'DataContentUnitsSuggester',
                'filters': [{ 'filter_selector': 2 /* Tags */, 'args': [tag] }],
                'order_selector': 0  // Random
              },
              {
                'name': 'DataContentUnitsSuggester',
                'filters': [{ 'filter_selector': 2 /* Tags */, 'args': [tag] }],
                'order_selector': 0  // Last
              },
            ]
          });
        });
        collections.forEach(collection => {
          // Same collection - WatchingNow, Random, Latest.
          specs.push({
            'name': 'RoundRobinSuggester', 'specs': [
              {
                'name': 'DataContentUnitsSuggester',
                'filters': [{ 'filter_selector': 4 /* Collections */, 'args': [collection.id] }, { 'filter_selector': 8 /* WatchingNowFilter */ }],
                'order_selector': 5  // WatchingNow
              },
              {
                'name': 'DataContentUnitsSuggester',
                'filters': [{ 'filter_selector': 4 /* Collections */, 'args': [collection.id] }],
                'order_selector': 3  // Random
              },
              {
                'name': 'DataContentUnitsSuggester',
                'filters': [{ 'filter_selector': 4 /* Collections */, 'args': [collection.id] }],
                'order_selector': 0  // Last
              },
            ]
          });
        });
      }
    } else if (variant === AB_RECOMMEND_RANDOM) {
      // Random Units
      specs.push({
        'name': 'DataContentUnitsSuggester',
        'order_selector': 3,
      });
    }

    if (variant !== AB_RECOMMEND_RANDOM) {
      specs.push({ name: 'Default' });
    }

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
        /*{ content_type: CT_SOURCE, uid: 'itcVAcFn' },*/     // Maamar Ha-Arvut
        /*{ content_type: CT_SOURCE, uid: 'qMUUn22b' },*/     // Shamati
        { content_type: CT_TAG, uid: 'sxxboapw' },            // Faith Above Reason
        { content_type: CT_LESSONS_SERIES, uid: 'dbPOMK0R' }, // Amuna lemala mahadaat 2021
        { content_type: CT_LESSONS_SERIES, uid: 'ReQUUOtN' }, // Ptiha - 2019
        /*{ content_type: CT_SOURCE, uid: 'grRABASH' },*/     // Group articles.
      ]);
    }

    if (Array.isArray(data.feeds) && data.feeds.length > 0) {
      const fetchList = [
        fetchMissingUnits(data.feeds.flat().filter(item => item && IsUnitContentType(item.content_type))),
        fetchMissingCollections(data.feeds.flat().filter(item => item && IsCollectionContentType(item.content_type))),
      ];
      const viewUids = new Set();
      for (let i = 0; i < data.feeds.length; ++i) {
        if (Array.isArray(data.feeds[i]) && data.feeds[i].length > 0) {
          data.feeds[i].forEach(f => viewUids.add(f.uid));
        }
      }

      fetchList.push(fetchViewsByUIDs(Array.from(viewUids)));

      if (variant === AB_RECOMMEND_NEW || variant === AB_RECOMMEND_RANDOM) {
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

    const feeds = variant === AB_RECOMMEND_RANDOM ? { 'random-units': data.feeds[0] } : { 'default': data.feeds[data.feeds.length - 1] };
    if (variant === AB_RECOMMEND_NEW) {
      let index = 0;
      feeds['random-programs'] = data.feeds[index];
      index++;
      if (isLesson) {
        sources.forEach(source => {
          feeds[`same-source-${source}`] = data.feeds[index];
          index++;
        });
        sourcesCollections.forEach(sourceCollection => {
          feeds[`same-source-collection-${sourceCollection.id}`] = data.feeds[index];
          index++;
        });
      } else {
        tags.forEach(tag => {
          feeds[`same-topic-${tag}`] = data.feeds[index];
          index++;
        });
        collections.forEach(collection => {
          feeds[`same-collection-${collection.id}`] = data.feeds[index];
          index++;
        });
      }

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
