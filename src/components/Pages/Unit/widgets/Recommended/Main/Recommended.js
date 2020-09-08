import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { actions, selectors } from '../../../../../../redux/modules/recommended';
import { selectors as mdbSelectors } from '../../../../../../redux/modules/mdb';
import * as shapes from '../../../../../shapes';
import WipErr from '../../../../../shared/WipErr/WipErr';
import DisplayRecommended from './DisplayRecommended';


const Recommended = ({ unit, t, /* displayHandler */ }) => {
  const wip = useSelector(state => selectors.getWip(state.recommended));
  const err = useSelector(state => selectors.getError(state.recommended));
  
  const [dataLoaded, setDataLoaded] = useState(false);
  const wipErr = WipErr({ wip, err, t });

  const dispatch = useDispatch();
  useEffect(() => {
    if (unit && !dataLoaded && !wip && !err){
      dispatch(actions.fetchRecommended(unit.id));
      setDataLoaded(true);
    }
  }, [dataLoaded, dispatch, unit, wip, err]);

  const recommendedItems = useSelector(state => selectors.getRecommendedItems(state.recommended)) || [];
  const recommendedUnits = useSelector(state => recommendedItems
    .map(item => mdbSelectors.getDenormContentUnit(state.mdb, item.uid))
    .filter(item => !!item)) || [];

  // useEffect(() => {
  //   if (recommendedUnits.length === 0){
  //     if (displayHandler)
  //       displayHandler(false);
  //   }
  // }, [displayHandler, recommendedUnits.length]);

  if (wipErr) {
    return wipErr;
  }

  console.log('recommendedUnits:', recommendedUnits);

  if (recommendedUnits.length === 0){
    return null;
  }

  return <DisplayRecommended unit={unit} t={t} recommendedUnits={recommendedUnits} />
}

Recommended.propTypes = {
  unit: shapes.EventItem.isRequired,
  t: PropTypes.func.isRequired,
  // displayHandler: PropTypes.func
}

const areEqual = (prevProps, nextProps) => prevProps.unit.id === nextProps.unit.id;

export default React.memo(withNamespaces()(Recommended), areEqual);