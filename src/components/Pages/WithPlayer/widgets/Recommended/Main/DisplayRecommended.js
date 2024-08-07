import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Header, List, Popup } from 'semantic-ui-react';

import * as shapes from '../../../../../shapes';
import { canonicalCollection, isEmpty } from '../../../../../../helpers/utils';
import Link from '../../../../../Language/MultiLanguageLink';
import { canonicalLink } from '../../../../../../helpers/links';
import ContentItemContainer, {
  SourceItemContainer,
  TagItemContainer
} from '../../../../../shared/ContentItem/ContentItemContainer';
import { ClientChroniclesContext } from '../../../../../../helpers/app-contexts';
import { IsCollectionContentType, IsUnitContentType } from '../../../../../../helpers/consts';
import {
  recommendedGetManyViewsSelector,
  recommendedGetManyWatchingNowSelector,
  recommendedGetItemsSelector
} from '../../../../../../redux/selectors';

const watchingNowToString = watchingNow => {
  if (watchingNow >= 1000) {
    if (watchingNow % 1000 > 50) {
      return `${Number.parseFloat(watchingNow / 1000).toFixed(1)}K`;
    }

    return `${Math.round(watchingNow / 1000)}K`;
  }

  return `${watchingNow}`;
};

const padOneZero = str => str.length === 1 ? `0${str}` : str;

const RecommendedPlaylist = ({ recommendForUnit, units, selected, t, chronicles, viewLimit, feedName, showLabels }) => {
  const [expanded, setExpanded] = useState(false);
  const unitsToDisplay          = !expanded && viewLimit && !isEmpty(units) && viewLimit < units.length ? units.slice(0, viewLimit) : units || [];
  const recommendedItems        = useSelector(state => recommendedGetItemsSelector(state, feedName)) || [];
  const suggesters              = new Map(recommendedItems.map(item => [item.uid, item.suggester]));
  const suggesterIncludes       = (uid, str) => (suggesters.get(uid) || '').includes(str);
  const unitsViews              = useSelector(state => recommendedGetManyViewsSelector(state, unitsToDisplay));
  const unitsWatchingNow        = useSelector(state => recommendedGetManyWatchingNowSelector(state, unitsToDisplay));
  const watchingNow             = (uid, index) => (suggesterIncludes(uid, 'WatchingNow') && unitsWatchingNow[index]) || -1;
  const twoDaysAgo              = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const filmDateNow    = `${twoDaysAgo.getFullYear()}-${padOneZero(String(twoDaysAgo.getMonth() + 1))}-${padOneZero(String(twoDaysAgo.getDate()))}`;
  const suggesterLabel = (recommendForUnit, unit, index) => {
    if (unit.film_date && unit.film_date.localeCompare(filmDateNow) >= 0) {
      return t('materials.recommended.new');
    }

    return '';
  };

  const labelsUsed = new Map();
  const unitLabels = unitsToDisplay?.map((unit, index) => {
    if (!showLabels) {
      return null;
    }

    if (watchingNow(unit.id, index) !== -1) {
      if (!labelsUsed.has('watchingNow')) {
        labelsUsed.set('watchingNow', unit);
        return (
          <div className="recommend-label">
            <div>
              <small className="text">
                <Popup
                  content={`${watchingNow(unit.id, index)} ${t('materials.recommended.watching-now')}`}
                  trigger={
                    <span>{`${watchingNowToString(watchingNow(unit.id, index))} ${t('materials.recommended.watching-now')}`}</span>}
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

  const collectionContent = (unit, index) => <ContentItemContainer
    id={(unit.cuIDs && unit.cuIDs.length && unit.cuIDs[0]) || ''}
    ccuId={unit.id}
    key={unit.id}
    link={canonicalLink(unit)}
    withCUInfo={false}
    withCCUInfo={true}
    asList
    label={unitLabels[index]}
    size={'small'}/>;

  const unitContent = (unit, index) => <ContentItemContainer
    id={unit.id}
    key={unit.id}
    asList
    label={unitLabels[index]}
    size={'small'}/>;

  /* TODO: Improve the distinction between source and topic. */
  const sourceContent = (unit, index) => <SourceItemContainer
    id={unit.id}
    key={unit.id}
    asList
    label={unitLabels[index]}
    size={'small'}/>;

  const tagContent = (unit, index) => <TagItemContainer
    id={unit.id}
    key={unit.id}
    asList
    label={unitLabels[index]}
    size={'small'}/>;

  const content = (unit, index) => {
    let f = tagContent;
    if (unit.content_type && IsCollectionContentType(unit.content_type)) {
      f = collectionContent;
    } else if (unit.content_type && IsUnitContentType(unit.content_type)) {
      f = unitContent;
    } else if (unit.type) {
      f = sourceContent;
    }

    return f(unit, index);
  };

  return (
    <Container>
      <div className="avbox__playlist-view">
        <List selection>
          {
            unitsToDisplay?.map((unit, index) => (
              <List.Item
                key={unit.id}
                name={`${index}`}
                active={index === selected}
                onClick={() => chronicles.recommendSelected(unit.id)}
              >
                {content(unit)}
              </List.Item>
            ))
          }
        </List>
      </div>
      {
        viewLimit && !!units && viewLimit < units.length ? (
          <Link
            className="recommend-more"
            onClick={() => setExpanded(!expanded)}>
            {
              expanded ? t('materials.recommended.less') : t('materials.recommended.more')
            }
          </Link>
        ) : <div className="recommend-more-placeholder"/>
      }
    </Container>
  );
};

const DisplayRecommended = (
  {
    unit,
    t,
    recommendedUnits,
    displayTitle = true,
    title = '',
    viewLimit = 0,
    feedName = 'default',
    showLabels = true
  }
) => {
  const chronicles       = useContext(ClientChroniclesContext);
  const unitCollection   = canonicalCollection(unit);
  const unitCollectionId = unitCollection ? unitCollection.id : null;

  if (isEmpty(recommendedUnits)) return null;
  const props = {
    recommendForUnit: unit,
    units           : recommendedUnits,
    selected        : unitCollectionId,
    t,
    chronicles,
    viewLimit,
    feedName,
    showLabels
  };
  return (
    <div className="avbox__playlist-wrapper">
      {displayTitle && <Header as="h3" content={title}/>}
      {<RecommendedPlaylist {...props} />}
    </div>
  );
};

DisplayRecommended.propTypes = {
  unit            : shapes.EventItem,
  recommendedUnits: PropTypes.arrayOf(shapes.EventItem),
  t               : PropTypes.func.isRequired,
  displayTitle    : PropTypes.bool
};

const areEqual = (prevProps, nextProps) =>
  !nextProps.unit || (
    prevProps.unit?.id === nextProps.unit.id &&
    prevProps.recommendedUnits.length === nextProps.recommendedUnits.length &&
    prevProps.recommendedUnits.every((unit, index) => nextProps.recommendedUnits[index].id === unit.id)
  );

export default React.memo(DisplayRecommended, areEqual);
