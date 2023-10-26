import React from 'react';
import { Container, Table, Divider } from 'semantic-ui-react';
import { wrapper } from '../../../lib/redux';
import { DEFAULT_CONTENT_LANGUAGE, PAGE_NS_ARTICLES } from '../../../src/helpers/consts';
import { filtersTransformer } from '../../../lib/filters';
import { filterSlice } from '../../../lib/redux/slices/filterSlice/filterSlice';
import { selectors as settings } from '../../../lib/redux/slices/settingsSlice';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ResultsPageHeader from '../../../src/components/Pagination/ResultsPageHeader';
import Pagination from '../../../src/components/Pagination/Pagination';
import Filters from '../../../src/components/Sections/Publications/Articles/Filters';
import SectionFiltersWithMobile from '../../../src/components/shared/SectionFiltersWithMobile';
import ArticleFeed from '../../../src/components/Sections/Publications/Articles/ArticleFeed';
import { fetchSectionList } from '../../../lib/redux/slices/listSlice/thunks';
import { baseParamsByNamespace } from '../../[selector]/helper';
import { selectors as lists } from '../../../lib/redux/slices/listSlice/listSlice';
import PublicationsLayout from '../Layout';

export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  const lang      = context.locale ?? DEFAULT_CONTENT_LANGUAGE;
  const namespace = PAGE_NS_ARTICLES;

  const filters = filtersTransformer.fromQueryParams(context.query);
  store.dispatch(filterSlice.actions.hydrateNamespace({ namespace, filters }));

  const state    = store.getState();
  const pageNo   = context.query.page_no || 1;
  const pageSize = settings.getPageSize(state.settings);

  await store.dispatch(fetchSectionList({
    namespace,
    pageNo,
    pageSize,
    ...baseParamsByNamespace(namespace, filters)
  }));
  const _data = lists.getNamespaceState(store.getState().lists, namespace);

  const _i18n = await serverSideTranslations(lang);
  return { props: { ..._i18n, pageSize, ..._data } };
});
const ArticlesPage              = ({ pageSize, total, items }) => {

  const filterComponent = <Filters namespace={PAGE_NS_ARTICLES} />;
  return (
    <PublicationsLayout namespace={PAGE_NS_ARTICLES}>
      <SectionFiltersWithMobile filters={filterComponent} namespace={PAGE_NS_ARTICLES}>
        <div>
          <Container className="padded">
            {/*<Helmets.NoIndex />*/}
            <ResultsPageHeader total={total} pageSize={pageSize} />
            <Table unstackable basic="very" className="index" sortable>
              <Table.Body>
                {
                  items.map(x => (<ArticleFeed id={x.id} />))
                }
              </Table.Body>
            </Table>
          </Container>
          <Divider fitted />
          <Container className="padded pagination-wrapper" textAlign="center">
            <Pagination pageSize={pageSize} total={total} />
          </Container>
        </div>
      </SectionFiltersWithMobile>
    </PublicationsLayout>
  );
};

export default ArticlesPage;
