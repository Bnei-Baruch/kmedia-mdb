import React, { useContext } from 'react';
import { Grid, Container } from 'semantic-ui-react';

import Helmets from '../../../shared/Helmets';
import Recommended from '../widgets/Recommended/Main/Recommended';
import PlayerContainer from '../../../Player/PlayerContainer';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom';
import { getEmbedFromQuery } from '../../../../helpers/player';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../redux/modules/playlist';
import { withNamespaces } from 'react-i18next';
import WipErr from '../../../shared/WipErr/WipErr';
import Info from '../widgets/Info/Info';
import Materials from '../widgets/UnitMaterials/Materials';

const SingleMediaPage = ({ t }) => {

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const location           = useLocation();
  const embed              = getEmbedFromQuery(location);

  const isReady = useSelector(state => selectors.getInfo(state.playlist).isReady);

  const wipErr        = WipErr({ wip: !isReady, t });
  const computerWidth = !isMobileDevice ? 10 : 16;
  if (embed) return <PlayerContainer />;

  return (
    <>
      <Helmets.AVUnit />
      <Grid padded={!isMobileDevice} className="avbox">
        <Grid.Row>
          <Grid.Column
            mobile={16}
            tablet={computerWidth}
            computer={computerWidth}
            className={clsx({ 'is-fitted': isMobileDevice })}>
            <Grid.Row>
              <Grid.Column>
                <PlayerContainer />
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
        </Grid.Row>
      </Grid>
    </>
  );

};

export default withNamespaces()(SingleMediaPage);
