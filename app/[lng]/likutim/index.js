import React from 'react';
import { Container, Divider } from 'semantic-ui-react';

import { CT_LIKUTIM, PAGE_NS_LIKUTIM, DEFAULT_CONTENT_LANGUAGE, } from '../../../src/helpers/consts';
import { filterSlice } from '../../../lib/redux/slices/filterSlice/filterSlice';
import { selectors as lists } from '../../../lib/redux/slices/listSlice/listSlice';
import { selectors as settings } from '../../../lib/redux/slices/settingsSlice/settingsSlice';
import FilterLabels from '../../../lib/filters/components/FilterLabels';
import Pagination from '../../../src/components/Pagination/Pagination';
import ResultsPageHeader from '../../../src/components/Pagination/ResultsPageHeader';
import SectionFiltersWithMobile from '../../../src/components/shared/SectionFiltersWithMobile';
import SectionHeader from '../../../src/components/shared/SectionHeader';
import Filters from '../../../src/components/Sections/Likutim/Filters';
import TextListTemplate from '../../../src/components/Sections/Likutim/TextListTemplate';
import { wrapper } from '../../../lib/redux';
import { fetchSQData } from '../../../lib/redux/slices/mdbSlice';
import { filtersTransformer } from '../../../lib/filters';
import { fetchList } from '../../../lib/redux/slices/listSlice/thunks';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const FILTER_PARAMS = { content_type: [CT_LIKUTIM] };

export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  const lang      = context.locale ?? DEFAULT_CONTENT_LANGUAGE;
  const namespace = PAGE_NS_LIKUTIM;

  await store.dispatch(fetchSQData());
  const filters = filtersTransformer.fromQueryParams(context.query);
  store.dispatch(filterSlice.actions.hydrateNamespace({ namespace, filters }));

  const state    = store.getState();
  const pageNo   = context.query.page_no || 1;
  const pageSize = settings.getPageSize(state.settings);
  await store.dispatch(fetchList({ namespace, pageNo, pageSize, ...FILTER_PARAMS }));
  const _data = lists.getNamespaceState(store.getState().lists, namespace);

  const _i18n = await serverSideTranslations(lang);
  return { props: { ..._i18n, pageSize, filters, ..._data } };
});

const Index = ({ pageSize, items, total }) => {
  const namespace       = PAGE_NS_LIKUTIM;
  const filterComponent = <Filters namespace={namespace} baseParams={FILTER_PARAMS} />;

  return (
    <>
      <SectionHeader section="likutim" />
      <SectionFiltersWithMobile namespace={namespace} filters={filterComponent}>
        <ResultsPageHeader total={total} pageSize={pageSize} />
        <FilterLabels namespace={namespace} />
        {
          items?.map(id => <TextListTemplate cuID={id} key={id} />)
        }
        <Divider fitted />
        <Container className="padded pagination-wrapper" textAlign="center">
          {total > 0 && <Pagination pageSize={pageSize} total={total} />}
        </Container>
      </SectionFiltersWithMobile>
    </>
  );
};

export default Index;
