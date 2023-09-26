import React from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'next-i18next';

import { FN_LOCATIONS } from '../../../../src/helpers/consts';
import { isEmpty } from '../../../../src/helpers/utils';
import { selectors } from '../../../redux/slices/filterSlice/filterStatsSlice';
import FilterHeader from '../FilterHeader';
import CountryItem from './CountryItem';
import { getTitle } from './helper';

const Locations = ({ namespace, t }) => {
  const items = useSelector(state => selectors.getTree(state.filterStats, namespace, FN_LOCATIONS));

  if (isEmpty(items))
    return null;

  const locs = items
    .filter(id => !!id)
    .map(id => {
      const desc = getTitle(id, t);
      return { id, desc }
    });

  return (
    <FilterHeader
      filterName={FN_LOCATIONS}
      children={
        <>
          {
            locs
              .sort((t1, t2) => t1.desc < t2.desc ? -1 : 1)
              .map(loc => <CountryItem namespace={namespace} loc={loc} key={loc.id} />)
          }
        </>
      }
    />
  );
};

export default withTranslation()(Locations);
