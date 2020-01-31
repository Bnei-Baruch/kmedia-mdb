import React from 'react';
import PropTypes from 'prop-types';
import { List, Table } from 'semantic-ui-react';

import { NO_NAME } from '../../../../../helpers/consts';
import { CollectionsBreakdown } from '../../../../../helpers/mdb';
import { canonicalLink } from '../../../../../helpers/links';
import { ellipsize } from '../../../../../helpers/strings';
import Link from '../../../../Language/MultiLanguageLink';
import UnitLogo from '../../../../shared/Logo/UnitLogo';
import * as shapes from '../../../../shapes';

const commonRenderUnitForClips = (unit, t) => {
  const breakdown = new CollectionsBreakdown(Object.values(unit.collections || {}));
  const clips     = breakdown.getClips();

  const relatedItems = clips
    .map(x => (
      <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
        {x.name || NO_NAME}
      </List.Item>
    ))
    .concat(breakdown.getAllButClips().map(x => (
      <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
        {x.name}
      </List.Item>
    )));

  const link = canonicalLink(unit);

  return {
    link: link,
    filmDate: unit.film_date ? t('values.date', { date: unit.film_date }) : '',
    clips,
    relatedItems
  };
};

const renderUnit = (unit, t) => {
  const {
    link,
    filmDate,
    clips,
    relatedItems
  } = commonRenderUnitForClips(unit, t);

  return (
    <Table.Row key={unit.id} verticalAlign="top">
      <Table.Cell collapsing singleLine>
        <Link to={link}>
          <UnitLogo
            className="index__thumbnail"
            unitId={unit.id}
            collectionId={clips.length > 0 ? clips[0].id : null}
            fallbackImg='clips'
          />
        </Link>
      </Table.Cell>
      <Table.Cell>
        <span className="index__date">{filmDate}</span>
        <Link className="index__title" to={link}>{unit.name || NO_NAME}</Link>
        {
          unit.description &&
          <div className="index__description mobile-hidden">{ellipsize(unit.description)}</div>
        }
        {
          relatedItems &&
          <List horizontal divided link className="index__collections" size="tiny">{relatedItems}</List>
        }
      </Table.Cell>
    </Table.Row>
  );
};

const DerivedUnits = ({ selectedUnits, t }) => 
  <Table unstackable basic="very" className="index" sortable>
    <Table.Body>
      {selectedUnits.map(u => renderUnit(u, t))}
    </Table.Body>
  </Table>;

DerivedUnits.propTypes = {
  selectedUnits: PropTypes.arrayOf(shapes.ContentUnit).isRequired,
  t: PropTypes.func.isRequired,
};

export default DerivedUnits;
