import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../../redux/modules/recommended';
import { selectors as mdbSelectors } from '../../../../../../redux/modules/mdb';

// A custom hook to get loaded recommended
const useRecommendedUnits = () => {
  const recommendedItems = useSelector(state => selectors.getRecommendedItems(state.recommended)) || [];

  const recommendedUnits = useSelector(state => recommendedItems
    .map(item => mdbSelectors.getDenormContentUnit(state.mdb, item.uid) || mdbSelectors.getDenormCollection(state.mdb, item.uid))
    .filter(item => !!item)) || [];

  return recommendedUnits;
};


export default useRecommendedUnits;
