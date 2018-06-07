import React, { PureComponent } from 'react';

import * as shapes from '../../../shapes';
import Playlist from '../../../Pages/PlaylistCollection/Container';
import UnitList from './UnitList';

class MainPage extends PureComponent {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
  };

  render() {
    const { match: { params: { tab } } } = this.props;

    if (tab === 'daily' || tab === 'series') {
      return <Playlist />;
    }

    return <UnitList />;
  }
}

export default MainPage;
