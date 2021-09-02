import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import isEqual from 'react-fast-compare';

import { actions, selectors } from '../../../../../../redux/modules/recommended';
import * as shapes from '../../../../../shapes';
import WipErr from '../../../../../shared/WipErr/WipErr';
import DisplayRecommended from './DisplayRecommended';
import useRecommendedUnits from './UseRecommendedUnits';
import { usePrevious } from '../../../../../../helpers/utils';
import { AB_RECOMMEND_EXPERIMENT, AB_RECOMMEND_NEW } from '../../../../../../helpers/ab-testing';
import { AbTestingContext } from '../../../../../../helpers/app-contexts';

// Number of items to try to recommend.
const N = 12;

const SAME_TOPIC = 'same-topic';
const ANY_TOPIC = 'any-topic';
const DEFAULT = 'default';

const Recommended = ({ unit, t, filterOutUnits = [], displayTitle = true }) => {
  const abTesting = useContext(AbTestingContext);
  const [unitId, setUnitId] = useState(null);
  const prevUnitId = usePrevious(unitId);

  const activeVariant = (abTesting && abTesting.getVariant(AB_RECOMMEND_EXPERIMENT)) || '';

  const wip = useSelector(state => selectors.getWip(state.recommended));
  const err = useSelector(state => selectors.getError(state.recommended));

  useEffect(() => {
    if (unit?.id && unit.id !== unitId) {
      setUnitId(unit.id);
    }
  }, [unit, unitId])
  const dispatch = useDispatch();
  useEffect(() => {
    if (unitId && !err && prevUnitId !== unitId) {
      dispatch(actions.fetchRecommended({ id: unitId, size: N, skip: filterOutUnits.map(unit => unit.id), variant: activeVariant }));
    }
  }, [dispatch, err, unitId, filterOutUnits, prevUnitId, activeVariant]);

  const recommendedUnitsTypes = [];
  if (activeVariant === AB_RECOMMEND_NEW) {
    recommendedUnitsTypes.push(SAME_TOPIC);
    recommendedUnitsTypes.push(ANY_TOPIC);
  }

  recommendedUnitsTypes.push(DEFAULT)

  const recommendedUnits = useRecommendedUnits(recommendedUnitsTypes);

  const renderRecommended = [];
  if (activeVariant === AB_RECOMMEND_NEW) {
    if (recommendedUnits[SAME_TOPIC].length !== 0) {
      renderRecommended.push(
        <DisplayRecommended
          key={SAME_TOPIC}
          unit={unit}
          t={t}
          recommendedUnits={recommendedUnits[SAME_TOPIC]}
          title={SAME_TOPIC}
          displayTitle={displayTitle}
          viewLimit={3}
          feedName={SAME_TOPIC} />);
    }

    if (recommendedUnits[ANY_TOPIC].length !== 0) {
      renderRecommended.push(
        <DisplayRecommended
          key={ANY_TOPIC}
          unit={unit}
          t={t}
          recommendedUnits={recommendedUnits[ANY_TOPIC]}
          title={ANY_TOPIC}
          displayTitle={displayTitle}
          viewLimit={3}
          feedName={ANY_TOPIC} />);
    }
  }

  if (recommendedUnits[DEFAULT].length !== 0) {
    renderRecommended.push(
      <DisplayRecommended
        key={DEFAULT}
        unit={unit}
        t={t}
        recommendedUnits={recommendedUnits[DEFAULT]}
        title={DEFAULT}
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
