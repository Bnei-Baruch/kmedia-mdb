import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Header, List, Popup } from 'semantic-ui-react';

import * as shapes from '../../../../../shapes';
import { canonicalCollection } from '../../../../../../helpers/utils';
import Link from '../../../../../Language/MultiLanguageLink';
import { canonicalLink } from '../../../../../../helpers/links';
import ContentItemContainer from '../../../../../shared/ContentItem/ContentItemContainer';
import { ClientChroniclesContext } from '../../../../../../helpers/app-contexts';
import { selectors } from '../../../../../../redux/modules/recommended';
import { IsCollectionContentType } from '../../../../../../helpers/consts';

const watchingNowToString = watchingNow => {
  if (watchingNow >= 1000) {
    if (watchingNow % 1000 > 50) {
      return `${Number.parseFloat(watchingNow/1000).toFixed(1)}K`;
    }

    return `${Math.round(watchingNow/1000)}K`;
  }

  return `${watchingNow}`;
}

const padOneZero = str => str.length === 1 ? `0${str}` : str;

const RecommendedPlaylist = (recommendForUnit, units, selected, t, chronicles, viewLimit, feedName) => {
  const [expanded, setExpanded] = useState(false);
  const unitsToDisplay = !expanded && viewLimit && viewLimit < units.length ? units.slice(0, viewLimit) : units;
  const recommendedItems = useSelector(state => selectors.getRecommendedItems(feedName, state.recommended)) || [];
  const suggesters = new Map(recommendedItems.map(item => [item.uid, item.suggester]));
  const suggesterIncludes = (uid, str) => (suggesters.get(uid) || '').includes(str);
  const unitsViews = useSelector(state => selectors.getManyViews(unitsToDisplay.map(unit => unit.id), state.recommended))
  const unitsWatchingNow = useSelector(state => selectors.getManyWatchingNow(unitsToDisplay.map(unit => unit.id), state.recommended))
  const watchingNow = (uid, index) => (suggesterIncludes(uid, 'WatchingNow') && unitsWatchingNow[index]) || -1;
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const filmDateNow = `${twoDaysAgo.getFullYear()}-${padOneZero(String(twoDaysAgo.getMonth()+1))}-${padOneZero(String(twoDaysAgo.getDate()))}`;
  const suggesterLabel = (recommendForUnit, unit, index) => {
    if (unit.film_date && unit.film_date.localeCompare(filmDateNow) >= 0) {
      return t('materials.recommended.new');
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
                  trigger={<span>{`${watchingNowToString(watchingNow(unit.id, index))} ${t('materials.recommended.watching-now')}`}</span>}
                />
              </small>
            </div>
          </div>
        );
      }
    }

    if (!labelsUsed.has('Popular') && suggesterIncludes(unit.id, 'Popular') && unitsViews[index]) {
      labelsUsed.set('Popular', unit);
      return (
        <div className="recommend-label">
          <div>
            <small className="text">
              <span>{t('materials.recommended.popular')}</span>
            </small>
          </div>
        </div>
      );
    }


    const suggesterLabelStr = suggesterLabel(recommendForUnit, unit, index);

    if (suggesterLabelStr) {
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

    return null;
  });

  return (
    <div>
      <div className="avbox__playlist-view">
        <List selection>
          {
            unitsToDisplay.map((unit, index) => (
              <List.Item
                key={unit.id}
                name={`${index}`}
                active={index === selected}
                onClick={() => chronicles.recommendSelected(unit.id)}
              >
                {IsCollectionContentType(unit.content_type) ?
                  <ContentItemContainer
                    id={unit.cuIDs[0]}
                    ccuId={unit.id}
                    key={unit.id}
                    link={canonicalLink(unit)}
                    withCUInfo={false}
                    withCCUInfo={true}
                    asList
                    label={unitLabels[index]}
                    size={'small'} />
                  :
                  <ContentItemContainer
                    id={unit.id}
                    key={unit.id}
                    asList
                    label={unitLabels[index]}
                    size={'small'} />
                }
              </List.Item>
            ))
          }
        </List>
      </div>
      { viewLimit && viewLimit < units.length ?
        <Link className="recommend-more" onClick={() => setExpanded(!expanded)}>{expanded ? t('materials.recommended.less') : t('materials.recommended.more')}</Link>
        : <div className="recommend-more-placeholder"></div> }
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
  prevProps.unit.id === nextProps.unit.id &&
  prevProps.recommendedUnits.length === nextProps.recommendedUnits.length &&
  prevProps.recommendedUnits.every((unit, index) => nextProps.recommendedUnits[index].id === unit.id);

export default React.memo(DisplayRecommended, areEqual);
