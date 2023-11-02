import React from 'react';
import { Container, Divider } from 'semantic-ui-react';

import { DEFAULT_CONTENT_LANGUAGE } from '../../../src/helpers/consts';
import { filterSlice } from '../../../lib/redux/slices/filterSlice/filterSlice';
import { selectors as lists } from '../../../lib/redux/slices/listSlice/listSlice';
import { selectors as settings } from '../../../lib/redux/slices/settingsSlice/settingsSlice';

import Pagination from '../../../src/components/Pagination/Pagination';
import ResultsPageHeader from '../../../src/components/Pagination/ResultsPageHeader';
import SectionFiltersWithMobile from '../../../src/components/shared/SectionFiltersWithMobile';
import SectionHeader from '../../../src/components/shared/SectionHeader';
import { wrapper } from '../../../lib/redux';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { fetchSectionList } from '../../../lib/redux/slices/listSlice/thunks';
import FilterLabels from '../../../lib/filters/components/FilterLabels';
import { filtersTransformer } from '../../../lib/filters';
import FilterByNamespace from './FilterByNamespace';
import { baseParamsByNamespace } from './helper';
import ItemByNamespace from './ItemByNamespace';
import { fetchSQData } from '../../../lib/redux/slices/mdbSlice';

export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  const lang      = context.locale ?? DEFAULT_CONTENT_LANGUAGE;
  const namespace = context.params.selector;

  await store.dispatch(fetchSQData());
  const filters = filtersTransformer.fromQueryParams(context.query);
  store.dispatch(filterSlice.actions.hydrateNamespace({ namespace, filters }));

  const state    = store.getState();
  const pageNo   = context.query.page_no || 1;
  const pageSize = settings.getPageSize(state.settings);

  await store.dispatch(fetchSectionList({
    namespace,
    pageNo,
    pageSize,
    withViews: true,
    ...baseParamsByNamespace(namespace, filters)
  }));
  const _data = lists.getNamespaceState(store.getState().lists, namespace);
  const _i18n = await serverSideTranslations(lang);
  return { props: { ..._i18n, pageSize, namespace, ..._data } };
});
/*

export async function getStaticPaths() {
  const paths = [PAGE_NS_LESSONS, PAGE_NS_PROGRAMS, PAGE_NS_EVENTS].map(selector => ({ params: { selector } }));

  return { paths, fallback: true };
}
*/

const SelectorPage = ({ pageSize, items, total, namespace }) => {
  const filterComponent = <FilterByNamespace namespace={namespace} />;

  return (
    <>
      <SectionHeader section={namespace} />
      <SectionFiltersWithMobile filters={filterComponent} namespace={namespace}>
        <ResultsPageHeader total={total} pageSize={pageSize} />
        <FilterLabels namespace={namespace} />
        {
          items?.map(item => <ItemByNamespace namespace={namespace} item={item} />)
        }
        <Divider fitted />
        <Container className="padded pagination-wrapper" textAlign="center">
          <Pagination pageSize={pageSize} total={total} />
        </Container>
      </SectionFiltersWithMobile>
    </>
  );
};
export default SelectorPage;
