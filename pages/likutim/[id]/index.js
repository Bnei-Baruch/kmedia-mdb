import React from 'react';
import { selectors as mdb } from '../../../lib/redux/slices/mdbSlice/mdbSlice';
import { selectSuitableLanguage } from '../../../src/helpers/language';
import { LANG_ENGLISH, LANG_HEBREW, MT_TEXT, DEFAULT_CONTENT_LANGUAGE, CT_LIKUTIM } from '../../../src/helpers/consts';
import ScrollToSearch from '../../../src/helpers/scrollToSearch/ScrollToSearch';
import { wrapper } from '../../../lib/redux';
import { fetchSQData, fetchLabels, fetchUnit } from '../../../lib/redux/slices/mdbSlice';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { doc2Html } from '../../../lib/redux/slices/assetSlice';
import { textFileSlice } from '../../../lib/redux/slices/textFileSlice/textFileSlice';
import LikutLayout from './Layout';

const DEFAULT_LANGUAGES     = [LANG_ENGLISH, LANG_HEBREW];
export const selectTextFile = (files, language, idx = 0) => {
  if (!files) return null;

  let file = files.find(x => x.language === language && x.type === MT_TEXT);
  if (file) return file;
  if (idx >= DEFAULT_LANGUAGES.length) {
    file = files.find(x => x.type === MT_TEXT);
    return file;
  }
  return selectTextFile(files, DEFAULT_LANGUAGES[idx], idx++);
};

export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  const lang = context.locale ?? DEFAULT_CONTENT_LANGUAGE;
  const id   = context.params.id;

  const _fetchSQData = store.dispatch(fetchSQData());
  const _fetchUnit   = store.dispatch(fetchUnit(id));
  await Promise.all([_fetchSQData, _fetchUnit]);

  const _langs   = [context.query.source_language, context.query.language, lang];
  const cu       = mdb.getDenormContentUnit(store.getState().mdb, id);
  const language = selectSuitableLanguage(_langs, cu.files.map(f => f.language));

  const { id: fileId } = cu.files.find(f => f.language === language);
  store.dispatch(textFileSlice.actions.setSubjectInfo({ id, language, type: CT_LIKUTIM, fileId }));

  const _doc2Html    = store.dispatch(doc2Html(fileId));
  const _fetchLabels = store.dispatch(fetchLabels({ content_unit: id, language: language }));
  await Promise.all([_doc2Html, _fetchLabels]);

  const _i18n = await serverSideTranslations(lang);
  return { props: { ..._i18n, fileId } };
});

const LikutPage = ({ fileId }) => {
  return (
    <LikutLayout fileId={fileId}>
      <ScrollToSearch />
    </LikutLayout>
  );
};

export default LikutPage;
