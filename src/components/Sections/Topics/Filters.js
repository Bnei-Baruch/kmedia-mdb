import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../../redux/modules/filtersAside';
import FiltersHydrator from '../../Filters/FiltersHydrator';
import { FN_CONTENT_TYPE, FN_LANGUAGES, FN_SOURCES_MULTI } from '../../../helpers/consts';
import TagSourceFilter from '../../FiltersAside/TopicsFilter/TagSourceFilter';
import ContentType from '../../FiltersAside/ContentTypeFilter/ContentType';
import Language from '../../FiltersAside/LanguageFilter/Language';
import { selectors as filters } from '../../../redux/modules/filters';
import FilterLabels from '../../FiltersAside/FilterLabels';

const Filters = ({ namespace, baseParams }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  const isReady      = useSelector(state => selectors.isReady(state.filtersAside, namespace));
  const { wip, err } = useSelector(state => selectors.getWipErr(state.filtersAside, namespace));
  const filterNames  = [FN_SOURCES_MULTI, FN_CONTENT_TYPE, FN_LANGUAGES];
  const selected     = useSelector(state => filterNames.map(fn => filters.getFilterByName(state.filters, namespace, fn)?.values || [])).flat();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isReady && !wip && !err) {
      dispatch(actions.fetchStats(namespace, baseParams, true));
    }
  }, [dispatch, isReady]);

  useEffect(() => {
    if (isHydrated && isReady && !wip && !err) {
      dispatch(actions.fetchStats(namespace, baseParams, false));
    }
  }, [dispatch, isHydrated, isReady, selected?.length]);

  const handleOnHydrated = () => setIsHydrated(true);

  /* const wipErr = WipErr({ wip, err, t });
   if (wipErr) {
     return wipErr;
   }*/

  return (
    <>
      <FiltersHydrator namespace={namespace} onHydrated={handleOnHydrated} />
      <FilterLabels namespace={namespace} />
      <TagSourceFilter
        namespace={namespace}
        filterName={FN_SOURCES_MULTI}
      />
      <ContentType
        namespace={namespace}
      />
      <Language
        namespace={namespace}
      />
    </>
  );
};

export default Filters;
