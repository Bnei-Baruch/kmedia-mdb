import React from 'react';
import PropTypes from 'prop-types';
import { Table, List } from 'semantic-ui-react';
import { withNamespaces } from 'react-i18next';

import { NO_NAME, CT_VIDEO_PROGRAM_CHAPTER, CT_CLIP } from '../../../../../helpers/consts';
import { CollectionsBreakdown } from '../../../../../helpers/mdb';
import { canonicalLink } from '../../../../../helpers/links';
import { ellipsize } from '../../../../../helpers/strings';
import Link from '../../../../Language/MultiLanguageLink';
import UnitLogo from '../../../../shared/Logo/UnitLogo';
import { FrownSplash } from '../../../../shared/Splash/Splash';

export const derivedUnitsContentTypes = [CT_VIDEO_PROGRAM_CHAPTER, CT_CLIP];

const renderUnit = (unit, t) => {
  const breakdown = new CollectionsBreakdown(Object.values(unit.collections || {}));
  const clips     = breakdown.getClips();

  const relatedItems = clips.map(x => (
    <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
      {x.name || NO_NAME}
    </List.Item>
  )).concat(breakdown.getAllButClips().map(x => (
    <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
      {x.name}
    </List.Item>
  )));

  let filmDate = '';
  if (unit.film_date) {
    filmDate = t('values.date', { date: unit.film_date });
  }

  const link = canonicalLink(unit);

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
        <Link className="index__title" to={link}>
          {unit.name || NO_NAME}
        </Link>
        {
          unit.description
            ? (
              <div className="index__description mobile-hidden">
                {ellipsize(unit.description)}
              </div>
            )
            : null
        }
        { relatedItems
          ? <List horizontal divided link className="index__collections" size="tiny">
            <List.Item>
              <List.Header>{t('programs.list.item_of')}</List.Header>
            </List.Item>
            {relatedItems}
          </List>
          : null
        }
      </Table.Cell>
    </Table.Row>
  );
};

const DerivedUnits = ({ objUnits, t }) => {
  if (!objUnits){
    return <FrownSplash text={t('messages.source-content-not-found')} />;
  }

  const units = Object.values(objUnits);
  console.log(units);

  const selectedUnits = units.filter(u => derivedUnitsContentTypes.includes(u.content_type));

  if (selectedUnits.length === 0){
    return null; 
  }

  return (
    <Table unstackable basic="very" className="index" sortable>
      <Table.Body>
        {selectedUnits.map(u => renderUnit(u, t))}
      </Table.Body>
    </Table>
  );
}

DerivedUnits.propTypes = {
  objUnits: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(DerivedUnits);