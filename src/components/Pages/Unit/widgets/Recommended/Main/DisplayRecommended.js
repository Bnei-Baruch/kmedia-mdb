import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Header, Icon, List, Popup, Table } from 'semantic-ui-react';
import { useExperiment, emitter } from '@marvelapp/react-ab-test';

import * as shapes from '../../../../../shapes';
import { NO_NAME } from '../../../../../../helpers/consts';
import { canonicalLink } from '../../../../../../helpers/links';
import { formatDuration, canonicalCollection } from '../../../../../../helpers/utils';
import Link from '../../../../../Language/MultiLanguageLink';
import UnitLogo from '../../../../../shared/Logo/UnitLogo';
import { ClientChroniclesContext } from "../../../../../../helpers/app-contexts";
import { selectors } from '../../../../../../redux/modules/recommended';

const getCollectionId = unit => {
  const unitCollection = canonicalCollection(unit);
  return unitCollection ? unitCollection.id : null;
}

const viewsToString = (views) => {
  if (views > 999) {
    return `${Math.trunc(views/1000)}K`
  }
  return `${views}`
}

export const renderPlaylistUnit = (unit, t, views = -1) => {
  return (
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
              {views !== -1 && <br />}
              {views !== -1 &&
                <small className="text">
                  <Popup content={views} trigger={<span><Icon name="eye" style={{marginRight: '2px'}} />{viewsToString(views)}</span>} />
                </small>
              }
            </Header>
          </Table.Cell>
          {unit.duration &&
          <Table.Cell textAlign="right" width={2}>
            <span>{formatDuration(unit.duration)}</span>
          </Table.Cell>}
        </Table.Row>
      </Table.Body>
    </Table>
  );
}


const renderPlaylist = (units, selected, t, chronicles, viewLimit, showViews) => {
  const [expanded, setExpanded] = useState(false);
  const unitsToDisplay = !expanded && viewLimit && viewLimit < units.length ? units.slice(0, viewLimit) : units;
  const views = showViews ? useSelector(state => selectors.getManyViews(unitsToDisplay.map((unit) => unit.id), state.recommended)) : [];
  return (
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
              {renderPlaylistUnit(unit, t, showViews ? views[index] : -1)}
            </List.Item>
          ))
        }
        { viewLimit && viewLimit < units.length ?
            <Link onClick={() => setExpanded(!expanded)}>{expanded ? 'Less' : 'More'}</Link>
           : null }
      </List>
    </div>
  );
};


const DisplayRecommended = ({ unit, t, recommendedUnits, displayTitle = true, title = 'header', viewLimit = 0, showViews = false }) => {
  const chronicles = useContext(ClientChroniclesContext);
  const unitCollection = canonicalCollection(unit);
  const unitCollectionId = unitCollection ? unitCollection.id : null;

  return (
    <div className="avbox__playlist-wrapper">
      {displayTitle && <Header as="h3" content={t(`materials.recommended.${title}`)} />}
      {renderPlaylist(recommendedUnits, unitCollectionId, t, chronicles, viewLimit, showViews)}
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
