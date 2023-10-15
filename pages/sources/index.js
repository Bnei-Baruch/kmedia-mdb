import React from 'react';
import { Container, Divider, Table } from 'semantic-ui-react';
import { selectors as sources } from '../../lib/redux/slices/sourcesSlice/sourcesSlice';
import SectionHeader from '../../src/components/shared/SectionHeader';
import Kabbalist from '../../src/components/Sections/Library/Kabbalist';
import { wrapper } from '../../lib/redux';
import { DEFAULT_CONTENT_LANGUAGE } from '../../src/helpers/consts';
import { fetchSQData } from '../../lib/redux/slices/mdbSlice';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  const lang = context.locale ?? DEFAULT_CONTENT_LANGUAGE;

  await store.dispatch(fetchSQData());
  const roots = sources.getRoots(store.getState().sources);
  const _i18n = await serverSideTranslations(lang);
  return { props: { ..._i18n, roots } };
});

const SourcesPage = ({ roots }) => {

  return (
    <div>
      <SectionHeader section="sources-library" />
      <Divider fitted />
      <Container className="padded">
        <Table basic="very" className="index-list sources__authors">
          <Table.Body>
            {
              roots.map(id => (<Kabbalist key={id} id={id} />))
            }
          </Table.Body>
        </Table>
      </Container>
    </div>
  );
};

export default SourcesPage;
