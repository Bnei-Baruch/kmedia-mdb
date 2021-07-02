import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import isEqual from 'react-fast-compare';
import { useExperiment, emitter } from '@marvelapp/react-ab-test';

import { actions, selectors } from '../../../../../../redux/modules/recommended';
import * as shapes from '../../../../../shapes';
import WipErr from '../../../../../shared/WipErr/WipErr';
import DisplayRecommended from './DisplayRecommended';
import useRecommendedUnits from './UseRecommendedUnits';
import { usePrevious } from '../../../../../../helpers/utils';
import { AB_RECOMMEND_EXPERIMENT, AB_RECOMMEND_CURRENT, AB_RECOMMEND_NEW } from '../../../../../../helpers/ab-testing';
import { AbTestingContext, ClientChroniclesContext } from "../../../../../../helpers/app-contexts";

// Number of items to try to recommend.
const N = 12;

const Recommended = ({ unit, t, filterOutUnits = [], displayTitle = true }) => {
  const abTesting = useContext(AbTestingContext);
  const [unitId, setUnitId] = useState(null);
  const prevUnitId = usePrevious(unitId);

  const activeVariant = abTesting && abTesting.getVariant(AB_RECOMMEND_EXPERIMENT) || '';
  console.log('Active variant', activeVariant);

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
      dispatch(actions.fetchRecommended({ id: unitId, size: N, skip: filterOutUnits.map((unit) => unit.id), variant: activeVariant }));
    }
  }, [dispatch, err, unitId, filterOutUnits, prevUnitId, activeVariant]);

  const renderRecommended = [];
  if (activeVariant === AB_RECOMMEND_NEW) {
    const mostViewedUnits = useRecommendedUnits('most-viewed');
    if (mostViewedUnits.length !== 0) {
      renderRecommended.push(
        <DisplayRecommended
          key='most-viewed'
          unit={unit}
          t={t}
          recommendedUnits={mostViewedUnits}
          title={'most-viewed'}
          displayTitle={displayTitle}
          viewLimit={1}
          showViews={true} />);
    }
    const newUnits = useRecommendedUnits('new');
    if (newUnits.length !== 0) {
      renderRecommended.push(
        <DisplayRecommended
          key='new'
          unit={unit}
          t={t}
          recommendedUnits={newUnits}
          title={'new'}
          displayTitle={displayTitle}
          viewLimit={2}
          showViews={false} />);
    }
    const sameTagUnits = useRecommendedUnits('same-tag');
    if (sameTagUnits.length !== 0) {
      renderRecommended.push(
        <DisplayRecommended
          key='same-tag'
          unit={unit}
          t={t}
          recommendedUnits={sameTagUnits}
          title={'same-tag'}
          displayTitle={displayTitle}
          viewLimit={2}
          showViews={false} />);
    }
  }
  const recommendedUnits = useRecommendedUnits('default');
  if (recommendedUnits.length !== 0) {
    renderRecommended.push(
      <DisplayRecommended
        key='default'
        unit={unit}
        t={t}
        recommendedUnits={recommendedUnits}
        title={'header'}
        viewLimit={activeVariant === AB_RECOMMEND_NEW ? 4 : 0}
        displayTitle={displayTitle} />);
  }

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) {
    return wipErr;
  }

  console.log(renderRecommended);
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
