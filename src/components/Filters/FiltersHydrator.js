import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { selectors, actions } from '../../redux/modules/filters';

const FiltersHydrator = ({ namespace, onHydrated }) => {

  const isHydrated = useSelector(state => selectors.getIsHydrated(state.filters, namespace));
  const hydrated   = useRef(false);

  const dispatch = useDispatch();
  useEffect(() => {
    if (isHydrated) {
      dispatch(actions.filtersHydrated(namespace));

      if (onHydrated) {
        onHydrated(namespace);
      }
    } else if (!hydrated.current) {
      dispatch(actions.hydrateFilters(namespace));
      hydrated.current = true;
    }
  }, [dispatch, hydrated.current, isHydrated, namespace, onHydrated]);

  return null;
};

FiltersHydrator.propTypes = {
  namespace: PropTypes.string.isRequired,
  onHydrated: PropTypes.func,
};

export default FiltersHydrator;
