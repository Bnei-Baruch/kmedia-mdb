import React, { useContext } from 'react';
import clsx from 'clsx';

import { Grid, Container, Divider } from 'semantic-ui-react';
import PlaylistHeader from './PlaylistHeader';
import Info from '../widgets/Info/Info';
import Materials from '../widgets/UnitMaterials/Materials';
import PlaylistItems from './PlaylistItems';
import Recommended from '../widgets/Recommended/Main/Recommended';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { getEmbedFromQuery, EMBED_TYPE_PLAYER, EMBED_TYPE_PLAYLIST } from '../../../../helpers/player';
import { useLocation } from 'react-router-dom';

const PlaylistPage = ({ playerContainer }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const location           = useLocation();
  const { embed, type }    = getEmbedFromQuery(location);

  if (embed && type === EMBED_TYPE_PLAYER) return playerContainer;
  if (type === EMBED_TYPE_PLAYLIST) {
    return (
      <Container className="avbox">
        <div id="avbox_playlist">
          <PlaylistHeader />
        </div>
        {playerContainer}
      </Container>
    );
  }

  const computerWidth = !isMobileDevice ? 10 : 16;

  return (
    <Grid padded={!isMobileDevice} className="avbox">
      <Grid.Column
        mobile={16}
        tablet={computerWidth}
        computer={computerWidth}
        className={clsx({ 'is-fitted': isMobileDevice })}>
        <div id="avbox_playlist">
          <PlaylistHeader />
        </div>
        {playerContainer}
        <Container id="unit_container">
          <Info />
          <Materials />
        </Container>
      </Grid.Column>
      {
        !isMobileDevice && (
          <Grid.Column width={6}>
            <PlaylistItems />
            <Divider hidden />
            <Recommended filterOutUnits={[]} />
          </Grid.Column>
        )
      }
    </Grid>
  );
};

export default PlaylistPage;
