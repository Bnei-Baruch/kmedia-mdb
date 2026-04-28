import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import { PAGE_NS_LESSONS } from '../../../helpers/consts';
import { usePrevious } from '../../../helpers/utils';
import { actions } from '../../../redux/modules/lists';
import FilterLabels from '../../FiltersAside/FilterLabels';
import PageHeader from '../../Pages/Collection/Header';
import Pagination from '../../Pagination/Pagination';
import ResultsPageHeader from '../../Pagination/ResultsPageHeader';
import { getPageFromLocation } from '../../Pagination/withPagination';
import SectionFiltersWithMobile from '../../shared/SectionFiltersWithMobile';
import WipErr from '../../shared/WipErr/WipErr';
import Filters from './Filters';
import ItemOfList from './ItemOfList';
import {
  settingsGetContentLanguagesSelector,
  mdbGetDenormCollectionSelector,
  listsGetNamespaceStateSelector,
  filtersGetNotEmptyFiltersSelector,
  settingsGetPageSizeSelector
} from '../../../redux/selectors';

const LessonPage = () => {
  const { t } = useTranslation();
  const { id: cid } = useParams();

  const namespace = `${PAGE_NS_LESSONS}_${cid}`;

  const collection = useSelector(state => mdbGetDenormCollectionSelector(state, cid));

  const { items, total, wip, err } = useSelector(state => listsGetNamespaceStateSelector(state, namespace)) || {};
  const contentLanguages = useSelector(settingsGetContentLanguagesSelector);
  const pageSize = useSelector(settingsGetPageSizeSelector);
  const selected = useSelector(state => filtersGetNotEmptyFiltersSelector(state, namespace), isEqual);
  const prevSel = usePrevious(selected);

  const dispatch = useDispatch();
  const setPage = useCallback(pageNo => dispatch(actions.setPage(namespace, pageNo)), [namespace, dispatch]);

  const location = useLocation();
  const pageNo = useMemo(() => getPageFromLocation(location) || 1, [location]);
  const baseParams = useMemo(() => ({ collection: [cid] }), [cid]);

  useEffect(() => {
    if (pageNo !== 1 && !!prevSel && prevSel !== selected) {
      setPage(1);
    } else {
      dispatch(actions.fetchList(namespace, pageNo, { collection: cid, pageSize, withViews: true }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentLanguages, pageNo, selected, cid]);

  const wipErr = WipErr({ wip, err, t });

  return (<>
    <PageHeader collection={collection} namespace={namespace} title="lessons-collection" />

    <SectionFiltersWithMobile
      namespace={namespace}
      filters={
        <Filters
          namespace={namespace}
          baseParams={baseParams}
        />
      }
    >

      <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} />
      <FilterLabels namespace={namespace} />
      {
        wipErr || items?.map((id, i) => <ItemOfList id={id} ccu={collection} key={i} />)
      }
      <hr className="m-0 border-t" />
      {total > 0 && <Pagination
        pageNo={pageNo}
        pageSize={pageSize}
        total={total}
        onChange={setPage}
      />}
    </SectionFiltersWithMobile>
  </>);
};

export default LessonPage;
