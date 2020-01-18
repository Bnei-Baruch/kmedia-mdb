import React from 'react';

import { actions } from '../../../redux/modules/lessons';
import MainTabPage from '../../shared/MainTabPage';
import Daily from './tabs/Daily/Container';
import Series from './tabs/Series/Container';
import Lectures from './tabs/Lectures/Container';

// needed in routesSSRData
export const tabs = [
  'daily',
  'virtual',
  'lectures',
  'women',
  'rabash',
  // 'children',
  'series',
];

const content = (active) => {
  let content = null;
  switch (active) {
  case 'daily':
    content = <Daily />;
    break;
  case 'virtual':
  case 'lectures':
  case 'women':
  case 'rabash':
    // case 'children':
    content = <Lectures tab={active} />;
    break;
  case 'series':
    content = <Series />;
    break;
  default:
    content = <h1>Page not found</h1>;
    break;
  }
  return content;
};

const MainPage = () => (
  <MainTabPage 
    tabs={tabs} 
    content={content} 
    setTab={actions.setTab} 
    section="lessons" />
);

export default MainPage;
