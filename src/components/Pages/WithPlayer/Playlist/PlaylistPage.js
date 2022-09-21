import React from 'react';
import { Grid, Container, Divider } from 'semantic-ui-react';

import Helmets from '../../../shared/Helmets';
import PlaylistHeader from './PlaylistHeader';
import Info from '../widgets/Info/Info';
import Materials from '../widgets/UnitMaterials/Materials';
import Playlist from './Playlist';
import Recommended from '../widgets/Recommended/Main/Recommended';
import PlayerContainer from '../../../Player/PlayerContainer';

const PlaylistPage = () => {
  return (
    <Grid className="avbox">
      <Grid.Column width={10}>
        <div id="avbox_playlist">
          <PlaylistHeader />
        </div>
        <PlayerContainer />
        <Container id="unit_container">
          <Helmets.AVUnit />
          <Info />
          <Materials />
        </Container>
      </Grid.Column>
      <Grid.Column width={6}>
        <Playlist />
        <Divider hidden />
        <Recommended filterOutUnits={[]} />
      </Grid.Column>
    </Grid>
  );

};

export default PlaylistPage;
