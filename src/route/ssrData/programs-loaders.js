import { actions as prepareActions } from '../../redux/modules/preparePage';
import { COLLECTION_PROGRAMS_TYPE, PAGE_NS_PROGRAMS, UNIT_PROGRAMS_TYPE } from '../../helpers/consts';
import { cuListPage } from './list-loaders';

/**
 * SSR data loader for programs main page
 */
export const programsPage = (store, match) => {
  store.dispatch(prepareActions.fetchCollections(PAGE_NS_PROGRAMS, { content_type: COLLECTION_PROGRAMS_TYPE }));
  cuListPage(PAGE_NS_PROGRAMS)(store, match);
};

/**
 * Extra fetch params for programs
 */
export const getProgramsExtraParams = ns => {
  if (ns === PAGE_NS_PROGRAMS) {
    return { content_type: UNIT_PROGRAMS_TYPE };
  }

  return {};
};

