import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Divider } from 'semantic-ui-react';

import ResultsPageHeader from '../../src/components/Pagination/ResultsPageHeader';
import SectionHeader from '../../src/components/shared/SectionHeader';
import { selectors } from '../../lib/redux/slices/musicSlice/musicSlice';
import MusicList from '../../src/components/Sections/Music/List';
import { wrapper } from '../../lib/redux';
import { DEFAULT_CONTENT_LANGUAGE } from '../../src/helpers/consts';
import { fetchSQData } from '../../lib/redux/slices/mdbSlice';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { fetchMusic } from '../../lib/redux/slices/musicSlice/thunks';

export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  const lang = context.locale ?? DEFAULT_CONTENT_LANGUAGE;

  const _fetchSQData = store.dispatch(fetchSQData());
  const _fetchMusic  = store.dispatch(fetchMusic());
  await Promise.all([_fetchSQData, _fetchMusic]);

  const _i18n = await serverSideTranslations(lang);
  return { props: { ..._i18n } };
});

const MusicPage = () => {
  const total = useSelector(state => selectors.getMusicData(state.music).length);

  return (
    <>
      <SectionHeader section="music" />
      <Divider fitted />
      <Container className="padded">
        <ResultsPageHeader pageNo={1} pageSize={1000} total={total} />
        <Divider fitted />
        <MusicList />
      </Container>
    </>
  );
};

export default MusicPage;
