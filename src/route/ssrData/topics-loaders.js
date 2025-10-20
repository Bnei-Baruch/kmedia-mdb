import { actions as tagsActions } from '../../redux/modules/tags';
import * as tagsSagas from '../../sagas/tags';

/**
 * SSR data loader for topics page
 */
export const topicsPage = (store, match) => {
  const tagID = match.params.id;
  return Promise.all([
    store.sagaMiddleWare.run(tagsSagas.fetchDashboard, tagsActions.fetchDashboard(tagID)).done
  ]);
};

