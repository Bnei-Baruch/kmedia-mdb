import { isEqual } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { withTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { Container, Divider } from 'semantic-ui-react';

import { PAGE_NS_LESSONS } from '../../../../../src/helpers/consts';
import { usePrevious } from '../../../../../src/helpers/hooks';
import { selectors as filters, filterSlice } from '../../../../../lib/redux/slices/filterSlice/filterSlice';
import { listSlice, selectors as lists } from '../../../../../lib/redux/slices/listSlice/listSlice';
import { selectors as mdb } from '../../../../../lib/redux/slices/mdbSlice/mdbSlice';
import { selectors as settings } from '../../../../../lib/redux/slices/settingsSlice/settingsSlice';
import PageHeader from '../../../../../src/components/Pages/Collection/Header';
import Pagination from '../../../../../src/components/Pagination/Pagination';
import ResultsPageHeader from '../../../../../src/components/Pagination/ResultsPageHeader';
import { getPageFromLocation } from '../../../../../src/components/Pagination/withPagination';
import SectionFiltersWithMobile from '../../../../../src/components/shared/SectionFiltersWithMobile';
import WipErr from '../../../../../src/components/shared/WipErr/WipErr';
import Filters from '../../../../../src/components/Sections/Lesson/Filters';
import ItemOfList from '../../../../../src/components/Sections/Lesson/ItemOfList';
import { wrapper } from '../../../../../lib/redux';
import { fetchSQData } from '../../../../../lib/redux/slices/sourcesSlice';
import { filtersTransformer } from '../../../../../lib/filters';
import { fetchSectionList } from '../../../../../lib/redux/slices/listSlice/thunks';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import FilterLabels from '../../../../../lib/filters/components/FilterLabels';


export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  const lang      = context.locale ?? 'en';
  const namespace = PAGE_NS_LESSONS;
  await store.dispatch(fetchSQData());

  const filters = filtersTransformer.fromQueryParams(context.query);
  store.dispatch(filterSlice.actions.hydrateNamespace({ namespace, filters }));

  const state   = store.getState();
  const pageNo   = context.query.page_no || 1;
  const pageSize = settings.getPageSize(state.settings);

  await store.dispatch(fetchSectionList({ namespace, pageNo, pageSize, withViews: true}));
  const _data = lists.getNamespaceState(store.getState().lists, PAGE_NS_LESSONS);
  const _i18n = await serverSideTranslations(lang);
  return { props: { ..._i18n, pageNo, pageSize, filters, ..._data } };
});

const LessonPage = ({ t }) => {
  const { id: cid } = useParams();

  const namespace = `${PAGE_NS_LESSONS}_${cid}`;

  const collection = useSelector(state => mdb.getDenormCollection(state.mdb, cid));

  const { items, total, wip, err } = useSelector(state => lists.getNamespaceState(state.lists, namespace)) || {};
  const contentLanguages           = useSelector(state => settings.getContentLanguages(state.settings));
  const pageSize                   = useSelector(state => settings.getPageSize(state.settings));
  const selected                   = useSelector(state => filters.getNotEmptyFilters(state.filters, namespace), isEqual);
  const prevSel                    = usePrevious(selected);

  const dispatch = useDispatch();
  const setPage  = useCallback(pageNo => dispatch(listSlice.actions.setPage(namespace, pageNo)), [namespace, dispatch]);

  const location   = useLocation();
  const pageNo     = useMemo(() => getPageFromLocation(location) || 1, [location]);
  const baseParams = useMemo(() => ({ collection: [cid] }), [cid]);

  useEffect(() => {
    if (pageNo !== 1 && !!prevSel && prevSel !== selected) {
      setPage(1);
    } else {
      dispatch(listSlice.actions.fetchList(namespace, pageNo, { collection: cid, pageSize, withViews: true }));
    }
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
      <Divider fitted />
      <Container className="padded pagination-wrapper" textAlign="center">
        {total > 0 && <Pagination
          pageNo={pageNo}
          pageSize={pageSize}
          total={total}
          onChange={setPage}
        />}
      </Container>
    </SectionFiltersWithMobile>
  </>);
};

export default withTranslation()(LessonPage);
