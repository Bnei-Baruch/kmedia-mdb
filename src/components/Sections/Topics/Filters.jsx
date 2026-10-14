import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../../../redux/modules/filtersAside';
import FiltersHydrator from '../../FiltersAside/FiltersHydrator';
import FiltersAsideTitle from '../../FiltersAside/FiltersAsideTitle';
import { FN_SOURCES_MULTI } from '../../../helpers/consts';
import logger from '../../../logger/logger.js';
import DateFilter from '../../FiltersAside/DateFilter';
import Language from '../../FiltersAside/LanguageFilter/Language';
import ContentType from '../../FiltersAside/ContentTypeFilter/ContentType';
import TagSourceFilter from '../../FiltersAside/TopicsFilter/TagSourceFilter';
import SubTopics from './SubTopics';
import { filtersAsideGetIsReadySelector, filtersGetNotEmptyFiltersSelector } from '../../../redux/selectors';

const NAMESPACE = 'TopicsFilters';

const Filters = ({ namespace, baseParams }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  const isReady    = useSelector(state => filtersAsideGetIsReadySelector(state, namespace));
  const selected   = useSelector(state => filtersGetNotEmptyFiltersSelector(state, namespace));
  const prevSelRef = useRef(-1);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isReady) {
      dispatch(actions.fetchStats(namespace, baseParams, { isPrepare: true, countC: true, countL: true }));
    }
  }, [isReady, baseParams, namespace, dispatch]);

  const needFetch         = isHydrated && isReady;
  const selectedSignature = selected.slice().sort((a, b) => a.name.localeCompare(b.name)).reduce((acc, f) => `${acc}-${f.name}|${f.values.slice().sort().join('_')}`, '');
  useEffect(() => {
    logger.log(NAMESPACE, 'fetchStats needFetch', needFetch, selected, baseParams, namespace, isHydrated, isReady);
    if (needFetch && prevSelRef.current !== selectedSignature) {
      dispatch(actions.fetchStats(namespace, baseParams, { isPrepare: false, countC: true, countL: true }));
      prevSelRef.current = selectedSignature;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needFetch, baseParams, namespace, dispatch, selectedSignature]);

  const handleOnHydrated = () => setIsHydrated(true);

  return (
    <>
      <FiltersHydrator namespace={namespace} onHydrated={handleOnHydrated}/>
      <FiltersAsideTitle/>
      <SubTopics namespace={namespace} rootID={baseParams.tag}/>
      <TagSourceFilter namespace={namespace} filterName={FN_SOURCES_MULTI}/>
      <ContentType namespace={namespace}/>
      <Language namespace={namespace}/>
      <DateFilter namespace={namespace}/>
    </>
  );
};

export default Filters;
