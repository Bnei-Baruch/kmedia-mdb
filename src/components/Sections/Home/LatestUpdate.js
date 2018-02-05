import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Header, Label } from 'semantic-ui-react';

import { canonicalLink } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import Link from '../../Language/MultiLanguageLink';
import UnitLogo from '../../shared/Logo/UnitLogo';

class LatestUpdate extends Component {

  static propTypes = {
    unit: shapes.ContentUnit.isRequired,
    label: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
  };

  render() {
    const { unit, label, t } = this.props;

    return (
      <Card as={Link} to={canonicalLink(unit)}>
        <UnitLogo width={512} unitId={unit.id} />
        <Card.Content>
          <Header size="small">
            <small className="text grey">
              {t('values.date', { date: new Date(unit.film_date) })}
            </small>
            <br />
            {unit.name}
          </Header>
        </Card.Content>
        <Card.Content extra>
          <Label content={label} size="small" />
        </Card.Content>
      </Card>
    );
  }
}

export default LatestUpdate;
