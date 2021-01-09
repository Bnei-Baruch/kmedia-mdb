import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import isEqual from 'react-fast-compare';

import { actions, selectors } from '../../../../../../redux/modules/recommended';
import { selectors as mdbSelectors } from '../../../../../../redux/modules/mdb';
import * as shapes from '../../../../../shapes';
import WipErr from '../../../../../shared/WipErr/WipErr';
import DisplayRecommended from './DisplayRecommended';


const Recommended = ({ unit, filterOutUnits = null, t, displayTitle = true }) => {
  const [dataLoaded, setDataLoaded] = useState(false);

  const wip = useSelector(state => selectors.getWip(state.recommended));
  const err = useSelector(state => selectors.getError(state.recommended));
  let recommendedItems = useSelector(state => selectors.getRecommendedItems(state.recommended)) || [];

  // filter out the given units
  if (Array.isArray(filterOutUnits) && filterOutUnits.length > 0){
    recommendedItems = recommendedItems.filter(item => !filterOutUnits.some(fUnit => fUnit.id === item.uid));
  }

  const recommendedUnits = useSelector(state => recommendedItems
    .map(item => mdbSelectors.getDenormContentUnit(state.mdb, item.uid) || mdbSelectors.getDenormCollection(state.mdb, item.uid))
    .filter(item => !!item)) || [];

  // enable load once per unit
  useEffect(() => {
    setDataLoaded(false);
  }, [unit]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (unit && !wip && !err && !dataLoaded){
      dispatch(actions.fetchRecommended(unit.id));
      setDataLoaded(true);
    }
  }, [dispatch, unit, wip, err, dataLoaded]);

  const wipErr = WipErr({ wip, err, t });

  if (wipErr) {
    return wipErr;
  }

  if (recommendedUnits.length === 0){
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
