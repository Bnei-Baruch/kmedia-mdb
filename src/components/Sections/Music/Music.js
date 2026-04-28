import React from 'react';
import { useSelector } from 'react-redux';

import ResultsPageHeader from '../../Pagination/ResultsPageHeader';
import SectionHeader from '../../shared/SectionHeader';
import { getWipErr } from '../../shared/WipErr/WipErr';
import List from './List';
import { useMusicQuery } from '../../../redux/api/music';
import { settingsGetUILangSelector, settingsGetContentLanguagesSelector } from '../../../redux/selectors';
import NotFound from '../../shared/NotFound';

const Music = () => {
  const uiLanguage = useSelector(settingsGetUILangSelector);
  const contentLanguages = useSelector(settingsGetContentLanguagesSelector);
  const { isError, isLoading, isSuccess, error, data } = useMusicQuery({
    uiLanguage,
    contentLanguages
  });

  let wipErr = getWipErr(isLoading, isError);
  if (wipErr) {
    if (error) {
      console.error('========> Music error', error);
    }
  }

  const music = data?.collections;
  if (!isSuccess || !music) {
    wipErr = <NotFound />;
  }

  const content = wipErr || (
    <div className=" px-4 ">
      <ResultsPageHeader pageNo={1} pageSize={1000} total={music.length || 0} />
      <hr className="m-0" />
      <List items={music} />
    </div>
  );

  return (
    <>
      <SectionHeader section="music" />
      <hr className="m-0" />
      {content}
    </>
  );
};

export default Music;
