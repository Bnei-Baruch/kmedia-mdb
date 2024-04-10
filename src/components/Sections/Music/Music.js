import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Container, Divider } from 'semantic-ui-react';

import ResultsPageHeader from '../../Pagination/ResultsPageHeader';
import SectionHeader from '../../shared/SectionHeader';
import WipErr from '../../shared/WipErr/WipErr';
import List from './List';
import { useMusicQuery } from '../../../redux/api/music';
import { settingsGetUILangSelector, settingsGetContentLanguagesSelector } from '../../../redux/selectors';
import NotFound from '../../shared/NotFound';

const Music = () => {
  const { t } = useTranslation();

  const uiLanguage                                     = useSelector(settingsGetUILangSelector);
  const contentLanguages                               = useSelector(settingsGetContentLanguagesSelector);
  const { isError, isLoading, isSuccess, error, data } = useMusicQuery({
    uiLanguage,
    contentLanguages
  });

  let wipErr = WipErr({ isLoading, isError, t });
  if (wipErr) {
    if (error) {
      console.error('========> Music error', error);
    }
  }

  const music = data?.collections;
  if (!isSuccess || !music) {
    wipErr = <NotFound/>;
  }

  const content = wipErr || (
    <Container className="padded">
      <ResultsPageHeader pageNo={1} pageSize={1000} total={music.length || 0}/>
      <Divider fitted/>
      <List items={music}/>
    </Container>
  );

  return (
    <>
      <SectionHeader section="music"/>
      <Divider fitted/>
      {content}
    </>
  );
};

export default Music;
