import Api from '@/src/helpers/Api';
import { selectors as settings } from '../settingsSlice/settingsSlice';
import { selectors as filterSelectors } from '@/lib/redux/slices/filterSlice/filterSlice';
import { filtersTransformer } from 'lib/filters';
import { fetchViewsByUIDs } from '@/src/sagas/recommended';
import { fetchCollections, fetchLabels, fetchUnitsByIDs } from '@/lib/redux/slices/mdbSlice/thunks';
import { createAppAsyncThunk } from '@/lib/redux/createAppAsyncThunk';

export const fetchTags = createAppAsyncThunk(
  'tags/fetch',
  async (params, thunkAPI) => {
    const state        = thunkAPI.getState();
    const filters      = filterSelectors.getFilters(state.filters, 'publications-twitter');
    const filterParams = filtersTransformer.toApiParams(filters) || {};

    const uiLang           = settings.getUILang(state.settings);
    const contentLanguages = settings.getContentLanguages(state.settings);

    const { data } = Api.tagDashboard({
      ...params,
      ...filterParams,
      ui_language: uiLang,
      content_languages: contentLanguages,
    });

    const { items, media_total, text_total } = data;

    const cuIDs    = items.map(x => x.content_unit_id);
    const cIDs     = items.map(x => x.collection_id).filter(x => !!x);
    const labelIDs = items.map(x => x.label_id).filter(x => !!x);
    const list     = items.map(({ content_unit_id, label_id, collection_id, is_text }) => ({
      cuID: content_unit_id,
      cID: collection_id,
      lID: label_id,
      isText: is_text
    }));

    const requests = [];

    requests.push(fetchUnitsByIDs({ payload: { id: cuIDs } }));

    requests.push(fetchCollections({ payload: { id: cIDs } }));
    requests.push(fetchLabels({ payload: { id: labelIDs } }));
    requests.push(fetchViewsByUIDs(items.filter(x => !x.is_text).map(x => x.content_unit_id)));
    await Promise.all(requests);

    return ({ items: list, mediaTotal: media_total, textTotal: text_total });
  }
);
