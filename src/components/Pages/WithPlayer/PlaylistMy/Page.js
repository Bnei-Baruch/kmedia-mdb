import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Grid, Divider } from 'semantic-ui-react';
import Materials from '../widgets/UnitMaterials/Materials';

import Info from '../widgets/Info/Info';
import { selectors as playlist } from '../../../../redux/modules/playlist';
import PlayerContainer from '../../../Player/PlayerContainer';
import Recommended from '../widgets/Recommended/Main/Recommended';
import PlaylistHeader from '../Playlist/PlaylistHeader';
import PlaylistItems from './PlaylistItems';

const PlaylistMyPage = () => {
  const isReady = useSelector(state => playlist.getInfo(state.playlist).isReady);

  return (
    <Grid className="avbox">
      <Grid.Column width={10}>
        <div id="avbox_playlist">
          {isReady && <PlaylistHeader />}
        </div>
        <PlayerContainer />
        <Container id="unit_container">
          {
            isReady && (
              <>
                <Info />
                <Materials />
              </>
            )
          }
        </Container>
      </Grid.Column>
      <Grid.Column width={6}>
        <PlaylistItems />
        <Divider hidden />
        {isReady && <Recommended filterOutUnits={[]} />}
      </Grid.Column>
    </Grid>
  );
};

export default PlaylistMyPage;