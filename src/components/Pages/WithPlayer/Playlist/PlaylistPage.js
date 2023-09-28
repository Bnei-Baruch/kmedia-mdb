import React, { useContext } from 'react';
import clsx from 'clsx';

import { Grid, Container, Divider } from 'semantic-ui-react';
import Info from '../widgets/Info/Info';
import PlaylistItems from './PlaylistItems';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import PlaylistHeader from './PlaylistHeader';
import Materials from '../widgets/UnitMaterials/Materials';

const PlaylistPage = ({ playerContainer }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

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
           {/* <Recommended filterOutUnits={[]} />*/}
          </Grid.Column>
        )
      }
    </Grid>
  );
};

export default PlaylistPage;
