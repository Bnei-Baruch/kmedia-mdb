import React from 'react';
import { useParams } from 'react-router-dom';
import PlaylistCollectionContainer from '../../Pages/PlaylistCollection/Container';
import LessonPage from './LessonPage';

const MainPage = () => {
  const { tab, id } = useParams();


  return tab === 'lectures' || tab === 'virtual'
    ? <LessonPage cid={id} />
    : <PlaylistCollectionContainer cId={id} />;
};

export default MainPage;
