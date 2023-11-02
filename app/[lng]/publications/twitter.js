import React from 'react';
import { Container, Divider, Feed } from 'semantic-ui-react';
import { wrapper } from '../../../lib/redux';
import {
  DEFAULT_CONTENT_LANGUAGE,
  LANG_HEBREW,
  LANG_UKRAINIAN,
  LANG_RUSSIAN,
  LANG_SPANISH,
  LANG_ENGLISH,
  PAGE_NS_TWITTER
} from '../../../src/helpers/consts';
import { filtersTransformer } from '../../../lib/filters';
import { filterSlice } from '../../../lib/redux/slices/filterSlice/filterSlice';
import { selectors as settings } from '../../../lib/redux/slices/settingsSlice';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ResultsPageHeader from '../../../src/components/Pagination/ResultsPageHeader';
import Pagination from '../../../src/components/Pagination/Pagination';
import Api from '../../../src/helpers/Api';
import Filters from '../../../src/components/Sections/Publications/Filters';
import SectionFiltersWithMobile from '../../../src/components/shared/SectionFiltersWithMobile';
import PublicationsLayout from './Layout';
import TwitterFeed from '../../../src/components/Sections/Publications/TwitterFeed';

const extraFetchParams          = (langs) => {
  const usernames = langs.map(language => {
    switch (language) {
      case LANG_HEBREW:
        return 'laitman_co_il';
      case LANG_UKRAINIAN:
      case LANG_RUSSIAN:
        return 'Michael_Laitman';
      case LANG_SPANISH:
        return 'laitman_es';
      case LANG_ENGLISH:
        return 'laitman';

      default:
        return null;
    }
  }).filter(username => !!username);
  if (!usernames.length) {
    usernames.push('laitman');
  }
  return { username: usernames };
};
export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  const lang      = context.locale ?? DEFAULT_CONTENT_LANGUAGE;
  const namespace = PAGE_NS_TWITTER;

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
    ...filterParams,
    ...extraFetchParams([lang])
  };

  const { data: { tweets: items, total } } = await Api.tweets(_params);

  const _i18n = await serverSideTranslations(lang);
  return { props: { ..._i18n, pageSize, total, items } };
});
const TwitterPage               = ({ pageSize, total, items }) => {
  const filterComponent = <Filters namespace={PAGE_NS_TWITTER} />;
  return (
    <PublicationsLayout namespace={PAGE_NS_TWITTER}>
      <SectionFiltersWithMobile filters={filterComponent} namespace={PAGE_NS_TWITTER}>
        <div>
          <Container className="padded">
            {/*<Helmets.NoIndex />*/}
            <ResultsPageHeader total={total} pageSize={pageSize} />

            <Feed className="publications-twitter">
              {
                items.map(x => (<TwitterFeed twitter={x} key={x.twitter_id} />
                ))
              }
            </Feed>
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

export default TwitterPage;
