import moment from 'moment';
import { simpleModeApi } from '../../redux/api/simpleMode';
import { getQuery } from '../../helpers/url';

/**
 * SSR data loader for simple mode page
 */
export const simpleMode = (store, match) => {
  const { uiLang = 'en', contentLanguages = ['en'] } = match;

  const query = getQuery(match.parsedURL);
  const date = (query.date && moment(query.date).isValid()) 
    ? moment(query.date, 'YYYY-MM-DD').format('YYYY-MM-DD') 
    : moment().format('YYYY-MM-DD');

  store.dispatch(simpleModeApi.endpoints.simpleMode.initiate({ 
    date, 
    uiLanguage: uiLang, 
    contentLanguages 
  }));
  
  return Promise.resolve(null);
};

