import { filtersTransformer } from '../../../filters';
import Api from '@/src/helpers/Api';
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
  MY_NAMESPACE_HISTORY,
  PAGE_NS_SKETCHES
} from '@/src/helpers/consts';
import { isEmpty } from '@/src/helpers/utils';
import { selectors as filterSelectors } from '../filterSlice/filterSlice';
import { actions as mdbActions, selectors as mdb } from '../mdbSlice/mdbSlice';
import { selectors as settings } from '../settingsSlice/settingsSlice';
import { getQuery, pushQuery } from '@/src/sagas/helpers/url';
import { fetchCollectionsByIDs, fetchUnitsByIDs } from '../mdbSlice/thunks';
import { fetchMy } from '../mySlice/thunks';
import { fetchViewsByUIDs } from '@/src/sagas/recommended';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';
import { toApiParams } from '@/lib/filters/helper';

const endpointByNamespace = {
  [PAGE_NS_LESSONS]: Api.lessons,
  [PAGE_NS_EVENTS]: Api.events,
  [PAGE_NS_SKETCHES]: Api.units
};

export const fetchList = createAppAsyncThunk(
  'list/fetch',
  async (payload, thunkAPI) => {

    // eslint-disable-next-line prefer-const
    let { withViews = false, namespace, ...args } = payload;

    const state = thunkAPI.getState();

    if (namespace.startsWith('intents')) {
      // Handle special case for search intents result, lessons or programs.
      args.with_files = true;
      if (args.content_type === 'lessons') {
        args.content_type = CT_LESSON_PART;
      } else {
        args.content_type = CT_VIDEO_PROGRAM_CHAPTER;
      }
    } else {
      const filters      = filterSelectors.getFilters(state.filters, namespace);
      const filterParams = filtersTransformer.toApiParams(filters) || {};
      args               = { ...args, ...filterParams };
    }

    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);
    const { data }         = await Api.units({ ...args, ui_language: uiLang, content_languages: contentLanguages, });

    if (Array.isArray(data.content_units)) {
      mdbActions.receiveContentUnits(data.content_units);
    }

    if (withViews) {
      fetchViewsByUIDs(data.content_units?.map(x => x.id));
    }

    return { namespace, data };
  }
);

//if on lessons page selected one of filters display CUs if not display as collections
function patchLessonFilters(filters) {
  if (isEmpty(filters?.[FN_CONTENT_TYPE])) return;
  const asUnit = Object.keys(filters).some(k => FN_SHOW_LESSON_AS_UNITS.includes(k) && !isEmpty(filters[k]));
  filters[FN_CONTENT_TYPE].forEach((ct, i) => {
    if (CT_LESSONS.includes(ct)) {
      filters[FN_CONTENT_TYPE][i] = asUnit ? CT_LESSON_PART : CT_DAILY_LESSON;
    }
  });
}

export const fetchSectionList = createAppAsyncThunk(
  'list/fetchSection',
  async (payload, thunkAPI) => {

    const { namespace, ...args } = payload;

    const state = thunkAPI.getState();

    const filters = filterSelectors.getNSFilters(state.filters, namespace);
    if (namespace === PAGE_NS_LESSONS) patchLessonFilters(filters);
    const filterParams = toApiParams(filters);

    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);

    const { data } = await endpointByNamespace[namespace]({
      ...args,
      ...filterParams,
      ui_language: uiLang,
      content_languages: contentLanguages,
    });
    if (!data.items && data.content_units) {
      data.items = [...data.content_units];
    }

    const { items } = data;

    const cuIDs = isEmpty(data.content_units) ? items.filter(x => CT_UNITS.includes(x.content_type)).map(x => x.id) : [];
    const cIDs  = items.filter(x => CT_COLLECTIONS.includes(x.content_type)).map(x => x.id);

    if (!isEmpty(cuIDs)) {
      await thunkAPI.dispatch(fetchUnitsByIDs({ payload: { id: cuIDs } }));
      await fetchViewsByUIDs(cuIDs);
    }

    if (!isEmpty(data.content_units)) {
      thunkAPI.dispatch(mdbActions.actions.fetchUnitsByIDsSuccess(data.content_units));
    }

    const cu_uids = [...cuIDs];
    if (!isEmpty(cIDs)) {
      await thunkAPI.dispatch(fetchCollectionsByIDs({ payload: { id: cIDs } }));
      const stateMdb = thunkAPI.getState().mdb;
      cIDs
        .map(id => {
          return mdb.getDenormCollection(stateMdb, id);
        })
        .map(x => {
          return x.cuIDs;
        }).flat()
        .forEach(id => {
          cu_uids.push(id);
        });
    }

    // thunkAPI.dispatch(fetchMy({ namespace: MY_NAMESPACE_HISTORY, cu_uids, page_size: cu_uids.length }));
    return { namespace, data };
  }
);

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
