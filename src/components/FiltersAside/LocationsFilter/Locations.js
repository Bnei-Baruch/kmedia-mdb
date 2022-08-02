import React from 'react';
import { useSelector } from 'react-redux';
import { FN_LOCATIONS } from '../../../helpers/consts';
import { isEmpty } from '../../../helpers/utils';
import { selectors } from '../../../redux/modules/filtersAside';
import FilterHeader from '../FilterHeader';
import CountriesItem from './CountryItem';

const Locations = ({ namespace }) => {
  const items = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_LOCATIONS));

  if (isEmpty(items))
    return null;

  return (
    <FilterHeader
      filterName={FN_LOCATIONS}
      children={
        <>
          {
            items
              .filter(id => !!id)
              .sort()
              .map(id => <CountriesItem namespace={namespace} id={id} key={id} />)
          }
        </>
      }
    />
  );
};

export default Locations;
