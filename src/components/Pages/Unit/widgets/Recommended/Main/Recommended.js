import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import isEqual from 'react-fast-compare';

import { actions, selectors } from '../../../../../../redux/modules/recommended';
import { selectors as tagsSelectors } from '../../../../../../redux/modules/tags';
import { selectors as sourcesSelectors } from '../../../../../../redux/modules/sources';
import * as shapes from '../../../../../shapes';
import WipErr from '../../../../../shared/WipErr/WipErr';
import DisplayRecommended from './DisplayRecommended';
import useRecommendedUnits from './UseRecommendedUnits';
import { usePrevious, getSourcesCollections } from '../../../../../../helpers/utils';
import { AB_RECOMMEND_EXPERIMENT, AB_RECOMMEND_NEW, AB_RECOMMEND_RANDOM } from '../../../../../../helpers/ab-testing';
import { AbTestingContext } from '../../../../../../helpers/app-contexts';
import Link from '../../../../../Language/MultiLanguageLink';
import { canonicalLink, landingPageSectionLink } from '../../../../../../helpers/links';
import {
  CT_DAILY_LESSON,
  CT_SPECIAL_LESSON,
  SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_TEXT,
  SGLP_LESSON_SERIES,
  SGLP_PRORGRAMS,
} from '../../../../../../helpers/consts';

// Number of items to try to recommend.
const N = 12;

const sameTopic = tag => `same-topic-${tag}`;
const sameSource = source => `same-source-${source}`;
const sameSourceCollection = source => `same-source-collection-${source}`;
const sameCollection = collection => `same-collection-${collection}`;
const DEFAULT = 'default';
const SERIES = 'series';
const RANDOM_PROGRAMS = 'random-programs';
const RANDOM_UNITS = 'random-units';

const makeLandingPageLink = (t, landingPage) => (
  <Link key={landingPage} to={landingPageSectionLink(landingPage, [])}>
    {t(SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_TEXT[landingPage])}
  </Link>
);

