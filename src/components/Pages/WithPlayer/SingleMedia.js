import React, { useContext, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import clsx from 'clsx';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Grid } from 'semantic-ui-react';

import { actions, selectors, selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import WipErr from '../../shared/WipErr/WipErr';
import Helmets from '../../shared/Helmets';
import Materials from './widgets/UnitMaterials/Materials';
import Info from './widgets/Info/Info';
import Recommended from './widgets/Recommended/Main/Recommended';
import playerHelper from '../../../helpers/player';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import PlayerContainer from '../../Player/PlayerContainer';

const SinglePage = ({ t }) => {

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const location           = useLocation();
  const { id }             = useParams();
  const unit               = useSelector(state => mdb.getDenormContentUnit(state.mdb, id));

  const embed      = playerHelper.getEmbedFromQuery(location);
  const uiLanguage = useSelector(state => settings.getLanguage(state.settings));

  const wip = useSelector(state => selectors.getWip(state.mdb).units[id]);
  const err = useSelector(state => selectors.getErrors(state.mdb).units[id]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (wip || err || (unit && unit.id === id && Array.isArray(unit.files))) {
      return;
    }

    dispatch(actions.fetchUnit(id));
  }, [dispatch, err, id, unit, wip]);

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) {
    return wipErr;
  }

  if (!unit) {
    return null;
  }

  const computerWidth = !isMobileDevice ? 10 : 16;

  return !embed
    ? (
      <>
        <Helmets.AVUnit unit={unit} language={uiLanguage} />
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
                    <Info cuId={id} />
                    <Materials unit={unit} />
                  </Container>
                </Grid.Column>
              </Grid.Row>
            </Grid.Column>
            {!isMobileDevice &&
              <Grid.Column mobile={16} tablet={6} computer={6}>
                <Recommended unit={unit} />
              </Grid.Column>
            }
          </Grid.Row>
        </Grid>
      </>
    ) : (
      <PlayerContainer />
    );
};

export default withNamespaces()(SinglePage);
