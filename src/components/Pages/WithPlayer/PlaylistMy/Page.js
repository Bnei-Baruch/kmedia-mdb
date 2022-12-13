import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Grid, Divider } from 'semantic-ui-react';
import Materials from '../widgets/UnitMaterials/Materials';

import Info from '../widgets/Info/Info';
import PlayerContainer from '../../../Player/PlayerContainer';
import Recommended from '../widgets/Recommended/Main/Recommended';
import PlaylistHeader from '../Playlist/PlaylistHeader';
import PlaylistItems from './PlaylistItems';
import { selectors as playlist } from '../../../../redux/modules/playlist';

const PlaylistMyPage = ({playerContainer}) => {
  const isPlaylistReady = useSelector(state => playlist.getInfo(state.playlist).isReady);

  return (
    <Grid className="avbox">
      <Grid.Column width={10}>
        <div id="avbox_playlist">
          {isPlaylistReady && <PlaylistHeader />}
        </div>
        {playerContainer}
        <Container id="unit_container">
          {
            isPlaylistReady && (
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
        {isPlaylistReady && <Recommended filterOutUnits={[]} />}
      </Grid.Column>
    </Grid>
  );
};

export default PlaylistMyPage;
