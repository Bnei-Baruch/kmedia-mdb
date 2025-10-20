import { actions as homeActions } from '../../redux/modules/home';
import { actions as publicationsActions } from '../../redux/modules/publications';
import { settingsGetContentLanguagesSelector } from '../../redux/selectors';
import { fetchSocialMedia } from '../../components/Sections/Home/Container';

/**
 * SSR data loader for home page
 */
export const home = store => {
  const state = store.getState();
  const contentLanguages = settingsGetContentLanguagesSelector(state);

  store.dispatch(homeActions.fetchData(true));
  fetchSocialMedia('blog', (type, id, options) =>
    store.dispatch(publicationsActions.fetchBlogList(type, id, options)), contentLanguages);
  fetchSocialMedia('tweet', (type, id, options) =>
    store.dispatch(publicationsActions.fetchTweets(type, id, options)), contentLanguages);
  store.dispatch(homeActions.fetchBanners(contentLanguages));

  return Promise.resolve(null);
};

