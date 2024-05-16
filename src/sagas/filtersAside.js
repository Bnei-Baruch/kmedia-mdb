import uniq from 'lodash/uniq';
import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import {
  FN_LANGUAGES,
  FN_SHOW_LESSON_AS_UNITS,
  PAGE_NS_LESSONS,
  CT_LESSONS,
  FN_COLLECTION_MULTI,
} from '../helpers/consts';
import { isEmpty } from '../helpers/utils';
import { filtersTransformer } from '../filters';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { selectors as settingsSelectors } from '../redux/modules/settings';
import { selectors as searchSelectors } from '../redux/modules/search';
import { actions, types } from '../redux/modules/filtersAside';
import { settingsGetUILangSelector, settingsGetContentLanguagesSelector } from '../redux/selectors';
import { actions as mdbActions } from '../redux/modules/mdb';

const RESULT_NAME_BY_PARAM = {
  'tag': 'tags', 'source': 'sources', 'author': 'sources', 'content_type': 'content_types'
};
const defaultStatParams    = {
  with_sources           : true,
  with_tags              : true,
  with_collections       : false,
  with_languages         : true,
  with_content_types     : true,
  with_persons           : false,
  with_original_languages: false,
  with_media             : false,
  with_locations         : false,
  with_day_part          : false,
};

const setAllStatParamsFalse = params => {
  params.with_sources            = false;
  params.with_tags               = false;
  params.with_collections        = false;
  params.with_persons            = false;
  params.with_media              = false;
  params.with_original_languages = false;
  params.with_locations          = false;
  params.with_languages          = false;
  params.with_content_types      = false;
  params.with_day_part           = false;
  params.media_language && delete params.media_language;
  return params;
};

export function checkIsLessonAsCollection(filters) {
  return !filters?.some(f => FN_SHOW_LESSON_AS_UNITS.includes(f.name) && !isEmpty(f.values));
}

export function* fetchStat(action) {
  const { namespace, options: { isPrepare } }         = action.payload;
  const { params }                                    = action.payload;
  let { options: { countC = false, countL = false } } = action.payload;

  let filterParams       = {};
  let lessonAsCollection = false;

  const filters = yield select(state => filterSelectors.getFilters(state.filters, namespace));
  if (!isPrepare) {
    filterParams = filtersTransformer.toApiParams(filters) || {};
  }

  if (namespace === PAGE_NS_LESSONS) {
    lessonAsCollection        = checkIsLessonAsCollection(filters);
    filterParams.content_type = [...params.content_type, ...CT_LESSONS];
  }

  //need when was filtered by base param (for example filter by topics on the topic page)
  let isFilteredByBase = false;
  Object.keys(params).forEach(p => {
    if (filterParams[p]) {
      filterParams[p]  = filterParams[p].filter(x => params[p] !== x);
      isFilteredByBase = filterParams[p].length > 0;
    } else {
      filterParams[p] = params[p];
    }
  });

  try {
    filterParams.for_filter = true;

    filterParams  = { ...defaultStatParams, ...filterParams };
    const countCU = !filterParams.location;
    countC        = countC && !filterParams.person;
    countL        = countL && !filterParams.person;

    const requests = [];
    countCU && requests.push(call(Api.unitsStats, { ...filterParams, with_languages: false }));
    countC && requests.push(call(Api.collectionsStats, {
      id            : filterParams.collection, ...filterParams,
      with_languages: false
    }));
    countL && requests.push(call(Api.labelsStats, filterParams));

    if (isFilteredByBase) {
      const paramsPart = { ...filterParams, ...params, with_languages: false };
      countCU && requests.push(call(Api.unitsStats, paramsPart));
      countC && requests.push(call(Api.collectionsStats, paramsPart));
      countL && requests.push(call(Api.labelsStats, paramsPart));
    }

    const responses = yield all(requests);

    const dataCU                            = countCU ? responses.shift()?.data : {};
    const { data: { locations, ...dataC } } = countC ? responses.shift() : { data: {} };
    const dataL                             = countL ? responses.shift()?.data : {};

    if (isFilteredByBase) {
      const dataCUPart                            = countCU ? responses.shift()?.data : {};
      const { data: { locations, ...dataCPart } } = countC ? responses.shift() : { data: {} };
      const dataLPart                             = countL ? responses.shift()?.data : {};

      uniq(Object.keys(params).map(x => RESULT_NAME_BY_PARAM[x])).forEach(n => {
        dataCU[n] = dataCUPart[n];
        dataC[n]  = dataCPart[n];
        dataL[n]  = dataLPart[n];
      });
    }

    if (lessonAsCollection) {
      dataCU['day_part'] = {};
    } else if (namespace === PAGE_NS_LESSONS) {
      dataC['day_part'] = {};
    }

    yield put(actions.receiveLocationsStats({ locations, namespace, isPrepare }));
    yield put(actions.fetchStatsSuccess({ dataCU, dataC, dataL, namespace, isPrepare }));

    if (filterParams.with_languages) {
      yield fetchLanguageStat({ ...filterParams }, namespace, dataL.languages, isPrepare, countCU, countC);
    }
  } catch (err) {
    yield put(actions.fetchStatsFailure(namespace, err));
  }
}

