import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import * as shapes from '../../shapes';
import Helmets from '../../shared/Helmets';
import BlogFeed from '../Publications/tabs/Blog/Feed';
import TwitterFeed from '../Publications/tabs/Twitter/Feed';
import ActiveSections from './ActiveSections';
import HomeBanners from './HomeBanners';
import LatestUpdatesSection from './LatestUpdatesSection';
import SearchBar from './SearchBar';
import Section from './Section';

const renderBlogPosts = (latestBlogPosts, uiLang, t) =>
  latestBlogPosts.length && (
    <div className="home-blog-posts w-full md:w-8/12">
      <div className="titles">
        <h4>{t('home.blog-title')}</h4>
      </div>
      <BlogFeed snippetVersion items={latestBlogPosts} limitLength={4} />
      <div className="read-more-bottom">
        <a href={`/${uiLang}/publications/blog`}>{t('home.read-more-posts')}</a>
      </div>
    </div>
  );

const renderTweets = (latestTweets, uiLang, t) =>
  latestTweets.length && (
    <div className="home-twitter w-full md:w-4/12">
      <div className="titles">
        <h4>{t('home.twitter-title')}</h4>
      </div>
      <div className="p-4">
        {latestTweets.slice(0, 4).map(item => (
          <TwitterFeed twitter={item} key={item.twitter_id} />
        ))}
      </div>
      <div className="read-more-bottom">
        <a href={`/${uiLang}/publications/twitter`}>{t('home.read-more-tweets')}</a>
      </div>
    </div>
  );

const renderBlogPostsAndTweets = (latestBlogPosts, latestTweets, uiLang, t) => (
  <div className="homepage__section home-social-section">
    <div className="">
      <Section title={t('home.social')}>
        <div className="homepage__iconsrow socialBackground flex flex-wrap justify-center p-4">
          {renderBlogPosts(latestBlogPosts, uiLang, t)}
          {renderTweets(latestTweets, uiLang, t)}
        </div>
      </Section>
    </div>
  </div>
);


const renderSearchBar = location => (
  <div className="homepage__header">
    <div className="px-4 max-w-[1200px] mx-auto">
      <SearchBar location={location} />
    </div>
  </div>
);

const HomePage = ({ uiLang, latestItems = [], latestLesson = null, latestBlogPosts = [], latestTweets = [] }) => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="homepage">
      <Helmets.Basic title={t('home.header.text')} description={t('home.header.subtext')} />
      {renderSearchBar(location)}
      <HomeBanners latestLesson={latestLesson} />
      <ActiveSections />
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
};

const arePropsEqual = (prevProps, nextProps) =>
  prevProps.uiLang === nextProps.uiLang &&
  isEqual(prevProps.latestLesson, nextProps.latestLesson) &&
  isEqual(prevProps.latestUnits, nextProps.latestUnits) &&
  isEqual(prevProps.latestBlogPosts, nextProps.latestBlogPosts) &&
  isEqual(prevProps.latestTweets, nextProps.latestTweets);

export default memo(HomePage, arePropsEqual);
