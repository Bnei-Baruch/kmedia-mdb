import React from 'react';
import { Container, Card, Divider } from 'semantic-ui-react';
import { wrapper } from '../../../../../lib/redux';
import { DEFAULT_CONTENT_LANGUAGE, PAGE_NS_ARTICLES } from '../../../../../src/helpers/consts';
import { selectors as mdb, fetchCollection } from '../../../../../lib/redux/slices/mdbSlice';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ContentItem from '../../../../components/ContentItem/ContentItem';
import Pagination from '../../../../../src/components/Pagination/Pagination';
import { useSelector } from 'react-redux';
import { selectors as settings } from '../../../../../lib/redux/slices/settingsSlice';
import { fetchSectionList } from '../../../../../lib/redux/slices/listSlice/thunks';
import { selectors as lists } from '../../../../../lib/redux/slices/listSlice/listSlice';
import PageHeader from '../../../../../src/components/Sections/Publications/Articles/Header';

export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  const lang      = context.locale ?? DEFAULT_CONTENT_LANGUAGE;
  const { id }    = context.params;
  //const namespace = `${PAGE_NS_ARTICLES}_${id}`;
  const namespace = PAGE_NS_ARTICLES;

  const state    = store.getState();
  const pageNo   = context.query.page_no || 1;
  const pageSize = settings.getPageSize(state.settings);
  await store.dispatch(fetchSectionList({ namespace, pageNo, pageSize, collection: id }));
  await store.dispatch(fetchCollection(id));

  const _data = lists.getNamespaceState(store.getState().lists, namespace);

  const _i18n = await serverSideTranslations(lang);
  return { props: { ..._i18n, pageSize, ..._data, id } };
});

const PublicationCollection = ({ id, pageSize, total, items, namespace }) => {
  const c = useSelector(state => mdb.getCollectionById(state.mdb, id));
  return (

    <div className="collection-page">
      <PageHeader collection={c} namespace={namespace} />
      <Container className="padded">
        <Card.Group doubling itemsPerRow={4} stackable className="cu_items">
          {
            items.map(unit => (<ContentItem id={unit.id} key={unit.id} />))
          }
        </Card.Group>
      </Container>
      <Divider fitted />
      <Container className="padded pagination-wrapper" textAlign="center">
        <Pagination pageSize={pageSize} total={total} />
      </Container>
    </div>
  );
};

export default PublicationCollection;
