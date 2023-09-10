import React from 'react';
import { withTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';

import { FN_PERSON } from '../../../helpers/consts';
import { selectors } from '../../../redux/modules/filtersAside';
import FilterHeader from '../FilterHeader';
import PersonItem from './PersonItem';

const Person = ({ namespace, t }) => {
  const items = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_PERSON));

  return (
    <FilterHeader
      filterName={FN_PERSON}
      children={
        <>
          {items.map(id => <PersonItem namespace={namespace} id={id} key={id} />)}
        </>
      }
    />
  );
};

export default withTranslation()(Person);
