import React, { useContext } from 'react';
import { Grid, Container } from 'semantic-ui-react';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom';

import Helmets from '../../../shared/Helmets';
import Recommended from '../widgets/Recommended/Main/Recommended';
import { getEmbedFromQuery } from '../../../../helpers/player';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import Info from '../widgets/Info/Info';
import Materials from '../widgets/UnitMaterials/Materials';
import { useSelector } from 'react-redux';
import { selectors as playlist } from '../../../../redux/modules/playlist';
import WipErr from '../../../shared/WipErr/WipErr';
import { withNamespaces } from 'react-i18next';

const SingleMediaPage = ({ playerContainer, t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const location           = useLocation();

  const isPlaylistReady = useSelector(state => playlist.getInfo(state.playlist).isReady);
  const wipErr          = WipErr({ wip: !isPlaylistReady, t });
  const embed           = getEmbedFromQuery(location);

  if (embed) return playerContainer;

  const computerWidth = !isMobileDevice ? 10 : 16;
  return (
    <>
      <Helmets.AVUnit />
      <Grid padded={!isMobileDevice} className="avbox">
        <Grid.Column
          mobile={16}
          tablet={computerWidth}
          computer={computerWidth}
          className={clsx({ 'is-fitted': isMobileDevice })}>
          <Grid.Row>
            <Grid.Column>
              {playerContainer}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              {
                !wipErr && (
                  <Container className="unit_container">
                    <Info />
                    <Materials />
                  </Container>
                )
              }
            </Grid.Column>
          </Grid.Row>
        </Grid.Column>
        {
          !isMobileDevice && !wipErr && (
            <Grid.Column mobile={16} tablet={6} computer={6}>
              <Recommended />
            </Grid.Column>
          )
        }
      </Grid>
    </>
  );
};

export default withNamespaces()(SingleMediaPage);
