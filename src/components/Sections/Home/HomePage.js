import React, { useContext } from 'react';
import { Container, Feed, Grid } from 'semantic-ui-react';
import SearchBar from './SearchBar';
import Topic from './Topic';
import Section from './Section';
import LatestUpdatesSection from './LatestUpdatesSection';
import BlogFeed from '../Publications/tabs/Blog/Feed';
import TwitterFeed from '../Publications/tabs/Twitter/Feed';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { useTranslation } from 'next-i18next';
import HomeBanners from './HomeBanners';
import LatestSocial from './LatestSocial';
import HomeSections from './HomeSections';

const HomePage = () => {
  return (
    <div className="homepage">
      {/*<Helmets.Basic title={t('home.header.text')} description={t('home.header.subtext')} />*/}
      <div className="homepage__header homepage__section">
        <Container className="padded horizontally">
          <SearchBar />
        </Container>
      </div>
      <HomeBanners />
      <HomeSections />
      <LatestUpdatesSection />
      <LatestSocial />
    </div>
  );
};

export default HomePage;
