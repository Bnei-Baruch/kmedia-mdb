import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Header, List, Table } from 'semantic-ui-react';

import * as shapes from '../../../../../shapes';
import { NO_NAME } from '../../../../../../helpers/consts';
import { canonicalLink } from '../../../../../../helpers/links';
import { formatDuration, canonicalCollection } from '../../../../../../helpers/utils';
import Link from '../../../../../Language/MultiLanguageLink';
import UnitLogo from '../../../../../shared/Logo/UnitLogo';
import { ClientChroniclesContext } from '../../../../../../helpers/app-contexts';

const getCollectionId = unit => {
  const unitCollection = canonicalCollection(unit);
  return unitCollection ? unitCollection.id : null;
}

export const renderPlaylistUnit = (unit, t) =>
  <Table selectable compact unstackable>
    <Table.Body>
      <Table.Row verticalAlign="middle">
        <Table.Cell textAlign="left" width={4}>
          <UnitLogo
            unitId={unit.id}
            collectionId={getCollectionId(unit)}
            fallbackImg='programs'
          />
        </Table.Cell>
        <Table.Cell textAlign="left" width={10}>
          <Header as="h5">
            <small className="text grey uppercase">
              {t('values.date', { date: unit.film_date })}
            </small>
            <br />
            <span>{unit.name || NO_NAME}</span>
          </Header>
        </Table.Cell>
        {unit.duration &&
        <Table.Cell textAlign="right" width={2}>
          <span>{formatDuration(unit.duration)}</span>
        </Table.Cell>}
      </Table.Row>
    </Table.Body>
  </Table>;


const renderPlaylist = (unitsToDisplay, selected, t, chronicles) =>
  <div className="avbox__playlist-view">
    <List selection size="tiny">
      {
        unitsToDisplay.map((unit, index) => (
          <List.Item
            key={unit.id}
            name={`${index}`}
            active={index === selected}
            as={Link}
            to={canonicalLink(unit)}
            onClick={() => chronicles.recommendSelected(unit.id)}
          >
            {renderPlaylistUnit(unit, t)}
          </List.Item>
        ))
      }
    </List>
  </div>;


const DisplayRecommended = ({ unit, t, recommendedUnits, displayTitle = true }) => {
  const chronicles = useContext(ClientChroniclesContext);
  const unitCollection = canonicalCollection(unit);
  const unitCollectionId = unitCollection ? unitCollection.id : null;

  return (
    <div className="avbox__playlist-wrapper">
      { displayTitle && <Header as="h3" content={t('materials.recommended.header')} /> }
      {renderPlaylist(recommendedUnits, unitCollectionId, t, chronicles)}
    </div>
  );
}

DisplayRecommended.propTypes = {
  unit: shapes.EventItem.isRequired,
  recommendedUnits: PropTypes.arrayOf(shapes.EventItem),
  t: PropTypes.func.isRequired,
  displayTitle: PropTypes.bool
}

const areEqual = (prevProps, nextProps) =>
  prevProps.unit.id === nextProps.unit.id;

export default React.memo(DisplayRecommended, areEqual);
