import React from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { FN_LOCATIONS } from '../../../helpers/consts';
import { isEmpty } from '../../../helpers/utils';
import FilterHeader from '../FilterHeader';
import CountryItem from './CountryItem';
import { getTitle } from './helper';
import { filtersAsideGetTreeSelector } from '../../../redux/selectors';

const Locations = ({ namespace, t }) => {
  const items = useSelector(state => filtersAsideGetTreeSelector(state, namespace, FN_LOCATIONS));

  if (isEmpty(items))
    return null;

  const locs = items
    .filter(id => !!id)
    .map(id => {
      const desc = getTitle(id, t);
      return { id, desc };
    });

  return (
    <FilterHeader
      filterName={FN_LOCATIONS}
      children={
        <>
          {
            locs
              .sort((t1, t2) => t1.desc < t2.desc ? -1 : 1)
              .map(loc => <CountryItem namespace={namespace} loc={loc} key={loc.id}/>)
          }
        </>
      }
    />
  );
};

export default withTranslation()(Locations);
