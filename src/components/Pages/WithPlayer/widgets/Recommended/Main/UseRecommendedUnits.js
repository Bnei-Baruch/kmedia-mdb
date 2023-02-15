import { useSelector } from 'react-redux';
import { selectors } from '../../../../../../redux/modules/recommended';
import { selectors as mdbSelectors } from '../../../../../../redux/modules/mdb';
import { selectors as sourcesSelectors } from '../../../../../../redux/modules/sources';
import { selectors as tagsSelectors } from '../../../../../../redux/modules/tags';

// A custom hook to get loaded recommended
const useRecommendedUnits = feedNames => {
  const recommendedItems = useSelector(state => selectors.getManyRecommendedItems(feedNames, state.recommended)) || [];

  return useSelector(state => Object.entries(recommendedItems).reduce((acc, [feedName, items]) => {
    acc[feedName] = items.map(item =>
      mdbSelectors.getDenormContentUnit(state.mdb, item.uid) ||
      mdbSelectors.getDenormCollection(state.mdb, item.uid) ||
      sourcesSelectors.getSourceById(state.sources)(item.uid) ||
      tagsSelectors.getTagById(state.tags)(item.uid)).filter(item => !!item) || [];
    return acc;
  }, {}));
};

export default useRecommendedUnits;
