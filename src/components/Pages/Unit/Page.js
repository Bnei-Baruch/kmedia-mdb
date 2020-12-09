import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Grid } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import Helmets from '../../shared/Helmets';
import AVBox from './widgets/AVBox/AVBox';
import Materials from './widgets/UnitMaterials/Materials';
import Info from './widgets/Info/Info';
import Recommended from './widgets/Recommended/Main/Recommended';
import playerHelper from '../../../helpers/player';
import { DeviceInfoContext } from '../../../helpers/app-contexts';

const renderPlayer = (unit, language) =>
  <AVBox unit={unit} language={language} />


export const UnitPage = ({ unit, language, section = '', location = {} }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const embed = playerHelper.getEmbedFromQuery(location);

  if (!unit) {
    return null;
  }

  const computerWidth = !isMobileDevice ? 10 : 16;

  return !embed
    ? (
      <>
        <Helmets.AVUnit unit={unit} language={language} />
        <Grid padded={!isMobileDevice}>
          <Grid.Column mobile={16} tablet={computerWidth} computer={computerWidth}>
            <Grid.Row>
              {renderPlayer(unit, language)}
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Info unit={unit} section={section} />
                <Materials unit={unit} />
              </Grid.Column>
            </Grid.Row>
          </Grid.Column>
          {!isMobileDevice &&
              <Grid.Column mobile={16} tablet={6} computer={6}>
                <Recommended unit={unit} />
              </Grid.Column>
          }
        </Grid>
      </>
    ) : (
      renderPlayer(unit, language)
    );
}

UnitPage.propTypes = {
  unit: shapes.ContentUnit,
  section: PropTypes.string,
  language: PropTypes.string.isRequired,
  location: shapes.HistoryLocation,
};

export const wrap = WrappedComponent => withNamespaces()(WrappedComponent);

export default UnitPage;
