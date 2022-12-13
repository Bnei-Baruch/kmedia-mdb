import React, { useContext } from 'react';
import clsx from 'clsx';

import { Grid, Container, Divider } from 'semantic-ui-react';
import Helmets from '../../../shared/Helmets';
import PlaylistHeader from './PlaylistHeader';
import Info from '../widgets/Info/Info';
import Materials from '../widgets/UnitMaterials/Materials';
import PlaylistItems from './PlaylistItems';
import Recommended from '../widgets/Recommended/Main/Recommended';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { useSelector } from 'react-redux';
import { selectors as playlist } from '../../../../redux/modules/playlist';
import WipErr from '../../../shared/WipErr/WipErr';
import { withNamespaces } from 'react-i18next';

const PlaylistPage = ({ playerContainer, t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const isPlaylistReady    = useSelector(state => playlist.getInfo(state.playlist).isReady);

  const wipErr        = WipErr({ wip: !isPlaylistReady, t });
  const computerWidth = !isMobileDevice ? 10 : 16;

  return (
    <Grid padded={!isMobileDevice} className="avbox">
      <Grid.Column
        mobile={16}
        tablet={computerWidth}
        computer={computerWidth}
        className={clsx({ 'is-fitted': isMobileDevice })}>
        <div id="avbox_playlist">
          {!wipErr && <PlaylistHeader />}
        </div>
        {playerContainer}
        <Container id="unit_container">
          {
            wipErr || (
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
        !isMobileDevice && !wipErr && (
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

export default withNamespaces()(PlaylistPage);
