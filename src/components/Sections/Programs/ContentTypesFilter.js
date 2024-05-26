import React from 'react';
import { FN_CONTENT_TYPE, UNIT_PROGRAMS_TYPE } from '../../../helpers/consts';
import FilterHeader from '../../FiltersAside/FilterHeader';
import CollectionsByCtBtn from './CollectionsByCtBtn';

const ContentTypesFilter = ({ namespace }) => (
  <FilterHeader
    filterName={FN_CONTENT_TYPE}
    children={UNIT_PROGRAMS_TYPE.map(ct => (
      <CollectionsByCtBtn
        namespace={namespace}
        key={ct}
        ct={ct}
      />
    )
    )}
  />
);

export default ContentTypesFilter;
