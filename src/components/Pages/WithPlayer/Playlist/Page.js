import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

import { Grid, Container, Divider } from 'semantic-ui-react';
import Helmets from '../../../shared/Helmets';
import PlaylistHeader from './PlaylistHeader';
import Info from '../widgets/Info/Info';
import Materials from '../widgets/UnitMaterials/Materials';
import PlaylistItems from './PlaylistItems';
import Recommended from '../widgets/Recommended/Main/Recommended';
import { selectors as playlist } from '../../../../redux/modules/playlist';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';

const Page = ({ playerContainer }) => {
  const { isMobileDevice }           = useContext(DeviceInfoContext);
  const { isReady: isPlaylistReady } = useSelector(state => playlist.getInfo(state.playlist));

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
        {playerContainer}
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
