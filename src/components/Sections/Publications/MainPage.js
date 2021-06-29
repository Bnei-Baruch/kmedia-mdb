import React from 'react';
import MainTabPage from '../../shared/MainTabPage';
import Articles from './tabs/Articles/List';
import Blog from './tabs/Blog/Container';
import Twitter from './tabs/Twitter/Container';
import AudioBlog from './tabs/AudioBlog/Container';

export const tabs = [
  'blog',
  'twitter',
  'articles',
  'audio-blog'
];

const content = (active) => {
  switch (active) {
    case 'articles':
      return <Articles />;
    case 'blog':
      return <Blog namespace="publications-blog" />;
    case 'twitter':
      return <Twitter namespace="publications-twitter" />;
    case 'audio-blog':
      return <AudioBlog />;
    default:
      return <h1>Page not found</h1>;
  }
};

const MainPage = () => (
  <MainTabPage
    tabs={tabs}
    content={content}
    section="publications" />
);

export default MainPage;
