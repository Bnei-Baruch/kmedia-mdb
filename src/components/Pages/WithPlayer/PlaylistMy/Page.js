import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'next-i18next';
import { Container, Grid, Divider } from 'semantic-ui-react';

import Materials from '../widgets/UnitMaterials/Materials';
import Info from '../widgets/Info/Info';
import Recommended from '../widgets/Recommended/Main/Recommended';
import PlaylistHeader from '../Playlist/PlaylistHeader';
import PlaylistItems from './PlaylistItems';
import { selectors as playlist } from '../../../../../lib/redux/slices/playlistSlice/playlistSlice';
import WipErr from '../../../shared/WipErr/WipErr';
import clsx from 'clsx';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';

const PlaylistMyPage = ({ playerContainer, t }) => {
  const isReady            = useSelector(state => playlist.getInfo(state.playlist).isReady);
  const { isMobileDevice } = useContext(DeviceInfoContext);
  if (!isReady)
    return WipErr({ wip: !isReady, t });

  const computerWidth = !isMobileDevice ? 10 : 16;
  return (
    <Grid className="avbox">
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

export default withTranslation()(PlaylistMyPage);
