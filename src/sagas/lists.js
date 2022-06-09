import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { filtersTransformer } from '../filters';
import Api from '../helpers/Api';
import { COLLECTION_LESSONS_TYPE, CT_VIDEO_PROGRAM_CHAPTER, UNIT_LESSONS_TYPE } from '../helpers/consts';
import { isEmpty } from '../helpers/utils';
import { selectors as filterSelectors } from '../redux/modules/filters';

import { actions, types } from '../redux/modules/lists';
import { actions as mdbActions } from '../redux/modules/mdb';
import { selectors as settings } from '../redux/modules/settings';
import { getQuery, pushQuery } from './helpers/url';
import { fetchCollectionsByIDs, fetchUnitsByIDs } from './mdb';
import { fetchViewsByUIDs } from './recommended';

function* fetchList(action) {
  let { withViews = false, namespace, ...args } = action.payload;

  if (namespace.startsWith('intents')) {
    args.with_files = true;
    if (args.content_type === 'lessons') {
      args.content_type && delete args.content_type;
    } else {
      args.content_type = CT_VIDEO_PROGRAM_CHAPTER;
    }
  } else {
    const filters      = yield select(state => filterSelectors.getFilters(state.filters, namespace));
    const filterParams = filtersTransformer.toApiParams(filters) || {};
    args               = { ...args, filterParams };
  }

  const language = yield select(state => settings.getLanguage(state.settings));

  try {
    const { data } = yield call(Api.units, { ...args, language });

    if (Array.isArray(data.content_units)) {
      yield put(mdbActions.receiveContentUnits(data.content_units));
    }

    if (withViews) {
      yield fetchViewsByUIDs(data.content_units?.map(x => x.id));
    }

    yield put(actions.fetchListSuccess(namespace, data));
  } catch (err) {
    yield put(actions.fetchListFailure(namespace, err));
  }
}

function* fetchListLessons(action) {
  const { withViews = false, namespace, ...args } = action.payload;

  const filters      = yield select(state => filterSelectors.getFilters(state.filters, namespace));
  const filterParams = filtersTransformer.toApiParams(filters) || {};

  const language = yield select(state => settings.getLanguage(state.settings));

  try {
    const { data: { items, content_units, total } } = yield call(Api.lessons, { ...args, ...filterParams, language });

    let cuIDs;
    let cuIDsView;
    let cIDs;
    const data = { total, items };

    if (content_units) {
      data.items = content_units;
      cuIDsView  = content_units.map(x => x.id);
      yield put(mdbActions.receiveContentUnits(content_units));
    } else {
      cuIDs     = items.filter(x => UNIT_LESSONS_TYPE.includes(x.content_type)).map(x => x.id);
      cIDs      = items.filter(x => COLLECTION_LESSONS_TYPE.includes(x.content_type)).map(x => x.id);
      cuIDsView = cuIDs;
    }

    if (!isEmpty(cuIDs)) {
      yield fetchUnitsByIDs({ payload: { id: cuIDs } });
    }

    if (!isEmpty(cIDs)) {
      yield fetchCollectionsByIDs({ payload: { id: cIDs } });
    }

    if (withViews) {
      yield fetchViewsByUIDs(cuIDsView);
    }

    yield put(actions.fetchListLessonsSuccess(namespace, data));
  } catch (err) {
    yield put(actions.fetchListFailure(namespace, err));
  }
}

function* updatePageInQuery(action) {
  const { pageNo }   = action.payload;
  const currentQuery = yield* getQuery();
  const page         = currentQuery.page || 1;
  if (pageNo === +page) {
    return;
  }

  yield* pushQuery(query => {
    if (pageNo > 0) {
      return { ...query, page: pageNo };
    }

    const { _page, ...result } = query;
    return result;
  });
}

function* watchFetchList() {
  yield takeEvery(types.FETCH_LIST, fetchList);
}

function* watchFetchListLessons() {
  yield takeEvery(types.FETCH_LIST_LESSONS, fetchListLessons);
}

function* watchSetPage() {
  yield takeLatest(types.SET_PAGE, updatePageInQuery);
}

export const sagas = [watchFetchList, watchFetchListLessons, watchSetPage];
