import React from 'react';
import MainTabPage from '../../shared/MainTabPage';
import ProgramList from './tabs/Programs/List';
import ClipList from './tabs/Clips/List';

export const tabs = [
  'main',
  'clips'
];

const content = (active) => {
  switch (active) {
  case 'main':
    return <ProgramList />;
  case 'clips':
    return <ClipList />;
  default:
    return <h1>Page not found</h1>;
  }
};

const MainPage = () =>
  <MainTabPage
    tabs={tabs}
    content={content}
    section="programs"
  />;

export default MainPage;
