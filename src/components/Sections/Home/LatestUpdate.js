import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Header, Label } from 'semantic-ui-react';

import { sectionThumbnailFallback } from '../../../helpers/images';
import { canonicalLink } from '../../../helpers/links';
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

    const link = canonicalLink(unit);

    let canonicalSection = null;
    const s              = link.split('/');
    if (s.length > 2) {
      canonicalSection = s[1];
    }

    return (
      <Card as={Link} to={link}>
        <UnitLogo width={512} unitId={unit.id} fallbackImg={sectionThumbnailFallback[canonicalSection]} />
        <Card.Content>
          <Header size="small">
            <small className="text grey">
              {t('values.date', { date: unit.film_date })}
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
