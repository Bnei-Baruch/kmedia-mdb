import { musicApi } from '../../redux/api/music';

/**
 * SSR data loader for music page
 */
export const musicPage = (store, match) => {
  const { uiLanguage = 'en', contentLanguages = ['en'] } = match;

  store.dispatch(musicApi.endpoints.music.initiate({ uiLanguage, contentLanguages }));
  return Promise.resolve(null);
};

