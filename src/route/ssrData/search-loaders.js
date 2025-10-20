import { actions as searchActions } from '../../redux/modules/search';
import { actions as filtersActions } from '../../redux/modules/filters';
import * as searchSagas from '../../sagas/search';
import * as filtersSagas from '../../sagas/filters';

/**
 * SSR data loader for search results page
 */
export const searchPage = store => (
  Promise.all([
    store.sagaMiddleWare.run(searchSagas.hydrateUrl).done,
    store.sagaMiddleWare.run(filtersSagas.hydrateFilters, filtersActions.hydrateFilters('search')).done
  ]).then(() => store.dispatch(searchActions.search()))
);

