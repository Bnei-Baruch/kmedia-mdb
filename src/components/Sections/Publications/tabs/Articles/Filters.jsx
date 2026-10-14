import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FN_TOPICS_MULTI } from '../../../../../helpers/consts';
import { actions } from '../../../../../redux/modules/filtersAside';
import FiltersHydrator from '../../../../FiltersAside/FiltersHydrator';
import FiltersAsideTitle from '../../../../FiltersAside/FiltersAsideTitle';
import DateFilter from '../../../../FiltersAside/DateFilter';
import Language from '../../../../FiltersAside/LanguageFilter/Language';
import TagSourceFilter from '../../../../FiltersAside/TopicsFilter/TagSourceFilter';
import CollectionsFilter from './CollectionsFilter';
import PublishersFilter from './PublishersFilter';


import {
  filtersAsideGetIsReadySelector,
  filtersAsideGetWipErrSelector,
  filtersGetNotEmptyFiltersSelector,
} from '../../../../../redux/selectors';

const Filters = ({ namespace, baseParams }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const isReady      = useSelector(state => filtersAsideGetIsReadySelector(state, namespace));
  const { wip, err } = useSelector(state => filtersAsideGetWipErrSelector(state, namespace));
  const selected     = useSelector(state => filtersGetNotEmptyFiltersSelector(state, namespace));
  const prevSelRef   = useRef(-1);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isReady && !wip && !err) {
      dispatch(actions.fetchStats(namespace, baseParams, { isPrepare: true }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isReady, baseParams]);

  const selLen = selected.reduce((acc, x) => acc + x.values.length, 0);
  useEffect(() => {
    if (isHydrated && isReady && prevSelRef.current !== selLen) {
      dispatch(actions.fetchStats(namespace, baseParams, { isPrepare: false }));
      prevSelRef.current = selLen;
    }
  }, [dispatch, isHydrated, isReady, selLen, baseParams, namespace]);

  const handleOnHydrated = () => setIsHydrated(true);

  return (
    <>
      <FiltersHydrator namespace={namespace} onHydrated={handleOnHydrated} />
      <FiltersAsideTitle/>
      <CollectionsFilter namespace={namespace} />
      <PublishersFilter namespace={namespace} />
      <TagSourceFilter namespace={namespace} filterName={FN_TOPICS_MULTI} />
      <Language namespace={namespace} />
      <DateFilter namespace={namespace} />
    </>
  );
};

export default Filters;
