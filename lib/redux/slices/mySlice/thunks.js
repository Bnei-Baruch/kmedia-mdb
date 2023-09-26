import { mySlice } from './mySlice';
import Api from '../../../../src/helpers/Api';
import { selectors as authSelectors } from '../authSlice/authSlice';
import { mdbSlice, selectors as mdbSelectors } from '../mdbSlice/mdbSlice';
import {
  IsCollectionContentType,
  MY_NAMESPACE_BOOKMARKS,
  MY_NAMESPACE_HISTORY,
  MY_NAMESPACE_PLAYLISTS,
  MY_NAMESPACE_REACTIONS,
  MY_NAMESPACE_SUBSCRIPTIONS
} from '@/src/helpers/consts';
import { updateQuery } from '@/src/sagas/helpers/url';
import { selectors as settings } from '../settingsSlice/settingsSlice';
import { fetchViewsByUIDs } from '@/src/sagas/recommended';
import { createAppAsyncThunk } from '@/lib/redux/createAppAsyncThunk';

function* updatePageInQuery(action) {
  const { pageNo } = action.payload;
  const page       = pageNo > 1 ? pageNo : null;
  yield* updateQuery(query => Object.assign(query, { page }));
}

export const fetchMy = createAppAsyncThunk(
  'my/fetch',
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();

    // eslint-disable-next-line prefer-const
    const { namespace, with_files = false, addToList = true, ...params } = payload;

    const token = authSelectors.getToken(state.auth);
    if (!token) {
      return { namespace, items: [] };
    }

    let with_derivations = false;

    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);
    const { data }         = await Api.my(namespace, params, token);
    if (!data?.items) {
      return { namespace, items: [] };
    }

    let cu_uids = [];
    let co_uids = [];

    switch (namespace) {
      case MY_NAMESPACE_HISTORY:
        cu_uids = data.items?.map(x => x.content_unit_uid) || [];
        break;
      case MY_NAMESPACE_REACTIONS:
        cu_uids = data.items?.filter(x => !IsCollectionContentType(x.subject_type)).map(x => x.subject_uid) || [];
        break;
      case MY_NAMESPACE_PLAYLISTS:
        if (data.items) {
          cu_uids = data.items.filter(p => p.items)
            .reduce((acc, p) => acc.concat(p.items.flatMap(x => x.poster_unit_uid)), []);
        }

        cu_uids.concat(data.items.map(x => x.content_unit_uid).filter(x => !!x));
        break;
      case MY_NAMESPACE_SUBSCRIPTIONS:
        cu_uids = data.items?.map(x => x.content_unit_uid) || [];
        co_uids = data.items?.filter(s => s.collection_uid).map(s => s.collection_uid) || [];
        break;
      case MY_NAMESPACE_BOOKMARKS:
        cu_uids          = data.items?.map(x => x.subject_uid) || [];
        with_derivations = true;
        break;
      default:
    }

    cu_uids = mdbSelectors.skipFetchedCU(state.mdb, cu_uids, with_files);
    co_uids = mdbSelectors.skipFetchedCO(state.mdb, co_uids);
    if (cu_uids.length > 0) {
      const args = {
        id: cu_uids,
        pageSize: cu_uids.length,
        with_files,
        with_derivations,
        ui_language: uiLang,
        content_languages: contentLanguages,
      };

      const { data: { content_units } } = await Api.units(args);
      thunkAPI.dispatch(mdbSlice.actions.receiveContentUnits(content_units));
    }

    if (co_uids.length > 0) {
      const args = {
        id: co_uids,
        pageSize: co_uids.length,
        ui_language: uiLang,
        content_languages: contentLanguages,
      };

      const { data: { collections } } = await Api.collections(args);
      thunkAPI.dispatch(mdbSlice.actions.receiveCollections(collections));
    }

    try {
      thunkAPI.dispatch(fetchViewsByUIDs(cu_uids));
    } catch (err) {
      console.error('error on recommendation service', err);
    }
    return { namespace, addToList, ...data };
  }
);

export const fetchOne = createAppAsyncThunk(
  'my/fetchOne',
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();

    const { namespace, ...params } = payload;
    const token                    = authSelectors.getToken(state.auth);
    if (!token) {
      return { namespace, item: {} };
    }
    if (!params?.id) return { namespace, item: {} };

    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);

    const { data } = await Api.my(namespace, params, token);

    let cu_uids = [];
    switch (namespace) {
      case MY_NAMESPACE_PLAYLISTS:
        cu_uids = data.items?.map(x => x.content_unit_uid) || [];
        break;
      default:
    }

    if (cu_uids.length > 0) {
      const args = {
        id: cu_uids,
        pageSize: cu_uids.length,
        with_files: true,
        ui_language: uiLang,
        content_languages: contentLanguages,
      };

      const { data: { content_units } } = await Api.units(args);
      thunkAPI.dispatch(mdbSlice.actions.receiveContentUnits(content_units));
    }

    return { namespace, item: data };
  }
);
export const addMy    = createAppAsyncThunk(
  'my/add',
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();

    const { namespace, ...params } = payload;
    const token                    = authSelectors.getToken(state.auth);
    if (!token) {
      return { namespace, item: {} };
    }

    const { data } = await Api.my(namespace, params, token, 'POST');
    return { namespace, item: data };
  }
);

export const editMy = createAppAsyncThunk(
  'my/edit',
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();

    const { namespace, ...params } = payload;
    const token                    = authSelectors.getToken(state.auth);
    if (!token) {
      return { namespace, item: {} };
    }

    const { data } = await Api.my(namespace, params, token, 'PUT');
    return { namespace, item: data, changeItems: payload.changeItems };
  }
);

export const removeMy = createAppAsyncThunk(
  'my/remove',
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();

    const { namespace, ...params } = payload;
    const token                    = authSelectors.getToken(state.auth);
    if (!token) {
      return { namespace, item: {} };
    }

    const { data } = await Api.my(namespace, params, token, 'DELETE');
    if (namespace === MY_NAMESPACE_PLAYLISTS && action.payload.changeItems) {
      thunkAPI.dispatch(mySlice.actions.fetchOneSuccess({ namespace, item: data }));
    } else {
      thunkAPI.dispatch(mySlice.actions.removeSuccess({ namespace, key }));
    }
  }
);

export const reactionsCount = createAppAsyncThunk(
  'my/reactionsCount',
  async (payload) => {
    const { data } = await Api.reactionsCount(payload);
    return data;
  }
);
