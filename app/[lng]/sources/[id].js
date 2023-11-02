import React from 'react';

import { isEmpty } from '../../../src/helpers/utils';
import { wrapper } from '../../../lib/redux';
import { DEFAULT_CONTENT_LANGUAGE, CT_SOURCE } from '../../../src/helpers/consts';
import { selectors as assets } from '../../../lib/redux/slices/assetSlice/assetSlice';
import { selectors as sources } from '../../../lib/redux/slices/sourcesSlice/sourcesSlice';
import { fetchSQData, fetchLabels } from '../../../lib/redux/slices/mdbSlice';
import { fetchSource, doc2Html } from '../../../lib/redux/slices/assetSlice';
import { isTaas } from '../../../src/components/shared/PDF/PDF';
import { getLibraryContentFile } from '../../../src/components/Sections/Library/helper';
import Library from '../../../src/components/Sections/Library/Library';
import LibraryLayout from '../../../src/components/Sections/Library/LibraryLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import HeaderSource from '../../../src/components/Sections/Library/HeaderSource';
import { textFileSlice } from '../../../lib/redux/slices/textFileSlice/textFileSlice';

const firstLeafId = (id, getSourceById) => {
  const { children = [] } = getSourceById(id) || false;
  if (isEmpty(children)) {
    return id;
  }

  return firstLeafId(children[0], getSourceById);
};

export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  const lang = context.locale ?? DEFAULT_CONTENT_LANGUAGE;

  await store.dispatch(fetchSQData());

  const getSourceById = sources.getSourceById(store.getState().sources);
  const id            = firstLeafId(context.params.id, getSourceById);
  await store.dispatch(fetchSource(id));
  const _fileLang = context.query.source_language || context.query.language || lang;

  const { data }       = assets.getSourceIndexById(store.getState().assets)[id];
  const language       = Object.keys(data).find(x => x === _fileLang) || Object.keys(data)[0];
  const { id: fileId } = getLibraryContentFile(data[language], id);
  store.dispatch(textFileSlice.actions.setSubjectInfo({ id, language, type: CT_SOURCE, fileId }));

  // no need to fetch pdf. we don't do that on SSR
  if (!(data[language].pdf && isTaas(id))) {
    const _doc2Html    = store.dispatch(doc2Html(fileId));
    const _fetchLabels = store.dispatch(fetchLabels({ content_unit: id, language: language }));
    await Promise.all([_doc2Html, _fetchLabels]);
  }

  const _i18n = await serverSideTranslations(lang);
  return { props: { ..._i18n } };
});

export default function LibraryPage() {
  return (
    <LibraryLayout
      header={<HeaderSource />}
      content={<Library />}
    />
  );
};
