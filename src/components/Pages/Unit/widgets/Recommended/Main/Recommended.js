import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import isEqual from 'react-fast-compare';

import { actions, selectors } from '../../../../../../redux/modules/recommended';
import { selectors as tagsSelectors } from '../../../../../../redux/modules/tags';
import * as shapes from '../../../../../shapes';
import WipErr from '../../../../../shared/WipErr/WipErr';
import DisplayRecommended from './DisplayRecommended';
import useRecommendedUnits from './UseRecommendedUnits';
import { usePrevious } from '../../../../../../helpers/utils';
import { AB_RECOMMEND_EXPERIMENT, AB_RECOMMEND_NEW } from '../../../../../../helpers/ab-testing';
import { AbTestingContext } from '../../../../../../helpers/app-contexts';
import Link from '../../../../../Language/MultiLanguageLink';
import { canonicalLink } from '../../../../../../helpers/links';
import { CT_DAILY_LESSON, CT_SPECIAL_LESSON } from '../../../../../../helpers/consts';

// Number of items to try to recommend.
const N = 12;

const sameTopic = tag => `same-topic-${tag}`;
const sameCollection = collection => `same-collection-${collection}`;
const DEFAULT = 'default';

const makeTagLink = (tag, getTagById) => {
  const { id, label } = getTagById(tag);
  if (!label) {
    return '';
  }

  return <Link key={id} to={`/topics/${id}`}>{label}</Link>;
}

const makeCollectionLink = (collection, t) => {
  let display;
  switch (collection.content_type) {
    case CT_DAILY_LESSON:
    case CT_SPECIAL_LESSON: {
      const ctLabel = t(`constants.content-types.${CT_DAILY_LESSON}`);
      const fd      = t('values.date', { date: collection.film_date });
      display       = `${ctLabel} ${fd}`;
      break;
    }

    default:
      display = collection.name;
      break;
  }

  return <Link key={collection.id} to={canonicalLink(collection)}>{display}</Link>;
}

const Recommended = ({ unit, t, filterOutUnits = [], displayTitle = true }) => {
  const abTesting = useContext(AbTestingContext);
  const [unitId, setUnitId] = useState(null);
  const [unitTags, setUnitTags] = useState([]);
  const [unitCollections, setUnitCollections] = useState([]);
  const prevUnitId = usePrevious(unitId);

  const activeVariant = (abTesting && abTesting.getVariant(AB_RECOMMEND_EXPERIMENT)) || '';

  const wip = useSelector(state => selectors.getWip(state.recommended));
  const err = useSelector(state => selectors.getError(state.recommended));
  const getTagById = useSelector(state => tagsSelectors.getTagById(state.tags));

  console.log(unit);

  useEffect(() => {
    if (unit?.id && unit.id !== unitId) {
      setUnitId(unit.id);
      setUnitTags(unit.tags || []);
      setUnitCollections(Object.values(unit.collections) || []);
    }
  }, [unit, unitId])
  const dispatch = useDispatch();
  useEffect(() => {
    if (unitId && !err && prevUnitId !== unitId) {
      dispatch(actions.fetchRecommended({
        id: unitId,
        tags: unitTags,
        collections: unitCollections,
        size: N,
        skip: filterOutUnits.map(unit => unit.id),
        variant: activeVariant,
      }));
    }
  }, [dispatch, err, unitId, unitTags, unitCollections, filterOutUnits, prevUnitId, activeVariant]);

  const recommendedUnitsTypes = [];
  if (activeVariant === AB_RECOMMEND_NEW) {
    unitTags.forEach(tag => recommendedUnitsTypes.push(sameTopic(tag)));
    unitCollections.forEach(collection => recommendedUnitsTypes.push(sameCollection(collection.id)));
  }

  recommendedUnitsTypes.push(DEFAULT)

  const recommendedUnits = useRecommendedUnits(recommendedUnitsTypes);

  const renderRecommended = [];
  if (activeVariant === AB_RECOMMEND_NEW) {
    unitTags.forEach(tag => {
      if (recommendedUnits[sameTopic(tag)].length !== 0) {
        renderRecommended.push(
          <DisplayRecommended
            key={sameTopic(tag)}
            unit={unit}
            t={t}
            recommendedUnits={recommendedUnits[sameTopic(tag)]}
            title={<span>{t('materials.recommended.same-topic')} {makeTagLink(tag, getTagById)}</span>}
            displayTitle={displayTitle}
            viewLimit={3}
            feedName={sameTopic(tag)} />);
      }
    });

    unitCollections.forEach(collection => {
      if (recommendedUnits[sameCollection(collection.id)].length !== 0) {
        renderRecommended.push(
          <DisplayRecommended
            key={sameCollection(collection.id)}
            unit={unit}
            t={t}
            recommendedUnits={recommendedUnits[sameCollection(collection.id)]}
            title={<span>{t(`materials.recommended.same-collection`)} {makeCollectionLink(collection, t)}</span>}
            displayTitle={displayTitle}
            viewLimit={3}
            feedName={sameCollection(collection.id)} />);
      }
    });
  }

  if (recommendedUnits[DEFAULT].length !== 0) {
    renderRecommended.push(
      <DisplayRecommended
        key={DEFAULT}
        unit={unit}
        t={t}
        recommendedUnits={recommendedUnits[DEFAULT]}
        title={t(`materials.recommended.${DEFAULT}`)}
        displayTitle={displayTitle}
        viewLimit={activeVariant === AB_RECOMMEND_NEW ? 4 : 0}
        feedName={DEFAULT} />);
  }

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) {
    return wipErr;
  }

  if (renderRecommended.length) {
    return renderRecommended;
  }

  return null;
}

Recommended.propTypes = {
  unit: shapes.EventItem.isRequired,
  t: PropTypes.func.isRequired,
  filterOutUnits: PropTypes.arrayOf(shapes.EventItem),
  displayTitle: PropTypes.bool
}

const areEqual = (prevProps, nextProps) =>
  prevProps.unit.id === nextProps.unit.id
  && isEqual(prevProps.filterOutUnits, nextProps.filterOutUnits);

export default React.memo(withNamespaces()(Recommended), areEqual);
