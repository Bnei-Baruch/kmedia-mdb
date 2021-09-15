import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Header, List, Popup, Table } from 'semantic-ui-react';

import * as shapes from '../../../../../shapes';
import { NO_NAME } from '../../../../../../helpers/consts';
import { canonicalLink } from '../../../../../../helpers/links';
import { formatDuration, canonicalCollection } from '../../../../../../helpers/utils';
import Link from '../../../../../Language/MultiLanguageLink';
import UnitLogo from '../../../../../shared/Logo/UnitLogo';
import { ClientChroniclesContext } from '../../../../../../helpers/app-contexts';
import { selectors } from '../../../../../../redux/modules/recommended';

const getCollectionId = unit => {
  const unitCollection = canonicalCollection(unit);
  return unitCollection ? unitCollection.id : null;
}

const viewsToString = views => {
  if (views >= 1000) {
    if (views % 1000 > 50) {
      return `${Number.parseFloat(views/1000).toFixed(1)}K`;
    }

    return `${Math.round(views/1000)}K`;
  }

  return `${views}`;
}

export const renderPlaylistUnit = (unit, t, views = -1, watchingNow = -1, suggesterLabelText = '') => {
  const showLabel = views !== -1 || watchingNow !== -1 || suggesterLabelText;
  const watchingNowLabel =
    <small className="text">
      <Popup content={`${watchingNow} ${t('materials.recommended.watching-now')}`}
        trigger={<span>{`${viewsToString(watchingNow)} ${t('materials.recommended.watching-now')}`}</span>}
      />
    </small>;
  const viewsLabel =
    <small className="text">
      <Popup content={`${t('materials.recommended.popular')} ${views} ${t('materials.recommended.views')}`}
        trigger={<span>{`${t('materials.recommended.popular')} ${viewsToString(views)} ${t('materials.recommended.views')}`}</span>}
      />
    </small>;
  const suggesterLabel =
    <small className="text">
      <span>{suggesterLabelText}</span>
    </small>;
  // Prefer watching now label over views over other suggester label.
  const label = () => (
    <div className="recommend-label">
      {watchingNow !== -1 && watchingNowLabel}
      {watchingNow === -1 && views !== -1 && viewsLabel}
      {watchingNow === -1 && views === -1 && suggesterLabelText && suggesterLabel}
    </div>
  );
  return (
    <Table selectable compact unstackable>
      <Table.Body>
        <Table.Row verticalAlign="middle">
          <Table.Cell textAlign="left" width={4}>
            <div className="recommend-cell">
              <UnitLogo
                unitId={unit.id}
                collectionId={getCollectionId(unit)}
                fallbackImg='programs'
              />
              {showLabel && label()}
            </div>
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
    </Table>
  );
}


const RecommendedPlaylist = (units, selected, t, chronicles, viewLimit, feedName) => {
  const [expanded, setExpanded] = useState(false);
  const unitsToDisplay = !expanded && viewLimit && viewLimit < units.length ? units.slice(0, viewLimit) : units;
  const recommendedItems = useSelector(state => selectors.getRecommendedItems(feedName, state.recommended)) || [];
  const suggesters = new Map(recommendedItems.map(item => [item.uid, item.suggester]));
  const suggesterIncludes = (uid, str) => (suggesters.get(uid) || '').includes(str);
  const unitsViews = useSelector(state => selectors.getManyViews(unitsToDisplay.map(unit => unit.id), state.recommended))
  const unitsWatchingNow = useSelector(state => selectors.getManyWatchingNow(unitsToDisplay.map(unit => unit.id), state.recommended))
  const views = (uid, index) => (suggesterIncludes(uid, 'Popular') && unitsViews[index]) || -1;
  const watchingNow = (uid, index) => (suggesterIncludes(uid, 'WatchingNow') && unitsWatchingNow[index]) || -1;
  const suggesterLabel = uid => {
    if (suggesterIncludes(uid, 'Last')) {
      return t('materials.recommended.last');
    } else if (suggesterIncludes(uid, 'Next')) {
      return t('materials.recommended.next');
    } else if (suggesterIncludes(uid, 'Prev')) {
      return t('materials.recommended.prev');
    } else if (suggesterIncludes(uid, 'Rand')) {
      return t('materials.recommended.rand');
    }

    return '';
  };

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
              {renderPlaylistUnit(unit, t, views(unit.id, index), watchingNow(unit.id, index), suggesterLabel(unit.id))}
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


const DisplayRecommended = ({ unit, t, recommendedUnits, displayTitle = true, title = '', viewLimit = 0, feedName = 'default' }) => {
  const chronicles = useContext(ClientChroniclesContext);
  const unitCollection = canonicalCollection(unit);
  const unitCollectionId = unitCollection ? unitCollection.id : null;

  return (
    <div className="avbox__playlist-wrapper">
      {displayTitle && <Header as="h3" content={title} />}
      {RecommendedPlaylist(recommendedUnits, unitCollectionId, t, chronicles, viewLimit, feedName)}
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
