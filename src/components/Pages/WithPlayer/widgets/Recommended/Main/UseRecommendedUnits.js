import { useSelector } from 'react-redux';
import {
  mdbGetDenormCollectionSelector,
  mdbGetDenormContentUnitSelector,
  recommendedGetManyItemsSelector,
  sourcesGetSourceByIdSelector,
  tagsGetTagByIdSelector
} from '../../../../../../redux/selectors';

// A custom hook to get loaded recommended
const useRecommendedUnits = feedNames => {
  const recommendedItems = useSelector(state => recommendedGetManyItemsSelector(state, feedNames)) || [];

  return useSelector(state => Object.entries(recommendedItems).reduce((acc, [feedName, items]) => {
    acc[feedName] = items.map(item =>
      mdbGetDenormContentUnitSelector(state, item.uid) ||
      mdbGetDenormCollectionSelector(state, item.uid) ||
      sourcesGetSourceByIdSelector(state)(item.uid) ||
      tagsGetTagByIdSelector(state)(item.uid)).filter(item => !!item) || [];
    return acc;
  }, {}));
};

export default useRecommendedUnits;
