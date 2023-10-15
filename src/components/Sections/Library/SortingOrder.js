import { Button } from 'semantic-ui-react';
import { sourcesSlice, NotToSort, selectors } from '../../../../lib/redux/slices/sourcesSlice';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

const SortingOrder = ({ parentId }) => {

  const sortBy   = useSelector(state => selectors.sortBy(state.sources));
  const dispatch = useDispatch();
  if (NotToSort.findIndex(a => a === parentId) !== -1) {
    return null;
  }

  const sortButton = () => {
    const sortOrder = sortBy === 'AZ' ? 'Book' : 'AZ';
    dispatch(sourcesSlice.actions.sourcesSortBy(sortOrder));
  };

  const sortByAZ = sortBy === 'AZ';
  return (
    <Button
      compact
      size="small"
      icon="sort alphabet ascending"
      color={sortByAZ ? 'blue' : 'grey'}
      active={sortByAZ}
      basic={!sortByAZ}
      onClick={sortButton}
    />
  );

};
export default SortingOrder;
