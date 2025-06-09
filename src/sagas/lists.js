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
  PAGE_NS_EVENTS,
  PAGE_NS_LESSONS,
  MY_NAMESPACE_HISTORY,
  PAGE_NS_SKETCHES
} from '../helpers/consts';
import { isEmpty } from '../helpers/utils';
import { selectors as filterSelectors } from '../redux/modules/filters';

import { actions, types } from '../redux/modules/lists';
import { actions as mbdActions, selectors as mdb } from '../redux/modules/mdb';
import { getQuery, pushQuery } from './helpers/url';
import { fetchCollectionsByIDs, fetchUnitsByIDs } from './mdb';
import { fetch as fetchMy } from './my';
import { fetchViewsByUIDs } from './recommended';
import { settingsGetContentLanguagesSelector, settingsGetUILangSelector } from '../redux/selectors';
import { checkIsLessonAsCollection } from './filtersAside';

const endpointByNamespace = {
  [PAGE_NS_LESSONS] : Api.lessons,
  [PAGE_NS_EVENTS]  : Api.events,
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

  const uiLang           = yield select(settingsGetUILangSelector);
  const contentLanguages = yield select(settingsGetContentLanguagesSelector);

  try {
    const { data } = yield call(Api.units, {
      ...args,
      ui_language      : uiLang,
      content_languages: contentLanguages
    });

    if (Array.isArray(data.content_units)) {
      yield put(mbdActions.receiveContentUnits(data.content_units));
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
  const asUnit    = !checkIsLessonAsCollection(filters);
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

  const uiLang           = yield select(settingsGetUILangSelector);
  const contentLanguages = yield select(settingsGetContentLanguagesSelector);

  try {
    const { data } = yield call(endpointByNamespace[namespace], {
      ...args,
      ...filterParams,
      ui_language      : uiLang,
      content_languages: contentLanguages
    });
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
      yield put(mbdActions.fetchUnitsByIDsSuccess({ data: data.content_units }));
    }

    yield put(actions.fetchSectionListSuccess(namespace, data));

    const cu_uids = [...cuIDs];
    if (!isEmpty(cIDs)) {
      yield call(fetchCollectionsByIDs, { payload: { id: cIDs } });
      const denormCcu = yield select(state => mdb.nestedGetDenormCollection(state.mdb));
      cIDs.map(denormCcu).filter(Boolean).map(x => x.cuIDs).flat().forEach(id => {
        cu_uids.push(id);
      });
    }

    yield fetchMy({ payload: { namespace: MY_NAMESPACE_HISTORY, cu_uids, page_size: cu_uids.length } });
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
  yield takeEvery(types['lists/fetchList'], fetchList);
}

function* watchFetchSectionList() {
  yield takeEvery(types['lists/fetchSectionList'], fetchSectionList);
}

function* watchSetPage() {
  yield takeLatest(types['lists/setPage'], updatePageInQuery);
}

export const sagas = [watchFetchList, watchFetchSectionList, watchSetPage];
