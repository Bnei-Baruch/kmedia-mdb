import React from 'react';
import { useParams } from 'react-router-dom';

import PlaylistCollectionIdCheck from '../../Pages/PlaylistCollection/IdCheck';
import LessonPage from './LessonPage';

const MainPage = () => {
  const { tab } = useParams();

  return tab === 'daily' || tab === 'series'
    ? <PlaylistCollectionIdCheck />
    : <LessonPage key={tab} />;
};

export default MainPage;
