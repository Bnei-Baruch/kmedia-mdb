import React from 'react';
import { Container, Table, Divider } from 'semantic-ui-react';
import { wrapper } from '../../../lib/redux';
import {
  DEFAULT_CONTENT_LANGUAGE,
  PAGE_NS_BLOG,
  LANG_HEBREW,
  LANG_UKRAINIAN,
  LANG_RUSSIAN,
  LANG_SPANISH,
  LANG_ENGLISH
} from '../../../src/helpers/consts';
import { fetchSQData } from '../../../lib/redux/slices/mdbSlice';
import { filtersTransformer } from '../../../lib/filters';
import { filterSlice } from '../../../lib/redux/slices/filterSlice/filterSlice';
import { selectors as settings } from '../../../lib/redux/slices/settingsSlice';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PublicationsLayout from '../Layout';
import ResultsPageHeader from '../../../src/components/Pagination/ResultsPageHeader';
import Pagination from '../../../src/components/Pagination/Pagination';
import BlogFeed from '../../../src/components/Sections/Publications/BlogFeed';
import Api from '../../../src/helpers/Api';
import Filters from '../../../src/components/Sections/Publications/Filters';
import SectionFiltersWithMobile from '../../../src/components/shared/SectionFiltersWithMobile';

const extraFetchParams          = (langs) => {
  const blog = langs.map(language => {
    switch (language) {
      case LANG_HEBREW:
        return 'laitman-co-il';
      case LANG_UKRAINIAN:
      case LANG_RUSSIAN:
        return 'laitman-ru';
      case LANG_SPANISH:
        return 'laitman-es';
      case LANG_ENGLISH:
        return 'laitman-com';

      default:
        return null;
    }
  }).filter(blog => !!blog);
  if (!blog.length) {
    blog.push('laitman-com');
  }
  return { blog };
};
export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  const lang      = context.locale ?? DEFAULT_CONTENT_LANGUAGE;
  const namespace = PAGE_NS_BLOG;

  const filters = filtersTransformer.fromQueryParams(context.query);
  store.dispatch(filterSlice.actions.hydrateNamespace({ namespace, filters }));
  const filterParams = filtersTransformer.toApiParams(filters);

  const state    = store.getState();
  const pageNo   = context.query.page_no || 1;
  const pageSize = settings.getPageSize(state.settings);

  const _params = {
    namespace,
    pageNo,
    pageSize,
    withViews: true,
    ...filterParams,
    ...extraFetchParams([lang])
  };

  const { data: { posts: items, total } } = await Api.posts(_params);

  const _i18n = await serverSideTranslations(lang);
  return { props: { ..._i18n, pageSize, total, items } };
});
const BlogsPage                   = ({ pageSize, total, items }) => {
  const filterComponent = <Filters namespace={PAGE_NS_BLOG} />;
  return (
    <PublicationsLayout namespace={PAGE_NS_BLOG}>
      <SectionFiltersWithMobile filters={filterComponent} namespace={PAGE_NS_BLOG}>
        <div>
          <Container className="padded">
            {/*<Helmets.NoIndex />*/}
            <ResultsPageHeader total={total} pageSize={pageSize} />
            <Table unstackable basic="very" className="index" sortable>
              <Table.Body>
                {
                  items.map(x => (
                    <Table.Row key={x.id}>
                      <Table.Cell>
                        <BlogFeed item={x} />
                      </Table.Cell>
                    </Table.Row>
                  ))
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

export default BlogsPage;
