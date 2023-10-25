import React from 'react';
import { Container } from 'semantic-ui-react';
import SearchBar from './SearchBar';
import LatestUpdatesSection from './LatestUpdatesSection';
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
