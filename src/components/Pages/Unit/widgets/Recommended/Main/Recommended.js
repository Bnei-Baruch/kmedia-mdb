import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import isEqual from 'react-fast-compare';

import { actions, selectors } from '../../../../../../redux/modules/recommended';
import * as shapes from '../../../../../shapes';
import WipErr from '../../../../../shared/WipErr/WipErr';
import DisplayRecommended from './DisplayRecommended';
import useRecommendedUnits from './UseRecommendedUnits';

// Number of items to try to recommend.
const N = 12;

const Recommended = ({ unit, t, filterOutUnits = [], displayTitle = true }) => {
  const [unitId, setUnitId] = useState(null);

  const wip = useSelector(state => selectors.getWip(state.recommended));
  const err = useSelector(state => selectors.getError(state.recommended));

  useEffect(() => {
    if (unit?.id && unit.id !== unitId) {
      setUnitId(unit.id);
    }
  }, [unit, unitId])
  const dispatch = useDispatch();
  useEffect(() => {
    if (unitId && !err) {
      dispatch(actions.fetchRecommended({id: unitId, size: N, skip: filterOutUnits.map((unit) => unit.id)}));
    }
  }, [dispatch, err, unitId]);

  const recommendedUnits = useRecommendedUnits();

  const wipErr = WipErr({ wip, err, t });

  if (wipErr) {
    return wipErr;
  }

  if (recommendedUnits.length === 0) {
    return null;
  }

  return <DisplayRecommended unit={unit} t={t} recommendedUnits={recommendedUnits} displayTitle={displayTitle} />
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
