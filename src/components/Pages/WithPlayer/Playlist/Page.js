import React, { useContext } from 'react';
import { Grid, Container, Divider } from 'semantic-ui-react';

import Helmets from '../../../shared/Helmets';
import PlaylistHeader from './PlaylistHeader';
import Info from '../widgets/Info/Info';
import Materials from '../widgets/UnitMaterials/Materials';
import PlaylistItems from './PlaylistItems';
import Recommended from '../widgets/Recommended/Main/Recommended';
import PlayerContainer from '../../../Player/PlayerContainer';
import { useSelector } from 'react-redux';
import { selectors as playlist } from '../../../../redux/modules/playlist';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import clsx from 'clsx';

const Page = () => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const isPlaylistReady    = useSelector(state => playlist.getInfo(state.playlist).isReady);

  const computerWidth = !isMobileDevice ? 10 : 16;

  return (
    <Grid padded={!isMobileDevice} className="avbox">
      <Grid.Column
        mobile={16}
        tablet={computerWidth}
        computer={computerWidth}
        className={clsx({ 'is-fitted': isMobileDevice })}>
        <div id="avbox_playlist">
          {isPlaylistReady && <PlaylistHeader />}
        </div>
        <PlayerContainer />
        <Container id="unit_container">
          {
            isPlaylistReady && (
              <>
                <Helmets.AVUnit />
                <Info />
                <Materials />
              </>
            )
          }
        </Container>
      </Grid.Column>
      {
        !isMobileDevice && (
          <Grid.Column width={6}>
            <PlaylistItems />
            <Divider hidden />
            {isPlaylistReady && <Recommended filterOutUnits={[]} />}
          </Grid.Column>
        )
      }
    </Grid>
  );

};

export default Page;
