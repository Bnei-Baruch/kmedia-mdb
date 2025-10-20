import { actions as sources } from '../../redux/modules/sources';
import { actions as tagsActions } from '../../redux/modules/tags';
import { actions as publicationsActions } from '../../redux/modules/publications';
import { actions as mdbActions } from '../../redux/modules/mdb';
import { actions as textPageActions } from '../../redux/modules/textPage';
import { actions as assetsActions } from '../../redux/modules/assets';
import {
  sourcesGetSourceByIdSelector,
  textPageGetFileSelector,
  settingsGetContentLanguagesSelector
} from '../../redux/selectors';
import { getQuery } from '../../helpers/url';
import { isEmpty } from '../../helpers/utils';
import { selectors as settings } from '../../redux/modules/settings';
import * as textPageSagas from '../../sagas/textPage';
import * as assetsSagas from '../../sagas/assets';
import Api from '../../helpers/Api';

/**
 * Finds first leaf node in source tree
 */
function firstLeafId(sourceId, state) {
  const source = sourcesGetSourceByIdSelector(state)(sourceId);
  if (isEmpty(source?.children)) {
    return sourceId;
  }
  return firstLeafId(source.children[0], state);
}

/**
 * Fetches sources, tags, publishers and persons data
 */
const fetchSQData = async (store, uiLang, contentLanguages) => {
  return await Api.sqdata({
    ui_language: uiLang,
    content_languages: contentLanguages
  }).then(({ data }) => {
    store.dispatch(sources.receiveSources({ sources: data.sources, uiLang }));
    store.dispatch(tagsActions.receiveTags(data.tags));
    store.dispatch(publicationsActions.receivePublishers(data.publishers));
    store.dispatch(mdbActions.receivePersons(data.persons));
    store.dispatch(mdbActions.fetchSQDataSuccess());
    return data.sources;
  }).catch(err => store.dispatch(mdbActions.fetchSQDataFailure(err)));
};

/**
 * SSR data loader for library/sources page
 */
export const libraryPage = async (store, match, show_console = false) => {
  const state = store.getState();
  const location = state?.router.location ?? {};
  const query = getQuery(location);
  const uiLang = query.language || settings.getUILang(state.settings);
  const sourceLanguage = query.source_language;
  const contentLanguages = settingsGetContentLanguagesSelector(state);
  
  show_console && console.log('SSR: libraryPage - fetching sources');
  await fetchSQData(store, uiLang, contentLanguages);

  show_console && console.log('SSR: libraryPage - sources fetched', match.params.id);
  const sourceID = firstLeafId(match.params.id, store.getState());
  show_console && console.log('SSR: libraryPage - source found', sourceID);

  await store.sagaMiddleWare.run(textPageSagas.fetchSubject, textPageActions.fetchSubject(sourceID, sourceLanguage)).done;
  const file = textPageGetFileSelector(store.getState()) || {};

  if (!file.isPdf) {
    await store.sagaMiddleWare.run(assetsSagas.doc2Html, assetsActions.doc2html(file.id)).done;
  }
};

/**
 * SSR data loader for likutim page
 */
export const likutPage = async (store, match) => {
  const { id } = match.params;

  const location = store.getState()?.router.location ?? {};
  const query = getQuery(location);
  const sourceLanguage = query.source_language;

  return store.sagaMiddleWare
    .run(textPageSagas.fetchSubject, textPageActions.fetchSubject(id, sourceLanguage))
    .done
    .then(() => {
      const state = store.getState();
      const file = textPageGetFileSelector(state) || {};
      store.dispatch(assetsActions.doc2html(file.id));
    });
};

