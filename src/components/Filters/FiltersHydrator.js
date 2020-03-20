import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { selectors, actions } from '../../redux/modules/filters';

const FiltersHydrator = ({ namespace, onHydrated }) => {
    
  const isHydrated  = useSelector(state => selectors.getIsHydrated(state.filters, namespace));
  const [hydrated, setHydrated] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isHydrated){
      dispatch(actions.filtersHydrated(namespace));

      if (onHydrated) {
        onHydrated(namespace);
      }

    } else if (!hydrated) {
      dispatch(actions.hydrateFilters(namespace));
      setHydrated(true);
    }
  }, [dispatch, hydrated, isHydrated, namespace, onHydrated]);
  
  return <Fragment />;
}

FiltersHydrator.propTypes = {
  namespace: PropTypes.string.isRequired,
  onHydrated: PropTypes.func,
};

export default FiltersHydrator;