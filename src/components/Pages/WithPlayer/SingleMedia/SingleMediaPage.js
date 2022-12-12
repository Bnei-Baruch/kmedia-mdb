import React, { useContext } from 'react';
import { Grid, Container } from 'semantic-ui-react';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import Helmets from '../../../shared/Helmets';
import Recommended from '../widgets/Recommended/Main/Recommended';
import { getEmbedFromQuery } from '../../../../helpers/player';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import WipErr from '../../../shared/WipErr/WipErr';
import Info from '../widgets/Info/Info';
import Materials from '../widgets/UnitMaterials/Materials';
import { selectors as playlist } from '../../../../redux/modules/playlist';

const SingleMediaPage = ({ playerContainer, t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const location        = useLocation();
  const embed           = getEmbedFromQuery(location);
  const isPlaylistReady = useSelector(state => playlist.getInfo(state.playlist).isReady);

  if (embed) return playerContainer;

  const wipErr        = WipErr({ wip: !isPlaylistReady, t });
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
              <Container className="unit_container">
                {wipErr || (
                  <>
                    <Info />
                    <Materials />
                  </>
                )}
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid.Column>
        {!isMobileDevice &&
          <Grid.Column mobile={16} tablet={6} computer={6}>
            {wipErr || <Recommended />}
          </Grid.Column>
        }
      </Grid>
    </>
  );

};

export default withNamespaces()(SingleMediaPage);
