import React from 'react';
import PropTypes from 'prop-types';
import { Card, Header } from 'semantic-ui-react';

import { canonicalLink, canonicalSectionByLink } from '../../../helpers/links';
import * as shapes from '../../shapes';
import Link from '../../Language/MultiLanguageLink';
import UnitLogo from '../../shared/Logo/UnitLogo';
import {
  CT_CONGRESS,
  CT_DAILY_LESSON,
  CT_FRIENDS_GATHERINGS,
  CT_HOLIDAY,
  CT_LESSONS_SERIES,
  CT_MEALS,
  CT_PICNIC,
  CT_SPECIAL_LESSON,
  CT_UNITY_DAY,
  CT_VIDEO_PROGRAM,
  CT_VIRTUAL_LESSONS,
  CT_WOMEN_LESSONS
} from '../../../helpers/consts';

const LatestUpdate = ({ unit, label, t }) => {
  const link             = canonicalLink(unit);
  const canonicalSection = canonicalSectionByLink(link);
  const name             = unit.name ||
    `${t('constants.content-types.' + unit.content_type)} ${t('lessons.list.number')} ${unit.name_in_collection}`;
  let unitId             = unit.id;

  // collections -- get ID of first CU
  switch (unit.content_type) {
  case CT_CONGRESS:
  case CT_MEALS:
  case CT_DAILY_LESSON:
  case CT_SPECIAL_LESSON:
  case CT_VIRTUAL_LESSONS:
  case CT_WOMEN_LESSONS:
  case CT_VIDEO_PROGRAM:
  case CT_FRIENDS_GATHERINGS:
  case CT_HOLIDAY:
  case CT_PICNIC:
  case CT_UNITY_DAY:
  case CT_LESSONS_SERIES:
    const key = Object.keys(unit.collections)[0];
    if (key) {
      unitId = unit.collections[key].id;
    }
    break;
  }

  return (
    <Card as={Link} to={link} raised>
      <UnitLogo width={512} unitId={unitId} fallbackImg={canonicalSection} />
      <Card.Content>
        <Header size="tiny">{name}</Header>
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
