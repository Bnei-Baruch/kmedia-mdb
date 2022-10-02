import React, { useContext } from 'react';
import { Grid, Container } from 'semantic-ui-react';

import Helmets from '../../../shared/Helmets';
import Info from '../widgets/Info/Info';
import Materials from '../widgets/UnitMaterials/Materials';
import Recommended from '../widgets/Recommended/Main/Recommended';
import PlayerContainer from '../../../Player/PlayerContainer';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom';
import playerHelper from '../../../../helpers/player';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';

const SingleMediaPage = () => {

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const location           = useLocation();
  const embed              = playerHelper.getEmbedFromQuery(location);

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
            className={clsx({ 'is-fitted': isMobileDevice })}
          >
            <Grid.Row>
              <Grid.Column>
                <PlayerContainer />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Container className="unit_container">
                  <Info />
                  <Materials />
                </Container>
              </Grid.Column>
            </Grid.Row>
          </Grid.Column>
          {!isMobileDevice &&
            <Grid.Column mobile={16} tablet={6} computer={6}>
              <Recommended />
            </Grid.Column>
          }
        </Grid.Row>
      </Grid>
    </>
  );

};

export default SingleMediaPage;
