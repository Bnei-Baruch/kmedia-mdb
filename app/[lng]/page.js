/*
import React from 'react';

import { useInterval } from '/src/helpers/timer';
import {
  LANG_ENGLISH,
  LANG_HEBREW,
  LANG_RUSSIAN,
  LANG_SPANISH,
  LANG_UKRAINIAN,
  DEFAULT_CONTENT_LANGUAGE,
} from '/src/helpers/consts';
import { fetchHome, fetchBanners } from '/lib/redux/slices/homeSlice';
import { fetchBlogList, fetchTweets } from '/lib/redux/slices/publicationsSlice';
import HomePage from './home/components/HomePage';
import { fetchSQData } from '../../lib/redux/slices/mdbSlice';

const FETCH_TIMEOUT = 10 * 60 * 1000; // every 10 min

const TWITTER_BY_LANG = new Map([
  [LANG_HEBREW, { username: 'laitman_co_il' }],
  [LANG_UKRAINIAN, { username: 'Michael_Laitman' }],
  [LANG_RUSSIAN, { username: 'Michael_Laitman' }],
  [LANG_SPANISH, { username: 'laitman_es' }],
  [LANG_ENGLISH, { username: 'laitman' }],
]);

const BLOG_BY_LANG = new Map([
  [LANG_HEBREW, { blog: 'laitman-co-il' }],
  [LANG_UKRAINIAN, { blog: 'laitman-ru' }],
  [LANG_RUSSIAN, { blog: 'laitman-ru' }],
  [LANG_SPANISH, { blog: 'laitman-es' }],
  [LANG_ENGLISH, { blog: 'laitman-com' }],
]);

const chooseSocialMediaByLanguage = (contentLanguages, socialMediaOptions) =>
  socialMediaOptions.get(contentLanguages.find(language => socialMediaOptions.has(language)) || DEFAULT_CONTENT_LANGUAGE);

const fetchSocialMedia = async (type, fetchFn, contentLanguages) => {
  await fetchFn(`publications-${type}`, 1, {
    page_size: 4,
    ...chooseSocialMediaByLanguage(contentLanguages, type === 'blog' ? BLOG_BY_LANG : TWITTER_BY_LANG),
  });
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ locale }) => {
  const lang = locale ?? 'en';

  await store.dispatch(fetchSQData());
  const _data    = store.dispatch(fetchHome());
  const _banners = store.dispatch(fetchBanners());
  const _blogs   = fetchSocialMedia('blog', fetchBlogList, [lang]);
  const _tweets  = fetchSocialMedia('tweet', fetchTweets, [lang]);
  await Promise.all([_data, _banners, _blogs, _tweets]);

  const _i18n = await serverSideTranslations(lang);
  return { props: { ..._i18n } };
});
const HomePageContainer         = () => {
  useInterval(() => fetchHome(false), FETCH_TIMEOUT);

  return <HomePage />;
};

export default HomePageContainer;
*/
import React from 'react';
import { Container } from '/lib/SUI';
//import SearchBar from './home/components/SearchBar';
import HomeBanners from './home/components/HomeBanners';
import SearchBar from './home/components/SearchBar';
import HomeSections from './home/components/HomeSections';
import LatestUpdatesSection from './home/components/LatestUpdatesSection';

const HomePage = ({ params: { lng }}) => {
  return (
    <div className="homepage">
      {/*<Helmets.Basic title={t('home.header.text')} description={t('home.header.subtext')} />*/}
      <div className="homepage__header homepage__section">
        <Container className="padded horizontally">
          <SearchBar lng={lng} />
        </Container>
      </div>
      <HomeBanners />
      <HomeSections lng={lng} />
      <LatestUpdatesSection lng={lng} />
      {/*
      <LatestSocial />*/}
    </div>
  );
};

export default HomePage;
