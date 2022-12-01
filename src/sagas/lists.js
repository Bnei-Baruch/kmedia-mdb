import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { filtersTransformer } from '../filters';
import Api from '../helpers/Api';
import {
  CT_COLLECTIONS,
  CT_DAILY_LESSON,
  CT_LESSON_PART,
  CT_LESSONS,
  CT_UNITS,
  CT_VIDEO_PROGRAM_CHAPTER,
  FN_CONTENT_TYPE,
  FN_SHOW_LESSON_AS_UNITS,
  PAGE_NS_EVENTS,
  PAGE_NS_LESSONS,
  PAGE_NS_SKETCHES
} from '../helpers/consts';
import { isEmpty } from '../helpers/utils';
import { selectors as filterSelectors } from '../redux/modules/filters';

import { actions, types } from '../redux/modules/lists';
import { actions as mdbActions } from '../redux/modules/mdb';
import { selectors as settings } from '../redux/modules/settings';
import { getQuery, pushQuery } from './helpers/url';
import { fetchCollectionsByIDs, fetchUnitsByIDs } from './mdb';
import { fetchViewsByUIDs } from './recommended';

const endpointByNamespace = {
  [PAGE_NS_LESSONS]: Api.lessons,
  [PAGE_NS_EVENTS]: Api.events,
  [PAGE_NS_SKETCHES]: Api.units
};

function* fetchList(action) {
  // eslint-disable-next-line prefer-const
  let { withViews = false, namespace, ...args } = action.payload;

  if (namespace.startsWith('intents')) {
    // Handle special case for search intents result, lessons or programs.
    args.with_files = true;
    if (args.content_type === 'lessons') {
      args.content_type = CT_LESSON_PART;
    } else {
      args.content_type = CT_VIDEO_PROGRAM_CHAPTER;
    }
  } else {
    const filters      = yield select(state => filterSelectors.getFilters(state.filters, namespace));
    const filterParams = filtersTransformer.toApiParams(filters) || {};
    args               = { ...args, ...filterParams };
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

// Todo david: patch for lesson page filters. Need replace on refactor filters when not select source, tag or person show as collection other as unit
function patchLessonFilters(filters) {
  const ctFilter = filters.find(f => f.name === FN_CONTENT_TYPE && !isEmpty(f.values));
  if (!ctFilter) return;
  const asUnit    = filters.some(f => FN_SHOW_LESSON_AS_UNITS.includes(f.name) && !isEmpty(f.values));
  ctFilter.values = ctFilter.values.map(ct => {
    if (CT_LESSONS.includes(ct)) {
      return asUnit ? CT_LESSON_PART : CT_DAILY_LESSON;
    }

    return ct;
  });
}

function* fetchSectionList(action) {
  const { namespace, ...args } = action.payload;

  const filters = yield select(state => filterSelectors.getFilters(state.filters, namespace));
  if (namespace === PAGE_NS_LESSONS) patchLessonFilters(filters);
  const filterParams = filtersTransformer.toApiParams(filters) || {};

  const language = yield select(state => settings.getLanguage(state.settings));

  try {
    const { data } = yield call(endpointByNamespace[namespace], { ...args, ...filterParams, language });
    if (!data.items && data.content_units) {
      data.items = [...data.content_units];
    }

    const { items } = data;

    const cuIDs = isEmpty(data.content_units) ? items.filter(x => CT_UNITS.includes(x.content_type)).map(x => x.id) : [];
    const cIDs  = items.filter(x => CT_COLLECTIONS.includes(x.content_type)).map(x => x.id);

    if (!isEmpty(cuIDs)) {
      yield fetchUnitsByIDs({ payload: { id: cuIDs } });
      yield fetchViewsByUIDs(cuIDs);
    }

    if (!isEmpty(data.content_units)) {
      yield put(mdbActions.fetchUnitsByIDsSuccess(data.content_units));
    }

    if (!isEmpty(cIDs)) {
      yield fetchCollectionsByIDs({ payload: { id: cIDs } });
    }

    yield put(actions.fetchSectionListSuccess(namespace, data));
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

function* watchFetchSectionList() {
  yield takeEvery(types.FETCH_SECTION_LIST, fetchSectionList);
}

function* watchSetPage() {
  yield takeLatest(types.SET_PAGE, updatePageInQuery);
}

export const sagas = [watchFetchList, watchFetchSectionList, watchSetPage];
