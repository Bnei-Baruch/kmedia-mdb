import uniq from 'lodash/uniq';
import { all, call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';

import Api from '../../../../src/helpers/Api';
import {
  CT_DAILY_LESSON,
  CT_LESSONS,
  CT_LESSON_PART,
  FN_CONTENT_TYPE,
  FN_LANGUAGES,
  FN_SHOW_LESSON_AS_UNITS,
  PAGE_NS_LESSONS, CT_UNITS, CT_COLLECTIONS, MY_NAMESPACE_HISTORY,
} from '../../../../src/helpers/consts';
import { isEmpty } from '../../../../src/helpers/utils';
import { filtersTransformer } from '../../../filters';
import { selectors as filterSelectors } from './filterSlice';
import { selectors as settingsSelectors, selectors as settings } from '../settingsSlice/settingsSlice';
import { selectors as searchSelectors } from '../searchSlice/searchSlice';
import { actions, types, asideSlice } from './filterStatsSlice';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import { fetchUnitsByIDs, fetchCollectionsByIDs } from '../mdbSlice/thunks';
import { fetchViewsByUIDs } from '../../../../src/sagas/recommended';
import { actions as mdbActions, selectors as mdb } from '../mdbSlice';
import { fetch as fetchMy } from '../mySlice/thunks';

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

export const fetchStat = createAppAsyncThunk(
  'filters/fetchStat',
  async (payload, thunkAPI) => {

    const state = thunkAPI.getState();

    const { namespace, params, isPrepare } = payload;
    let { countC = false, countL = false }       = payload;

    let filterParams       = {};
    let lessonAsCollection = false;
    if (!isPrepare) {
      const filters = filterSelectors.getFilters(state.filters, namespace);
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

    filterParams.for_filter = true;

    filterParams  = { ...defaultStatParams, ...filterParams };
    const countCU = !filterParams.location;
    countC        = countC && !filterParams.person;
    countL        = countL && !filterParams.person;

    const requests = [];
    countCU && requests.push(Api.unitsStats({ ...filterParams, with_languages: false }));
    countC && requests.push(Api.collectionsStats({
      id: filterParams.collection, ...filterParams,
      with_languages: false
    }));
    countL && requests.push(Api.labelsStats(filterParams));

    if (isFilteredByBase) {
      const paramsPart = { ...filterParams, ...params, with_languages: false };
      countCU && requests.push(Api.unitsStats(paramsPart));
      countC && requests.push(Api.collectionsStats(paramsPart));
      countL && requests.push(Api.labelsStats(paramsPart));
    }

    lessonAsCollection && requests.push(Api.collectionsStats(prepareDailyLessonParams({ ...params })));

    const responses = await Promise.all(requests);

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

    asideSlice.actions.receiveLocationsStats({ locations, namespace, isPrepare });

    if (filterParams.with_languages) {
      fetchLanguageStat({ ...filterParams }, namespace, dataL.languages, isPrepare, countCU, countC);
    }
    return { dataCU, dataC, dataL, namespace, isPrepare };
  }
);

/**
 * stats of cu languages are too slow, so we call it separately
 * @param params
 * @param namespace
 * @param dataL if you have results of labels take from here
 * @param isPrepare
 * @param countC
 * @returns {Generator<*, void, *>}
 */
async function fetchLanguageStat(params, namespace, dataL = {}, isPrepare, countCU, countC) {
  setAllStatParamsFalse(params);
  params.with_languages = true;
  const requests        = [];
  countCU && requests.push(Api.unitsStats(params));
  countC && requests.push(Api.collectionsStats({ ...params, id: params.collection, }));

  const responses = await Promise.all(requests);

  const { data: { languages: dataCU } } = countCU ? responses.shift() : { data: false };
  const { data: { languages: dataC } }  = countC ? responses.shift() : { data: false };

  asideSlice.actions.receiveSingleTypeStats({ dataCU, dataC, dataL, namespace, isPrepare, fn: FN_LANGUAGES });
}

/*

export function* fetchElasticStat(action) {
  const filters          = yield select(state => filterSelectors.getFilters(state.filters, 'search'));
  const apiParams        = filtersTransformer.toApiParams(filters);
  const filterKeyValues  = Object.entries(apiParams).map(([v, k]) => `${v}:${k}`).join(' ');
  const filterParams     = filterKeyValues ? ` ${filterKeyValues}` : '';
  const uiLang           = yield select(state => settingsSelectors.getUILang(state.settings));
  const contentLanguages = yield select(state => settingsSelectors.getContentLanguages(state.settings));
  const query            = yield select(state => searchSelectors.getQuery(state.search));
  const q                = query.trim() ? `${query.trim()}${filterParams}` : filterParams;

  try {
    const { data } = yield call(Api.elasticStats, {
      q,
      ui_language: uiLang,
      content_languages: contentLanguages,
    });

    yield put(actions.fetchElasticStatsSuccess({ data, namespace: 'search' }));
  } catch (err) {
    yield put(actions.fetchElasticStatsFailure('search', err));
  }
}
*/

// TODO: Move search stats fetch parallel to search, not after.
export const fetchElasticStat = createAppAsyncThunk(
  'filters/fetchElasticStat',
  async (payload, thunkAPI) => {

    const state            = thunkAPI.getState();
    const filters          = filterSelectors.getFilters(state.filters, 'search');
    const apiParams        = filtersTransformer.toApiParams(filters);
    const filterKeyValues  = Object.entries(apiParams).map(([v, k]) => `${v}:${k}`).join(' ');
    const filterParams     = filterKeyValues ? ` ${filterKeyValues}` : '';
    const uiLang           = settingsSelectors.getUILang(state.settings);
    const contentLanguages = settingsSelectors.getContentLanguages(state.settings);
    const query            = searchSelectors.getQuery(state.search);
    const q                = query.trim() ? `${query.trim()}${filterParams}` : filterParams;

    const { data } = await Api.elasticStats({
      q,
      ui_language: uiLang,
      content_languages: contentLanguages,
    });

    return { data, namespace: 'search' };
  }
);
