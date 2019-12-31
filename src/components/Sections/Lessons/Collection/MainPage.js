import React from 'react';

import * as shapes from '../../../shapes';
import Playlist from '../../../Pages/PlaylistCollection/Container';
import UnitList from './UnitList';

const MainPage = (props) => {
  const { match: { params: { tab } } } = props;

  if (tab === 'daily' || tab === 'series') {
    return <Playlist />;
  }

  return <UnitList />;
};

MainPage.propTypes = {
  match: shapes.RouterMatch.isRequired,
};

export default MainPage;
