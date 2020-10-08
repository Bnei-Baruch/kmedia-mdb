import React from 'react';
import { useParams } from 'react-router-dom';

import PlaylistCollectionContainer from '../../../Pages/PlaylistCollection/Container';
import UnitList from './UnitList';

const MainPage = () => {
  const { tab } = useParams();

  if (tab === 'daily' || tab === 'series') {
    return <PlaylistCollectionContainer />;
  }

  return <UnitList key={tab} />;
};

export default MainPage;
