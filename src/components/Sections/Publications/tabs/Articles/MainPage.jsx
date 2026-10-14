import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { CT_ARTICLE } from '../../../../../helpers/consts';
import { usePrevious } from '../../../../../helpers/utils';
import { actions } from '../../../../../redux/modules/lists';
import FilterLabels from '../../../../FiltersAside/FilterLabels';
import Pagination from '../../../../Pagination/Pagination';
import ResultsPageHeader from '../../../../Pagination/ResultsPageHeader';
import { getPageFromLocation } from '../../../../Pagination/withPagination';
import SectionFiltersWithMobile from '../../../../shared/SectionFiltersWithMobile';
import { getWipErr } from '../../../../shared/WipErr/WipErr';
import {
  filtersGetNotEmptyFiltersSelector,
  listsGetNamespaceStateSelector,
  settingsGetContentLanguagesSelector,
  settingsGetPageSizeSelector,
} from '../../../../../redux/selectors';
import TextListTemplate from '../../../../shared/ContentItem/TextListTemplate';
import Filters from './Filters';

const NAMESPACE     = 'publications-articles';
const FILTER_PARAMS = { content_type: CT_ARTICLE };

const ArticlesList = () => {
  const { items, total, wip, err } = useSelector(state => listsGetNamespaceStateSelector(state, NAMESPACE)) || {};
  const contentLanguages           = useSelector(settingsGetContentLanguagesSelector);
  const pageSize                   = useSelector(settingsGetPageSizeSelector);
  const selected                   = useSelector(state => filtersGetNotEmptyFiltersSelector(state, NAMESPACE), isEqual);
  const prevSel                    = usePrevious(selected);

  const dispatch = useDispatch();
  const setPage  = useCallback(pageNo => dispatch(actions.setPage(NAMESPACE, pageNo)), [dispatch]);

  const location = useLocation();
  const pageNo   = useMemo(() => getPageFromLocation(location) || 1, [location]);

  useEffect(() => {
    if (pageNo !== 1 && !!prevSel && prevSel !== selected) {
      setPage(1);
    } else {
      dispatch(actions.fetchList(NAMESPACE, pageNo, { pageSize, ...FILTER_PARAMS }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentLanguages, dispatch, pageNo, selected]);

  const wipErr = getWipErr(wip, err);

  return (
    <SectionFiltersWithMobile
      namespace={NAMESPACE}
      filters={<Filters namespace={NAMESPACE} baseParams={FILTER_PARAMS} />}
    >
      <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} />
      <FilterLabels namespace={NAMESPACE} />
      {wipErr || items?.map(id => <TextListTemplate cuID={id} key={id} withCCUInfo={true} />)}
      <hr className="m-0 border-t" />
      {total > 0 && (
        <Pagination
          pageNo={pageNo}
          pageSize={pageSize}
          total={total}
          onChange={setPage}
        />
      )}
    </SectionFiltersWithMobile>
  );
};

export default ArticlesList;
