import Api from '../../../../src/helpers/Api';
import { CT_ARTICLES } from '@/src/helpers/consts';
import { selectors as settings } from '../settingsSlice/settingsSlice';
import { selectors } from '@/lib/redux/slices/publicationsSlice/index';
import { filtersTransformer } from '../../../../src/filters';
import { selectors as filterSelectors } from '../../../../src/redux/modules/filters';
import { actions as mdbActions } from '../mdbSlice/mdbSlice';
import { isEmpty } from '@/src/helpers/utils';
import { createAppAsyncThunk } from '../../createAppAsyncThunk';

export const fetchTweets = createAppAsyncThunk(
  'publications/tweets',
  async (_, thunkAPI) => {
    const state   = thunkAPI.getState();
    const filters = filterSelectors.getFilters(state.filters, 'publications-twitter');
    const params  = filtersTransformer.toApiParams(filters) || {};

    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);
    const args             = {
      ...action.payload,
      ...params,
      ui_language: uiLang,
      content_languages: contentLanguages,
    };

    const { data } = await Api.tweets(args);
    return data;
  }
);

export const fetchBlogList = createAppAsyncThunk(
  'publications/blogList',
  async (_, thunkAPI) => {
    const state   = thunkAPI.getState();
    const filters = filterSelectors.getFilters(state.filters, 'publications-blog');
    const params  = filtersTransformer.toApiParams(filters) || {};

    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);
    const args             = {
      ...action.payload,
      ...params,
      ui_language: uiLang,
      content_languages: contentLanguages,
    };

    const { data } = await Api.tweets(args);
    return data;
  }
);

export const fetchBlogPost = createAppAsyncThunk(
  'publications/blogPost',
  async (params) => {
    const { blog, id } = params;
    const { data }     = await Api.post(blog, id);
    return data;
  }
);

export const fetchArticlesList = createAppAsyncThunk(
  'publications/articlesList',
  async (params, thunkAPI) => {
    if (params.namespace !== 'publications-articles') {
      return;
    }
    const state       = thunkAPI.getState();
    const collections = selectors.getCollections(state.publications);
    if (!isEmpty(collections)) {
      return;
    }

    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);
    const { data }         = await Api.collections({
      ui_language: uiLang,
      content_languages: contentLanguages,
      content_type: CT_ARTICLES,
      pageNo: 1,
      pageSize: 1000,
      with_units: false,
    });

    if (isEmpty(data.collections)) return;

    mdbActions.receiveCollections(data.collections);
    return data.collections;
  }
);
