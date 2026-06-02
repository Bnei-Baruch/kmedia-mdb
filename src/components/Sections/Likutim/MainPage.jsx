import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { CT_LIKUTIM, PAGE_NS_LIKUTIM } from '../../../helpers/consts';
import { usePrevious } from '../../../helpers/utils';
import { actions } from '../../../redux/modules/lists';
import FilterLabels from '../../FiltersAside/FilterLabels';
import Pagination from '../../Pagination/Pagination';
import ResultsPageHeader from '../../Pagination/ResultsPageHeader';
import { getPageFromLocation } from '../../Pagination/withPagination';
import SectionFiltersWithMobile from '../../shared/SectionFiltersWithMobile';
import SectionHeader from '../../shared/SectionHeader';
import { getWipErr } from '../../shared/WipErr/WipErr';
import Filters from './Filters';
import TextListTemplate from './TextListTemplate';
import {
  settingsGetContentLanguagesSelector,
  listsGetNamespaceStateSelector,
  filtersGetNotEmptyFiltersSelector,
  settingsGetPageSizeSelector
} from '../../../redux/selectors';

const FILTER_PARAMS = { content_type: [CT_LIKUTIM] };

const MainPage = () => {
  const { items, total, wip, err } = useSelector(state => listsGetNamespaceStateSelector(state, PAGE_NS_LIKUTIM)) || {};
  const contentLanguages = useSelector(settingsGetContentLanguagesSelector);
  const pageSize = useSelector(settingsGetPageSizeSelector);
  const selected = useSelector(state => filtersGetNotEmptyFiltersSelector(state, PAGE_NS_LIKUTIM), isEqual);

  const dispatch = useDispatch();
  const setPage = useCallback(pageNo => dispatch(actions.setPage(PAGE_NS_LIKUTIM, pageNo)), [dispatch]);
  const prevSel = usePrevious(selected);

  const location = useLocation();
  const pageNo = useMemo(() => getPageFromLocation(location) || 1, [location]);

  useEffect(() => {
    if (pageNo !== 1 && !!prevSel && prevSel !== selected) {
      setPage(1);
    } else {
      dispatch(actions.fetchList(PAGE_NS_LIKUTIM, pageNo, { pageSize, ...FILTER_PARAMS }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentLanguages, dispatch, pageNo, selected]);

  const wipErr = getWipErr(wip, err);

  return (<>
    <SectionHeader section="likutim" />
    <SectionFiltersWithMobile
      namespace={PAGE_NS_LIKUTIM}
      filters={
        <Filters
          namespace={PAGE_NS_LIKUTIM}
          baseParams={FILTER_PARAMS}
        />
      }
    >
      <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} />
      <FilterLabels namespace={PAGE_NS_LIKUTIM} />
      {
        wipErr || items?.map(id => <TextListTemplate cuID={id} key={id} />)
      }
      <hr className="m-0" />
      {total > 0 && <Pagination
        pageNo={pageNo}
        pageSize={pageSize}
        total={total}
        onChange={setPage}
      />}
    </SectionFiltersWithMobile>
  </>);
};

export default MainPage;
