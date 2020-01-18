import React from 'react';

import { actions } from '../../../redux/modules/events';
import CollectionList from './tabs/CollectionList/Container';
import UnitList from './tabs/UnitList/Container';
import MainTabPage from '../../shared/MainTabPage';

export const tabs = [
  'conventions',
  'holidays',
  'unity-days',
  'friends-gatherings',
  'meals',
];

const content = (active) => {
  switch (active) {
  case 'conventions':
  case 'holidays':
  case 'unity-days':
    return <CollectionList tabName={active} />;
  case 'friends-gatherings':
  case 'meals':
    return <UnitList tab={active} />;
  default:
    return <h1>Page not found</h1>;
  }
}

const MainPage = () => (
  <MainTabPage 
    tabs={tabs} 
    content={content} 
    setTab={actions.setTab} 
    section="events" />
);

export default MainPage;