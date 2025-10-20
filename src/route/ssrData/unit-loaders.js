import { actions as assetsActions } from '../../redux/modules/assets';
import { actions as mdbActions } from '../../redux/modules/mdb';
import { actions as textPageActions } from '../../redux/modules/textPage';
import {
  mdbGetDenormContentUnitSelector,
  mdbGetCollectionByIdSelector,
  mdbGetLastLessonIdSelector,
  textPageGetFileSelector,
  settingsGetContentLanguagesSelector
} from '../../redux/selectors';
import * as mdbSagas from '../../sagas/mdb';
import * as textPageSagas from '../../sagas/textPage';
import * as assetsSagas from '../../sagas/assets';
import { canonicalCollection } from '../../helpers/utils';
import { CT_ARTICLE, CT_RESEARCH_MATERIAL } from '../../helpers/consts';
import {
  getFile as summaryGetFile,
  showSummaryTab,
  getSummaryLanguages
} from '../../components/Pages/WithPlayer/widgets/UnitMaterials/Summary/helper';
import { transcriptionFileFilter } from '../../components/Pages/WithPlayer/widgets/UnitMaterials/Transcription/helper';
import { selectSuitableLanguage } from '../../helpers/language';

/**
 * SSR data loader for content unit page
 */
export const cuPage = async (store, match) => {
  const cuID = match.params.id;
  if (cuID === '%3Canonymous%3E') {
    return Promise.resolve();
  }

  await store.sagaMiddleWare.run(mdbSagas.fetchUnit, mdbActions.fetchUnit(cuID)).done;

  const state = store.getState();
  const unit = mdbGetDenormContentUnitSelector(state, cuID);

  if (!cuID || !unit) {
    console.error(`Error, failed fetching unit ${cuID}: ${unit}`);
    return Promise.reject();
  }

  let activeTab = 'transcription';
  const contentLanguages = settingsGetContentLanguagesSelector(state);

  if (showSummaryTab(unit, contentLanguages)) {
    activeTab = 'summary';
  }

  if (match && match.parsedURL && match.parsedURL.searchParams) {
    for (const [key, value] of match.parsedURL.searchParams) {
      if (key === 'activeTab') {
        activeTab = value;
        break;
      }
    }
  }

  // Select transcript file by language
  let { id } = unit;
  let file = null;

  switch (activeTab) {
    case 'transcription':
      store.dispatch(textPageActions.setFileFilter(transcriptionFileFilter));
      await store.sagaMiddleWare.run(textPageSagas.fetchSubject, textPageActions.fetchSubject(id)).done;
      file = textPageGetFileSelector(store.getState());
      break;

    case 'research':
      id = Object.values(unit.derived_units).find(x => x.content_type === CT_RESEARCH_MATERIAL)?.id;
      await store.sagaMiddleWare.run(textPageSagas.fetchSubject, textPageActions.fetchSubject(id)).done;
      file = textPageGetFileSelector(store.getState());
      break;

    case 'articles':
      id = Object.values(unit.derived_units).find(x => x.content_type === CT_ARTICLE)?.id;
      await store.sagaMiddleWare.run(textPageSagas.fetchSubject, textPageActions.fetchSubject(id)).done;
      file = textPageGetFileSelector(store.getState());
      break;

    case 'summary':
      const summaryLanguages = getSummaryLanguages(unit);
      const summaryLanguage = selectSuitableLanguage(contentLanguages, summaryLanguages, unit.original_language);
      file = summaryGetFile(unit, summaryLanguage);
      break;

    default:
      console.warn('Unsupported active tab', activeTab);
      break;
  }

  if (file && file.id) {
    await store.sagaMiddleWare.run(assetsSagas.doc2Html, assetsActions.doc2html(file.id)).done;
  }

  const c = canonicalCollection(unit);
  if (c) {
    store.dispatch(mdbActions.fetchCollection(c.id));
  }

  return true;
};

/**
 * SSR data loader for playlist collection page
 */
export const playlistCollectionPage = (store, match) => {
  const { id: cID, cuId } = match.params;
  return store.sagaMiddleWare.run(mdbSagas.fetchCollection, mdbActions.fetchCollection(cID)).done
    .then(() => {
      const [c] = mdbGetCollectionByIdSelector(store.getState(), [cID]);
      if (!cuId && !c?.cuIDs) {
        console.error(`Failed fetching unit for ${cuId} for ${cID}`);
        return Promise.reject();
      }

      store.dispatch(mdbActions.fetchUnit(cuId || c?.cuIDs[0]));
      return Promise.resolve(null);
    });
};

/**
 * SSR data loader for latest lesson
 */
export const latestLesson = store => (
  store.sagaMiddleWare.run(mdbSagas.fetchLatestLesson).done
    .then(() => {
      const state = store.getState();
      const cID = mdbGetLastLessonIdSelector(state);
      const [c] = mdbGetCollectionByIdSelector(state, [cID]);
      store.dispatch(mdbActions.fetchUnit(c.cuIDs[0]));
    })
);