const makeSourceLink = (source, getSourceById) => {
  const { id, name } = getSourceById(source);
  if (!name) {
    return '';
  }

  return <Link key={id} to={`/sources/${id}`}>{name}</Link>;
}

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
  const [unitContentType, setUnitContentType] = useState(null);
  const [unitTags, setUnitTags] = useState([]);
  const [unitSources, setUnitSources] = useState([]);
  const [unitSourceCollections, setUnitSourceCollections] = useState([]);
  const [unitCollections, setUnitCollections] = useState([]);
  const prevUnitId = usePrevious(unitId);

  const activeVariant = (abTesting && abTesting.getVariant(AB_RECOMMEND_EXPERIMENT)) || '';

  const wip = useSelector(state => selectors.getWip(state.recommended));
  const err = useSelector(state => selectors.getError(state.recommended));
  const getTagById = useSelector(state => tagsSelectors.getTagById(state.tags));
  const getSourceById = useSelector(state => sourcesSelectors.getSourceById(state.sources));
  const getPathById = useSelector(state => sourcesSelectors.getPathByID(state.sources));

  useEffect(() => {
    if (unit?.id && unit.id !== unitId) {
      setUnitId(unit.id);
      setUnitContentType(unit.content_type);
      setUnitTags(unit.tags || []);
      setUnitSources(unit.sources || []);
      setUnitCollections(Object.values(unit.collections) || []);
      setUnitSourceCollections(getSourcesCollections(unit.sources || [], getPathById));
    }
  }, [unit, unitId, getPathById]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (unitId && !err && prevUnitId !== unitId) {
      dispatch(actions.fetchRecommended({
        id: unitId,
        content_type: unitContentType,
        tags: unitTags,
        sources: unitSources,
        collections: unitCollections,
        size: N,
        skip: filterOutUnits.map(unit => unit.id),
        variant: activeVariant,
      }));
    }
  }, [dispatch, err, unitId, unitTags, unitCollections, filterOutUnits, prevUnitId, activeVariant, unitContentType, unitSources]);

  const recommendedUnitsTypes = [];
  if (activeVariant === AB_RECOMMEND_NEW) {
    recommendedUnitsTypes.push(RANDOM_PROGRAMS);
    unitTags.forEach(tag => recommendedUnitsTypes.push(sameTopic(tag)));
    unitSources.forEach(source => recommendedUnitsTypes.push(sameSource(source)));
    unitSourceCollections.forEach(source => recommendedUnitsTypes.push(sameSourceCollection(source.id)));
    unitCollections.forEach(collection => recommendedUnitsTypes.push(sameCollection(collection.id)));
    recommendedUnitsTypes.push(SERIES);
  } else if (activeVariant === AB_RECOMMEND_RANDOM) {
    recommendedUnitsTypes.push(RANDOM_UNITS);
  }

  if (activeVariant !== AB_RECOMMEND_RANDOM) {
    recommendedUnitsTypes.push(DEFAULT);
  }

  const recommendedUnits = useRecommendedUnits(recommendedUnitsTypes);

  const renderRecommended = [];
  if (activeVariant === AB_RECOMMEND_NEW) {
    renderRecommended.push(
      <DisplayRecommended
        key={SERIES}
        unit={unit}
        t={t}
        recommendedUnits={recommendedUnits[SERIES]}
        title={<span>{makeLandingPageLink(t, SGLP_LESSON_SERIES)}</span>}
        displayTitle={displayTitle}
        feedName={SERIES}
        showLabels={false} />
    );
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
            feedName={sameCollection(collection.id)}
            showLabels={true} />);
      }
    });
    unitTags.forEach(tag => {
      if (recommendedUnits[sameTopic(tag)].length !== 0) {
        renderRecommended.push(
          <DisplayRecommended
            key={sameTopic(tag)}
            unit={unit}
            t={t}
            recommendedUnits={recommendedUnits[sameTopic(tag)]}
            title={<span>{t('materials.recommended.same-topic')}: {makeTagLink(tag, getTagById)}</span>}
            displayTitle={displayTitle}
            viewLimit={3}
            feedName={sameTopic(tag)}
            showLabels={false} />);
      }
    });
    unitSources.forEach(source => {
      if (recommendedUnits[sameSource(source)].length !== 0) {
        renderRecommended.push(
          <DisplayRecommended
            key={sameSource(source)}
            unit={unit}
            t={t}
            recommendedUnits={recommendedUnits[sameSource(source)]}
            title={<span>{t('materials.recommended.same-source')}: {makeSourceLink(source, getSourceById)}</span>}
            displayTitle={displayTitle}
            viewLimit={3}
            feedName={sameSource(source)}
            showLabels={false} />);
      }
    });
    unitSourceCollections.forEach(source => {
      if (recommendedUnits[sameSourceCollection(source.id)].length !== 0) {
        renderRecommended.push(
          <DisplayRecommended
            key={sameSourceCollection(source.id)}
            unit={unit}
            t={t}
            recommendedUnits={recommendedUnits[sameSourceCollection(source.id)]}
            title={<span>{t('materials.recommended.same-source')}: {makeSourceLink(source.id, getSourceById)}</span>}
            displayTitle={displayTitle}
            viewLimit={3}
            feedName={sameSourceCollection(source.id)}
            showLabels={false} />);
      }
    });
    if (recommendedUnits[RANDOM_PROGRAMS].length !== 0) {
      renderRecommended.push(
        <DisplayRecommended
          key={RANDOM_PROGRAMS}
          unit={unit}
          t={t}
          recommendedUnits={recommendedUnits[RANDOM_PROGRAMS]}
          title={<span>{makeLandingPageLink(t, SGLP_PRORGRAMS)}</span>}
          displayTitle={displayTitle}
          viewLimit={3}
          feedName={RANDOM_PROGRAMS}
          showLabels={false} />
      );
    }
  } else if (activeVariant === AB_RECOMMEND_RANDOM) {
    if (recommendedUnits[RANDOM_UNITS].length !== 0) {
      renderRecommended.push(
        <DisplayRecommended
          key={RANDOM_UNITS}
          unit={unit}
          t={t}
          recommendedUnits={recommendedUnits[RANDOM_UNITS]}
          title={t(`materials.recommended.${DEFAULT}`)}
          displayTitle={displayTitle}
          viewLimit={3}
          feedName={RANDOM_UNITS}
          showLabels={false} />
      );
    }
  }

  if (activeVariant !== AB_RECOMMEND_RANDOM && recommendedUnits[DEFAULT].length !== 0) {
    renderRecommended.push(
      <DisplayRecommended
        key={DEFAULT}
        unit={unit}
        t={t}
        recommendedUnits={recommendedUnits[DEFAULT]}
        title={t(`materials.recommended.${DEFAULT}`)}
        displayTitle={displayTitle}
        viewLimit={activeVariant === AB_RECOMMEND_NEW ? 4 : 0}
        feedName={DEFAULT}
        showLabels={false} />);
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
