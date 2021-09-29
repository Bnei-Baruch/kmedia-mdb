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

export const renderPlaylistUnit = (unit, t, label = null) =>
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
            {label}
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

const RecommendedPlaylist = (recommendForUnit, units, selected, t, chronicles, viewLimit, feedName) => {
  const [expanded, setExpanded] = useState(false);
  const unitsToDisplay = !expanded && viewLimit && viewLimit < units.length ? units.slice(0, viewLimit) : units;
  const recommendedItems = useSelector(state => selectors.getRecommendedItems(feedName, state.recommended)) || [];
  const suggesters = new Map(recommendedItems.map(item => [item.uid, item.suggester]));
  const suggesterIncludes = (uid, str) => (suggesters.get(uid) || '').includes(str);
  const unitsViews = useSelector(state => selectors.getManyViews(unitsToDisplay.map(unit => unit.id), state.recommended))
  const unitsWatchingNow = useSelector(state => selectors.getManyWatchingNow(unitsToDisplay.map(unit => unit.id), state.recommended))
  const views = (uid, index) => (suggesterIncludes(uid, 'Popular') && unitsViews[index]) || -1;
  const watchingNow = (uid, index) => (suggesterIncludes(uid, 'WatchingNow') && unitsWatchingNow[index]) || -1;
  const suggesterLabel = (recommendForUnit, unit) => {
    if (suggesterIncludes(unit.id, 'Last')) {
      if (recommendForUnit.film_date && unit.film_date && recommendForUnit.film_date.localeCompare(unit.film_date) === -1) {
        return t('materials.recommended.last');
      }

      return t('materials.recommended.prev');
    } else if (suggesterIncludes(unit.id, 'Next')) {
      return t('materials.recommended.next');
    } else if (suggesterIncludes(unit.id, 'Prev')) {
      return t('materials.recommended.prev');
    } else if (suggesterIncludes(unit.id, 'Rand')) {
      return t('materials.recommended.rand');
    }

    return '';
  };

  const labelsUsed = new Map();
  const unitLabels = unitsToDisplay.map((unit, index) => {
    if (watchingNow(unit.id, index) !== -1) {
      if (!labelsUsed.has('watchingNow')) {
        labelsUsed.set('watchingNow', unit);
        return (
          <div className="recommend-label">
            <div>
              <small className="text">
                <Popup content={`${watchingNow(unit.id, index)} ${t('materials.recommended.watching-now')}`}
                  trigger={<span>{`${viewsToString(watchingNow(unit.id, index))} ${t('materials.recommended.watching-now')}`}</span>}
                />
              </small>
            </div>
          </div>
        );
      }
    }

    if (views(unit.id, index) !== -1) {
      if (!labelsUsed.has('views')) {
        labelsUsed.set('views', unit);
        return (
          <div className="recommend-label">
            <div>
              <small className="text">
                <Popup content={`${t('materials.recommended.popular')} ${views(unit.id, index)} ${t('materials.recommended.views')}`}
                  trigger={<span>{`${t('materials.recommended.popular')} ${viewsToString(views(unit.id, index))} ${t('materials.recommended.views')}`}</span>}
                />
              </small>
            </div>
          </div>
        );
      }
    }

    const suggesterLabelStr = suggesterLabel(recommendForUnit, unit);

    if (suggesterLabelStr) {
      if (!labelsUsed.has(suggesterLabelStr)) {
        labelsUsed.set(suggesterLabelStr, unit);
        return (
          <div className="recommend-label">
            <div>
              <small className="text">
                <span>{suggesterLabelStr}</span>
              </small>
            </div>
          </div>
        );
      }
    }

    return null;
  });

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
              {renderPlaylistUnit(unit, t, unitLabels[index])}
            </List.Item>
          ))
        }
        { viewLimit && viewLimit < units.length ?
          <Link className="recommend-more" onClick={() => setExpanded(!expanded)}>{expanded ? t('materials.recommended.less') : t('materials.recommended.more')}</Link>
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
      {RecommendedPlaylist(unit, recommendedUnits, unitCollectionId, t, chronicles, viewLimit, feedName)}
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
