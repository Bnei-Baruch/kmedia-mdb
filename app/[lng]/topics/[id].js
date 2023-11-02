import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Container, Divider } from 'semantic-ui-react';

import { selectors, fetchTags } from '../../../lib/redux/slices/tagsSlice';
import { selectors as settings } from '../../../lib/redux/slices/settingsSlice/settingsSlice';
import Pagination from '../../../src/components/Pagination/Pagination';
import { filterSlice } from '../../../lib/redux/slices/filterSlice/filterSlice';
import { DeviceInfoContext } from '../../../src/helpers/app-contexts';
import RenderPage from '../../../src/components/Sections/Topics/RenderPage';
import RenderPageMobile from '../../../src/components/Sections/Topics/RenderPageMobile';
import { DEFAULT_CONTENT_LANGUAGE } from '../../../src/helpers/consts';
import { wrapper } from '../../../lib/redux';
import { fetchSQData } from '../../../lib/redux/slices/mdbSlice';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { filtersTransformer } from '../../../lib/filters';

export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  const lang      = context.locale ?? DEFAULT_CONTENT_LANGUAGE;
  const id        = context.params.id;
  const page_no   = context.query.page_no || 1;
  const page_size = settings.getPageSize(store.getState().settings);
  const namespace = `topics_${id}`;

  await store.dispatch(fetchSQData());

  const filters = filtersTransformer.fromQueryParams(context.query);
  store.dispatch(filterSlice.actions.hydrateNamespace({ namespace, filters }));
  await store.dispatch(fetchTags({ tag: id, page_size, page_no, namespace }));

  const _i18n = await serverSideTranslations(lang);
  return { props: { ..._i18n, id } };
});

const TopicPage = ({ id }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const { mediaTotal, textTotal } = useSelector(state => selectors.getItems(state.tags));
  const total                     = Math.max(mediaTotal, textTotal);

  const pageSize = useSelector(state => settings.getPageSize(state.settings));

  return (
    <>
      {isMobileDevice ? <RenderPageMobile id={id} /> : <RenderPage id={id} />}
      <Divider fitted />
      <Container className="padded pagination-wrapper" textAlign="center">
        <Pagination pageSize={pageSize} total={total} />
      </Container>
    </>
  );
};

export default TopicPage;
