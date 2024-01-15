import React, { useContext } from 'react';
import { Grid, Container } from 'semantic-ui-react';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Recommended from '../widgets/Recommended/Main/Recommended';
import { getEmbedFromQuery } from '../../../../helpers/player';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import Info from '../widgets/Info/Info';
import Materials from '../widgets/UnitMaterials/Materials';
import WipErr from '../../../shared/WipErr/WipErr';
import { playlistGetInfoSelector } from '../../../../redux/selectors';

const SingleMediaPage = ({ playerContainer }) => {
  const { t }              = useTranslation();
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const location           = useLocation();
  const embed              = getEmbedFromQuery(location);
  const { isReady }        = useSelector(playlistGetInfoSelector);

  if (embed) return playerContainer;
  if (!isReady) return WipErr({ wip: !isReady, t });

  const computerWidth = !isMobileDevice ? 10 : 16;
  return (
    <>
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
                <Info/>
                <Materials/>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid.Column>
        {
          !isMobileDevice && (
            <Grid.Column mobile={16} tablet={6} computer={6}>
              <Recommended/>
            </Grid.Column>
          )
        }
      </Grid>
    </>
  );
};

export default SingleMediaPage;
