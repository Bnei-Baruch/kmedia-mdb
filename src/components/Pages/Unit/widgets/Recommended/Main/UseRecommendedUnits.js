import { useSelector } from 'react-redux';
import { selectors } from '../../../../../../redux/modules/recommended';
import { selectors as mdbSelectors } from '../../../../../../redux/modules/mdb';

// A custom hook to get loaded recommended
const useRecommendedUnits = feedNames => {
  const recommendedItems = useSelector(state => selectors.getManyRecommendedItems(feedNames, state.recommended)) || [];

  return useSelector(state => Object.entries(recommendedItems).reduce((acc, [feedName, items]) => {
    acc[feedName] = items.map(item =>
      mdbSelectors.getDenormContentUnit(state.mdb, item.uid) ||
      mdbSelectors.getDenormCollection(state.mdb, item.uid)).filter(item => !!item) || [];
    return acc;
  }, {}));
};

export default useRecommendedUnits;
