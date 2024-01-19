import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Container, Feed, Grid } from 'semantic-ui-react';
import * as shapes from '../../shapes';
import Helmets from '../../shared/Helmets';
import SearchBar from './SearchBar';
import Topic from './Topic';
import Section from './Section';
import LatestUpdatesSection from './LatestUpdatesSection';
import BlogFeed from '../Publications/tabs/Blog/Feed';
import TwitterFeed from '../Publications/tabs/Twitter/Feed';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { isEqual } from 'lodash';
import { useLocation } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import HomeBanners from './HomeBanners';

const renderBlogPosts = (latestBlogPosts, uiLang, t) =>
  latestBlogPosts.length
  && (
    <Grid.Column mobile={16} tablet={11} computer={11} className="home-blog-posts">
      <div className="titles">
        <h4>{t('home.blog-title')}</h4>
      </div>
      <BlogFeed snippetVersion items={latestBlogPosts} limitLength={4} />
      <div className="read-more-bottom">
        <a href={`/${uiLang}/publications/blog`}>{t('home.read-more-posts')}</a>
      </div>
    </Grid.Column>
  );

const renderTweets = (latestTweets, uiLang, t) =>
  latestTweets.length
  && (
    <Grid.Column mobile={16} tablet={5} computer={5} className="home-twitter">
      <div className="titles">
        <h4>{t('home.twitter-title')}</h4>
      </div>
      <Feed>
        {
          latestTweets.slice(0, 4).map(item => <TwitterFeed twitter={item} key={item.twitter_id} />)
        }
      </Feed>
      <div className="read-more-bottom">
        <a href={`/${uiLang}/publications/twitter`}>{t('home.read-more-tweets')}</a>
      </div>
    </Grid.Column>
  );

const renderBlogPostsAndTweets = (latestBlogPosts, latestTweets, uiLang, t) =>
  <div className="homepage__section home-social-section">
    <Container className="padded horizontally ">
      <Section title={t('home.social')} computer={13}>
        <Grid centered className="homepage__iconsrow socialBackground">
          <Grid.Row>
            {renderBlogPosts(latestBlogPosts, uiLang, t)}
            {renderTweets(latestTweets, uiLang, t)}
          </Grid.Row>
        </Grid>
      </Section>
    </Container>
  </div>;

const renderActiveSections = (t, isMobileDevice) => {
  const iconSize = isMobileDevice ? 50 : 100;
  const fontSize = isMobileDevice ? 'small' : 'large';
  const map      = x =>
    <Grid.Column width={4} key={x.name} textAlign="center" className={!isMobileDevice && x.className}>
      <Topic title={t(`nav.sidebar.${x.name}`)} src={x.name} href={`/${x.name}`} width={iconSize} height={iconSize} fontSize={fontSize} />
    </Grid.Column>;

  const sections = [
    { name: 'lessons', className: 'topIcon' },
    { name: 'programs', className: 'topIcon' },
    { name: 'topics', className: 'topIcon' },
    { name: 'sources', className: 'topIcon' },
    { name: 'events', className: '' },
    { name: 'likutim', className: '' },
    { name: 'publications', className: '' },
    { name: 'simple-mode', className: '' }
  ];

  return sections.map(map);
};

const renderActiveSectionsGrid = (t, isMobileDevice) =>
  <div className="homepage__website-sections homepage__section">
    <Container className="padded horizontally">
      <Section title={t('home.sections')}>
        <Grid columns="equal" centered className="homepage__iconsrow">
          <Grid.Row className="activeSectionsIcons">
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

const HomePage = (
  {
    uiLang,
    latestItems = [],
    latestLesson = null,
    latestBlogPosts = [],
    latestTweets = [],
    t,
  }
) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const location           = useLocation();

  return (
    <div className="homepage">
      <Helmets.Basic title={t('home.header.text')} description={t('home.header.subtext')} />
      {renderSearchBar(location)}
      <HomeBanners latestLesson={latestLesson} />
      {renderActiveSectionsGrid(t, isMobileDevice)}
      <LatestUpdatesSection latestItems={latestItems} t={t} />
      {renderBlogPostsAndTweets(latestBlogPosts, latestTweets, uiLang, t)}
    </div>
  );
};

HomePage.propTypes = {
  latestLesson: shapes.LessonCollection,
  latestItems: PropTypes.arrayOf(PropTypes.oneOfType([shapes.ContentUnit, shapes.Collection])),
  latestBlogPosts: PropTypes.arrayOf(shapes.BlogPost),
  latestTweets: PropTypes.arrayOf(shapes.Tweet),
  t: PropTypes.func.isRequired,
};

const arePropsEqual = (prevProps, nextProps) =>
  prevProps.uiLang === nextProps.uiLang &&
  isEqual(prevProps.latestLesson, nextProps.latestLesson) &&
  isEqual(prevProps.latestUnits, nextProps.latestUnits) &&
  isEqual(prevProps.latestBlogPosts, nextProps.latestBlogPosts) &&
  isEqual(prevProps.latestTweets, nextProps.latestTweets);

export default React.memo(withTranslation()(HomePage), arePropsEqual);
