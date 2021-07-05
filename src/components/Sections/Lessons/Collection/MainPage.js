import React from 'react';
import { useParams } from 'react-router-dom';

import PlaylistCollectionIdCheck from '../../../Pages/PlaylistCollection/IdCheck';
import UnitList from './UnitList';

const MainPage = () => {
  const { tab } = useParams();

  return tab === 'daily' || tab === 'series'
    ? <PlaylistCollectionIdCheck />
    : <UnitList key={tab} />;
};

export default MainPage;
