import React from 'react';
import { useSelector } from 'react-redux';

import { FN_PERSON } from '../../../helpers/consts';
import FilterHeader from '../FilterHeader';
import PersonItem from './PersonItem';
import { filtersAsideGetTreeSelector } from '../../../redux/selectors';

const Person = ({ namespace }) => {
  const items = useSelector(state => filtersAsideGetTreeSelector(state, namespace, FN_PERSON));

  return (
    <FilterHeader
      filterName={FN_PERSON}
      children={
        <>
          {items.map(id => <PersonItem namespace={namespace} id={id} key={id}/>)}
        </>
      }
    />
  );
};

export default Person;
