import { actions as eventsActions } from '../../redux/modules/events';
import { actions as filtersActions } from '../../redux/modules/filters';
import { PAGE_NS_EVENTS, CT_MEAL, CT_FRIENDS_GATHERING } from '../../helpers/consts';
import * as eventsSagas from '../../sagas/events';

/**
 * SSR data loader for events main page
 */
export const eventsPage = store => {
  store.dispatch(filtersActions.hydrateFilters(PAGE_NS_EVENTS));
  return store.sagaMiddleWare.run(eventsSagas.fetchAllEvents, eventsActions.fetchAllEvents()).done;
};

/**
 * Extra fetch params for events by type
 */
export const getEventsExtraParams = (type) => {
  switch (type) {
    case 'events-meals':
      return { content_type: [CT_MEAL] };
    case 'events-friends-gatherings':
      return { content_type: [CT_FRIENDS_GATHERING] };
    default:
      return {};
  }
};

