import React from 'react';
import { useSelector } from 'react-redux';
import { FN_COUNTRIES } from '../../../helpers/consts';
import { isEmpty } from '../../../helpers/utils';
import { selectors } from '../../../redux/modules/filtersAside';
import FilterHeader from '../FilterHeader';
import CountriesItem from './CountriesItem';

const Countries = ({ namespace }) => {
  const items = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_COUNTRIES));

  if (isEmpty(items))
    return null;

  return (
    <FilterHeader
      filterName={FN_COUNTRIES}
      children={
        <>
          {
            items.filter(id => !!id).map(id =>
              <CountriesItem namespace={namespace} id={id} key={id} />
            )
          }
        </>
      }
    />
  );
};

export default Countries;
