import React from 'react';
import PropTypes from 'prop-types';
import { Card, Header } from 'semantic-ui-react';

import { canonicalLink, canonicalSectionByLink } from '../../../helpers/links';
import * as shapes from '../../shapes';
import Link from '../../Language/MultiLanguageLink';
import UnitLogo from '../../shared/Logo/UnitLogo';

const LatestUpdate = ({ unit, label, t }) => {
  const link             = canonicalLink(unit);
  const canonicalSection = canonicalSectionByLink(link);

  return (
    <Card as={Link} to={link} raised>
      <UnitLogo width={512} unitId={unit.id} fallbackImg={canonicalSection} />
      <Card.Content>
        <Header size="tiny">{unit.name}</Header>
      </Card.Content>
      <Card.Content extra>
        <Card.Meta content={`${t('values.date', { date: unit.film_date })} - ${label}`} />
      </Card.Content>
    </Card>
  );
};

LatestUpdate.propTypes = {
  unit: shapes.ContentUnit.isRequired,
  label: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default LatestUpdate;
