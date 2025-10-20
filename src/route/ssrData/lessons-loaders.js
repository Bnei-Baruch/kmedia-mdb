import { actions as prepareActions } from '../../redux/modules/preparePage';
import { CT_VIRTUAL_LESSONS, PAGE_NS_LESSONS, RABASH_PERSON_UID, CT_LESSON_PART, CT_LECTURE, CT_WOMEN_LESSON, CT_VIRTUAL_LESSON } from '../../helpers/consts';
import { cuListPage, collectionPage } from './list-loaders';
import { playlistCollectionPage } from './unit-loaders';

/**
 * SSR data loader for lessons main page
 */
export const lessonsPage = (store, match) => {
  store.dispatch(prepareActions.fetchCollections(PAGE_NS_LESSONS, { content_type: [CT_VIRTUAL_LESSONS] }));
  cuListPage(PAGE_NS_LESSONS)(store, match);
};

/**
 * SSR data loader for lessons collection page
 * Handles different tabs (daily, series, etc.)
 */
export const lessonsCollectionPage = (store, match) => {
  const { tab } = match.params;

  if (tab === 'daily' || tab === 'series') {
    return playlistCollectionPage(store, match);
  }

  return collectionPage('lessons-collection')(store, match);
};

/**
 * Extra fetch params for lessons by tab type
 */
export const getLessonsExtraParams = tab => {
  switch (tab) {
    case 'lessons-virtual':
      return { content_type: [CT_VIRTUAL_LESSON] };
    case 'lessons-lectures':
      return { content_type: [CT_LECTURE] };
    case 'lessons-women':
      return { content_type: [CT_WOMEN_LESSON] };
    case 'lessons-rabash':
      return { content_type: [CT_LESSON_PART], person: RABASH_PERSON_UID };
    default:
      return {};
  }
};