/**
 * stats of cu languages are too slow, so we call it separately
 * @param params
 * @param namespace
 * @param dataL if you have results of labels take from here
 * @param isPrepare
 * @param countC
 * @returns {Generator<*, void, *>}
 */
export function* fetchLanguageStat(params, namespace, dataL = {}, isPrepare, countCU, countC) {
  setAllStatParamsFalse(params);
  params.with_languages = true;
  try {
    const requests = [];
    countCU && requests.push(call(Api.unitsStats, params));
    countC && requests.push(call(Api.collectionsStats, { ...params, id: params.collection, }));

    const responses = yield all(requests);

    const { data: { languages: dataCU } } = countCU ? responses.shift() : { data: false };
    const { data: { languages: dataC } }  = countC ? responses.shift() : { data: false };

    yield put(actions.receiveSingleTypeStats({ dataCU, dataC, dataL, namespace, isPrepare, fn: FN_LANGUAGES }));
  } catch (err) {
    yield put(actions.fetchStatsFailure(namespace, err));
  }
}

export function* fetchElasticStat(action) {
  const filters          = yield select(state => filterSelectors.getFilters(state.filters, 'search'));
  const apiParams        = filtersTransformer.toApiParams(filters);
  const filterKeyValues  = Object.entries(apiParams).map(([v, k]) => `${v}:${k}`).join(' ');
  const filterParams     = filterKeyValues ? ` ${filterKeyValues}` : '';
  const uiLang           = yield select(settingsGetUILangSelector);
  const contentLanguages = yield select(state => settingsSelectors.getContentLanguages(state.settings));
  const query            = yield select(state => searchSelectors.getQuery(state.search));
  const q                = query.trim() ? `${query.trim()}${filterParams}` : filterParams;

  try {
    const { data } = yield call(Api.elasticStats, {
      q,
      ui_language      : uiLang,
      content_languages: contentLanguages,
    });

    yield put(actions.fetchElasticStatsSuccess({ data, namespace: 'search' }));
  } catch (err) {
    yield put(actions.fetchElasticStatsFailure('search', err));
  }
}

export function* collectionsByCt(action) {
  const { content_type, namespace } = action.payload;
  try {
    const uiLang                    = yield select(settingsGetUILangSelector);
    const contentLanguages          = yield select(settingsGetContentLanguagesSelector);
    const result                    = yield call(Api.collections, {
      ...action.payload,
      ui_language      : uiLang,
      content_languages: contentLanguages,
      page_size        : 1000,
      content_type
    });
    const { data: { collections } } = result;
    yield put(mdbActions.receiveCollections(collections));
    yield put(mdbActions.receiveCollectionsByCt({ collections, content_type }));

    const filters           = yield select(state => filterSelectors.getFilters(state.filters, namespace));
    const params            = setAllStatParamsFalse(filtersTransformer.toApiParams(filters) || {});
    params.with_collections = true;
    params.collection      = collections.map(x => x.id);
    const { data }          = yield call(Api.unitsStats, params);
    yield put(actions.receiveSingleTypeStats({ dataCU: data.collections, namespace, isPrepare: true, fn: FN_COLLECTION_MULTI }));
  } catch (err) {
    console.error(err);
  }
}

function* watchFetchStat() {
  yield takeEvery(types['filters_aside/fetchStats'], fetchStat);
}

function* watchElasticFetchStat() {
  // TODO: Move search stats fetch parallel to search, not after.
  yield takeLatest(types['filters_aside/fetchElasticStats'], fetchElasticStat);
}

function* watchCollectionsByCt() {
  yield takeEvery(types['filters_aside/collectionsByCt'], collectionsByCt);
}

export const sagas = [
  watchFetchStat,
  watchElasticFetchStat,
  watchCollectionsByCt,
];
