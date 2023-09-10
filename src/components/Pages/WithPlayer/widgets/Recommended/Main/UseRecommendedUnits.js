import { useSelector } from 'react-redux';
import { selectors } from '../../../../../../redux/modules/recommended';
import { selectors as mdbSelectors } from '../../../../../../../lib/redux/slices/mdbSlice/mdbSlice';
import { selectors as sourcesSelectors } from '../../../../../../../lib/redux/slices/sourcesSlice/sourcesSlice';
import { selectors as tagsSelectors } from '../../../../../../../lib/redux/slices/tagsSlice/tagsSlice';

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
