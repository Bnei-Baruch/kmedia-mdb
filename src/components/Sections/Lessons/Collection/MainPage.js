import React from 'react';
import { useParams } from 'react-router-dom';

import PlaylistCollectionIdCheck from '../../../Pages/PlaylistCollection/IdCheck';
import UnitList from './UnitList';

const MainPage = () => {
  const { tab } = useParams();

  if (tab === 'daily' || tab === 'series') {
    return <PlaylistCollectionIdCheck />;
  }

  return <UnitList key={tab} />;
};

export default MainPage;
