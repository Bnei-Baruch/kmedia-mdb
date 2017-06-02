import React from 'react';
import { Header } from 'semantic-ui-react';
import Lessons from '../lessons';
import Lesson from '../lesson';
import Sources from '../sources';
import Topics from '../topics';

const MenuRoutes = [
  { key: 'daily_lessons', name: 'Daily Lessons', to: '/lessons', },
  { key: 'tv_video_programs', name: 'TV & Video Programs', to: '/tv_video_programs', },
  { key: 'lectures_lessons', name: 'Lectures & Lessons', to: '/lectures', },
  { key: 'sources', name: 'Kabbalah Sources', to: '/sources', },
  { key: 'events', name: 'Events', to: '/events', },
  { key: 'books', name: 'Books', to: '/books', },
  { key: 'topics', name: 'Topics', to: '/topics', },
  { key: 'publications', name: 'Publications', to: '/publications', },
  { key: 'photos', name: 'Photos', to: '/photos', },
];

export default MenuRoutes;

const NotImplemented = () => <Header as="h3">Not Implemented Yet</Header>;

export const AppRoutes = [
  { key: 'homepage', exact: true, path: '/', component: Lessons },
  { key: 'daily_lessons', exact: true, path: '/lessons', component: Lessons },
  { key: 'tv_video_programs', exact: true, path: '/tv_video_programs', component: NotImplemented },
  { key: 'lesson', exact: true, path: '/lessons/:id', component: Lesson },
  { key: 'sources', exact: true, path: '/sources', component: Sources },
  { key: 'topics', exact: true, path: '/topics', component: Topics },
];

export const getPageNo = (search) => {
  let page = 0;
  if (search) {
    page = parseInt(search.match(/page=(\d+)/)[1], 10);
  }

  return (isNaN(page) || page <= 0) ? 1 : page;
};
