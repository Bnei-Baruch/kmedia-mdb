import uniq from 'lodash/uniq';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { filtersTransformer } from '../filters';
import Api from '../helpers/Api';
import { FN_LANGUAGES } from '../helpers/consts';
import { selectors as filterSelectors } from '../redux/modules/filters';

import { actions, types } from '../redux/modules/filtersAside';

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
  with_countries: false,
};

export function* fetchStat(action) {
  let { namespace, params, options: { isPrepare, countC = false, countL = false } } = action.payload;

  let filterParams = {};
  if (!isPrepare) {
    const filters = yield select(state => filterSelectors.getFilters(state.filters, namespace));
    filterParams  = filtersTransformer.toApiParams(filters) || {};
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

    filterParams = { ...defaultStatParams, ...filterParams };
    countC       = countC && !filterParams.person;
    countL       = countL && !filterParams.person;

    const requests = [];
    requests.push(call(Api.unitsStats, { ...filterParams, with_languages: false }));
    countC && requests.push(call(Api.collectionsStats, { id: filterParams.collection, ...filterParams }));
    countL && requests.push(call(Api.labelsStats, filterParams));

    if (isFilteredByBase) {
      const paramsPart = { ...filterParams, ...params };
      requests.push(call(Api.unitsStats, paramsPart));
      countC && requests.push(call(Api.collectionsStats, paramsPart));
      countL && requests.push(call(Api.labelsStats, paramsPart));
    }

    const responses = yield all(requests);

    const { data: dataCU } = responses.shift();
    const dataC            = countC ? responses.shift()?.data : {};
    const dataL            = countL ? responses.shift()?.data : {};

    if (isFilteredByBase) {
      const { data: dataCUPart = {} } = responses.shift() || {};
      const dataCPart                 = countC ? responses.shift()?.data : {};
      const dataLPart                 = countL ? responses.shift()?.data : {};

      uniq(Object.keys(params).map(x => RESULT_NAME_BY_PARAM[x])).forEach(n => {
        dataCU[n] = dataCUPart[n];
        dataC[n]  = dataCPart[n];
        dataL[n]  = dataLPart[n];
      });
    }

    yield put(actions.fetchStatsSuccess({ dataCU, dataC, dataL, namespace, isPrepare }));

    if (filterParams.with_languages && !isPrepare) {
      yield fetchLanguageStat({ ...filterParams }, namespace, dataC.languages, dataL.languages, isPrepare);
    }
  } catch (err) {
    yield put(actions.fetchStatsFailure(namespace, err));
  }
}

/**
 * stats of cu languages are too slow, so we call it separately
 * @param params
 * @param namespace
 * @param dataC if you have results of collections take from here
 * @param dataL if you have results of labels take from here
 * @param isPrepare
 * @returns {Generator<*, void, *>}
 */
export function* fetchLanguageStat(params, namespace, dataC = {}, dataL = {}, isPrepare) {
  params.with_sources            = false;
  params.with_tags               = false;
  params.with_collections        = false;
  params.with_content_types      = false;
  params.with_persons            = false;
  params.with_media              = false;
  params.with_original_languages = false;
  params.with_countries          = false;

  params.with_languages = true;
  params['media_language'] && delete params['media_language'];
  try {
    const { data: { languages: dataCU } } = yield call(Api.unitsStats, params);

    yield put(actions.receiveSingleTypeStats({ dataCU, dataC, dataL, namespace, isPrepare, fn: FN_LANGUAGES }));
  } catch (err) {
    yield put(actions.fetchStatsFailure(namespace, err));
  }
}

function* watchFetchStat() {
  yield takeEvery(types.FETCH_STATS, fetchStat);
}

export const sagas = [watchFetchStat];
