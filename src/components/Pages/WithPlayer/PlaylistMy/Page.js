import React from 'react';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Container, Grid, Divider } from 'semantic-ui-react';

import Materials from '../widgets/UnitMaterials/Materials';
import Info from '../widgets/Info/Info';
import Recommended from '../widgets/Recommended/Main/Recommended';
import PlaylistHeader from '../Playlist/PlaylistHeader';
import PlaylistItems from './PlaylistItems';
import { selectors as playlist } from '../../../../redux/modules/playlist';
import WipErr from '../../../shared/WipErr/WipErr';

const PlaylistMyPage = ({ playerContainer, t }) => {
  const isReady = useSelector(state => playlist.getInfo(state.playlist).isReady);
  if (!isReady)
    return WipErr({ wip: !isReady, t });

  return (
    <Grid className="avbox">
      <Grid.Column width={10}>
        <div id="avbox_playlist">
          <PlaylistHeader />
        </div>
        {playerContainer}
        <Container id="unit_container">
          <Info />
          <Materials />
        </Container>
      </Grid.Column>
      <Grid.Column width={6}>
        <PlaylistItems />
        <Divider hidden />
        <Recommended filterOutUnits={[]} />
      </Grid.Column>
    </Grid>
  );
};

export default withNamespaces()(PlaylistMyPage);
