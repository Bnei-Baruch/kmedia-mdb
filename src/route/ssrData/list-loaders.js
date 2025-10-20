import { actions as filtersActions } from '../../redux/modules/filters';
import { actions as listsActions } from '../../redux/modules/lists';
import { actions as mdbActions } from '../../redux/modules/mdb';
import { settingsGetPageSizeSelector, mdbGetCollectionByIdSelector } from '../../redux/selectors';
import { getPageFromLocation } from '../../components/Pagination/withPagination';
import * as mdbSagas from '../../sagas/mdb';

/**
 * Gets extra fetch parameters based on namespace and collection ID
 */
function getExtraFetchParams(ns, collectionID) {
  if (collectionID) {
    return { collection: collectionID };
  }
  return {};
}

/**
 * Generic SSR data loader for content unit list pages
 */
export const cuListPage = (ns, collectionID = 0) => (store, match) => {
  // Hydrate filters
  store.dispatch(filtersActions.hydrateFilters(ns));

  // Hydrate page
  const page = getPageFromLocation(match.parsedURL);
  store.dispatch(listsActions.setPage(ns, page));

  const pageSize = settingsGetPageSizeSelector(store.getState());

  // Extra fetch params
  const extraFetchParams = getExtraFetchParams(ns, collectionID);

  // Dispatch fetchList
  store.dispatch(listsActions.fetchList(ns, page, { ...extraFetchParams, pageSize, withViews: true }));

  return Promise.resolve(null);
};

/**
 * Generic SSR data loader for collection pages
 */
export const collectionPage = ns => (store, match) => {
  const cID = match.params.id;
  if (cID) ns = `${ns}_${cID}`;
  
  return store.sagaMiddleWare.run(mdbSagas.fetchCollection, mdbActions.fetchCollection(cID)).done
    .then(() => {
      cuListPage(ns, cID)(store, match);
    });
};

