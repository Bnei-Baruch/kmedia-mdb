import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Feed, Grid } from 'semantic-ui-react';
import * as shapes from '../../shapes';
import Helmets from '../../shared/Helmets';
import SearchBar from './SearchBar';
import Promoted from './Promoted';
import Topic from './Topic';
import Section from './Section';
import LatestDailyLesson from './LatestDailyLesson';
import LatestUpdatesSection from './LatestUpdatesSection';
import BlogFeed from '../Publications/tabs/Blog/Feed';
import TwitterFeed from '../Publications/tabs/Twitter/Feed';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { isEqual } from 'lodash';
import { useInterval } from '../../../helpers/timer';

const SWITCH_BANNERS_TIMEOUT = 5 * 1000; // every 5 sec

const renderBlogPosts = (latestBlogPosts, language, t) =>
  latestBlogPosts.length
  && (
    <Grid.Column mobile={16} tablet={11} computer={11} className="home-blog-posts">
      <div className="titles">
        <h4>{t('home.blog-title')}</h4>
        <a href={`/${language}/publications/blog`}>{t('home.all-posts')}</a>
      </div>
      <BlogFeed snippetVersion items={latestBlogPosts} language={language} limitLength={4} />
      <div className="read-more-bottom">
        <a href={`/${language}/publications/blog`}>{t('home.read-more-posts')}</a>
      </div>
    </Grid.Column>
  );

const renderTweets = (latestTweets, language, t) =>
  latestTweets.length
  && (
    <Grid.Column mobile={16} tablet={5} computer={5} className="home-twitter">
      <div className="titles">
        <h4>{t('home.twitter-title')}</h4>
        <a href={`/${language}/publications/twitter`}>{t('home.all-tweets')}</a>
      </div>
      <Feed>
        {
          latestTweets.slice(0, 4).map(item => <TwitterFeed twitter={item} key={item.twitter_id} />)
        }
      </Feed>
      <div className="read-more-bottom">
        <a href={`/${language}/publications/twitter`}>{t('home.read-more-tweets')}</a>
      </div>
    </Grid.Column>
  );

const renderBlogPostsAndTweets = (latestBlogPosts, latestTweets, language, t) =>
  <div className="homepage__section home-social-section">
    <Container className="padded horizontally ">
      <Section title={t('home.social')}>
        <Grid width={15} centered className="homepage__iconsrow">
          <Grid.Row>
            {renderBlogPosts(latestBlogPosts, language, t)}
            {renderTweets(latestTweets, language, t)}
          </Grid.Row>
        </Grid>
      </Section>
    </Container>
  </div>;

const renderActiveSections = (t, isMobileDevice) => {
  const map = isMobileDevice ?
    x => (
      <Grid.Column width={5} key={x} textAlign="center">
        <Topic title={t(`nav.sidebar.${x}`)} src={x} href={`/${x}`} />
      </Grid.Column>
    ) :
    x => (
      <Grid.Column key={x} textAlign="center">
        <Topic title={t(`nav.sidebar.${x}`)} src={x} href={`/${x}`} />
      </Grid.Column>
    );

  return ['lessons', 'programs', 'sources', 'events', 'publications', 'simple-mode'].map(map);
};

const renderActiveSectionsGrid = (t, isMobileDevice) =>
  <div className="homepage__website-sections homepage__section">
    <Container className="padded horizontally">
      <Section title={t('home.sections')}>
        <Grid columns="equal" centered className="homepage__iconsrow">
          <Grid.Row>
            {renderActiveSections(t, isMobileDevice)}
          </Grid.Row>
        </Grid>
      </Section>
    </Container>
  </div>;

const renderSearchBar = location =>
  <div className="homepage__header homepage__section">
    <Container className="padded horizontally">
      <SearchBar location={location} />
    </Container>
  </div>;

const renderLatestLessonAndBanner = (latestLesson, banner) =>
  <div className="homepage__featured homepage__section">
    <Container className="padded horizontally">
      <Grid centered>
        <Grid.Row>
          {
            latestLesson
            && <Grid.Column computer={6} tablet={7} mobile={16}>
              <LatestDailyLesson collection={latestLesson} />
            </Grid.Column>
          }
          <Grid.Column computer={6} tablet={7} mobile={16}>
            {banner && <Promoted banner={banner} />}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </div>;

const HomePage = ({
                    banners,
                    language,
                    location,
                    latestUnits = [],
                    latestLesson = null,
                    latestBlogPosts = [],
                    latestTweets = [],
                    t,
                  }) => {

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const [bannerIdx, setBannerIdx] = useState(-1);
  useInterval(() => {
    const allBanners = banners.data.length;
    if (allBanners > 0) {
      setBannerIdx(() => (bannerIdx + 1) % allBanners);
    } else {
      setBannerIdx(-1);
    }
  }, SWITCH_BANNERS_TIMEOUT);
  const banner = bannerIdx === -1 ? null : banners.data[bannerIdx];

  return (
    <div className="homepage">
      <Helmets.Basic title={t('home.header.text')} description={t('home.header.subtext')} />

      {renderSearchBar(location)}
      {renderLatestLessonAndBanner(latestLesson, banner)}
      {renderActiveSectionsGrid(t, isMobileDevice)}

      <LatestUpdatesSection latestUnits={latestUnits} t={t} />

      {renderBlogPostsAndTweets(latestBlogPosts, latestTweets, language, t)}
    </div>
  );
};

HomePage.propTypes = {
  location: shapes.HistoryLocation.isRequired,
  latestLesson: shapes.LessonCollection,
  latestUnits: PropTypes.arrayOf(shapes.ContentUnit),
  latestBlogPosts: PropTypes.arrayOf(shapes.BlogPost),
  latestTweets: PropTypes.arrayOf(shapes.Tweet),
  banner: shapes.Banner,
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

const arePropsEqual = (prevProps, nextProps) =>
  prevProps.language === nextProps.language &&
  isEqual(prevProps.latestLesson, nextProps.latestLesson) &&
  isEqual(prevProps.latestUnits, nextProps.latestUnits) &&
  isEqual(prevProps.latestBlogPosts, nextProps.latestBlogPosts) &&
  isEqual(prevProps.latestTweets, nextProps.latestTweets) &&
  isEqual(prevProps.banner, nextProps.banner);

export default React.memo(HomePage, arePropsEqual);
