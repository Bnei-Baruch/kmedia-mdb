import { actions as assetsActions } from '../../redux/modules/assets';

/**
 * SSR data loader for about page
 */
export const aboutPage = (store, match) => {
  const { contentLanguages = ['en'] } = match;
  store.dispatch(assetsActions.fetchAbout({ contentLanguages }));
};

