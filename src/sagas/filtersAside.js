import uniq from 'lodash/uniq';
import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import {
  CT_DAILY_LESSON,
  CT_LESSONS,
  CT_LESSON_PART,
  FN_CONTENT_TYPE,
  FN_LANGUAGES,
  FN_SHOW_LESSON_AS_UNITS,
  PAGE_NS_LESSONS,
} from '../helpers/consts';
import { isEmpty } from '../helpers/utils';
import { filtersTransformer } from '../filters';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { selectors as settingsSelectors } from '../redux/modules/settings';
//import { selectFilterParams } from './search';
import { selectors as searchSelectors } from '../redux/modules/search';
import { actions, types } from '../redux/modules/filtersAside';
import { types as searchTypes } from '../redux/modules/search';

const RESULT_NAME_BY_PARAM = {
  'tag': 'tags', 'source': 'sources', 'author': 'sources', 'content_type': 'content_types'
};
const defaultStatParams    = {
  with_sources: true,
  with_tags: true,
  with_collections: false,
  with_languages: true,
  with_content_types: true,
  with_persons: false,
  with_original_languages: false,
  with_media: false,
  with_locations: false,
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
  params.media_language && delete params.media_language;
  return params;
};

function patchLessonFilters(filters) {
  const ctFilter = filters.find(f => f.name === FN_CONTENT_TYPE && !isEmpty(f.values));
  if (ctFilter) {
    ctFilter.values = ctFilter.values.map(ct => (CT_LESSONS.includes(ct)) ? CT_LESSON_PART : ct);
  }

  return !filters.some(f => FN_SHOW_LESSON_AS_UNITS.includes(f.name) && !isEmpty(f.values));
}

function prepareDailyLessonParams(params) {
  setAllStatParamsFalse(params);
  params.with_content_types = true;
  params.content_type       = [...params.content_type.filter(ct => ct === CT_LESSON_PART), CT_DAILY_LESSON];
  return params;
}

export function* fetchStat(action) {
  let { namespace, params, options: { isPrepare, countC = false, countL = false } } = action.payload;

  let filterParams       = {};
  let lessonAsCollection = false;
  if (!isPrepare) {
    const filters = yield select(state => filterSelectors.getFilters(state.filters, namespace));
    if (namespace === PAGE_NS_LESSONS)
      lessonAsCollection = patchLessonFilters(filters);

    filterParams = filtersTransformer.toApiParams(filters) || {};
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
      id: filterParams.collection, ...filterParams,
      with_languages: false
    }));
    countL && requests.push(call(Api.labelsStats, filterParams));

    if (isFilteredByBase) {
      const paramsPart = { ...filterParams, ...params, with_languages: false };
      countCU && requests.push(call(Api.unitsStats, paramsPart));
      countC && requests.push(call(Api.collectionsStats, paramsPart));
      countL && requests.push(call(Api.labelsStats, paramsPart));
    }

    lessonAsCollection && requests.push(call(Api.collectionsStats, prepareDailyLessonParams({ ...params })));

    const responses = yield all(requests);

    const dataCU                            = countCU ? responses.shift()?.data : {};
    const { data: { locations, ...dataC } } = countC ? responses.shift() : { data: false };
    const dataL                             = countL ? responses.shift()?.data : {};

    if (isFilteredByBase) {
      const dataCUPart                            = countCU ? responses.shift()?.data : {};
      const { data: { locations, ...dataCPart } } = countC ? responses.shift() : {};
      const dataLPart                             = countL ? responses.shift()?.data : {};

      uniq(Object.keys(params).map(x => RESULT_NAME_BY_PARAM[x])).forEach(n => {
        dataCU[n] = dataCUPart[n];
        dataC[n]  = dataCPart[n];
        dataL[n]  = dataLPart[n];
      });
    }

    if (lessonAsCollection) {
      const ct           = responses.shift()?.data.content_type;
      dataC.content_type = { ...ct, ...dataC.content_type };
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
  const filters         = yield select(state => filterSelectors.getFilters(state.filters, 'search'));
  const apiParams       = filtersTransformer.toApiParams(filters);
  const filterKeyValues = Object.entries(apiParams).map(([v, k]) => `${v}:${k}`).join(' ');
  const filterParams    = filterKeyValues ? ` ${filterKeyValues}` : '';
  const language        = yield select(state => settingsSelectors.getLanguage(state.settings));
  const query           = yield select(state => searchSelectors.getQuery(state.search));
  const q               = query.trim() ? `${query.trim()}${filterParams}` : filterParams;

  try {
    const { data } = yield call(Api.elasticStats, { q, language });

    yield put(actions.fetchElasticStatsSuccess({ data, namespace: 'search' }));
  } catch (err) {
    yield put(actions.fetchElasticStatsFailure('search', err));
  }
}

function* watchFetchStat() {
  yield takeEvery(types.FETCH_STATS, fetchStat);
}

function* watchElasticFetchStat() {
  yield takeLatest([
    searchTypes.SEARCH,
    types.FETCH_ELASTIC_STATS,
  ], fetchElasticStat);
}

export const sagas = [
  watchFetchStat,
  watchElasticFetchStat,
];
