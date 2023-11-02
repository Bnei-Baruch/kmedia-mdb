import React, { Fragment } from 'react';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { Container, Header } from 'semantic-ui-react';

import { selectors, selectors as mdb } from '../../../../../lib/redux/slices/mdbSlice/mdbSlice';
import { selectors as settings } from '../../../../../lib/redux/slices/settingsSlice/settingsSlice';
import Helmets from '../../../../../src/components/shared/Helmets';
import TagsByUnit from '../../../../../src/components/shared/TagsByUnit';
import { wrapper } from '../../../../../lib/redux';
import { DEFAULT_CONTENT_LANGUAGE, CT_LIKUTIM } from '../../../../../src/helpers/consts';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { fetchUnit, fetchLabels } from '../../../../../lib/redux/slices/mdbSlice';
import { selectSuitableLanguage } from '../../../../../src/helpers/language';
import { textFileSlice } from '../../../../../lib/redux/slices/textFileSlice/textFileSlice';
import { assetSlice } from '../../../../../lib/redux/slices/assetSlice';
import ArticleLayout from './Layout';
import ScrollToSearch from '../../../../../src/helpers/scrollToSearch/ScrollToSearch';

const renderHeader = (unit, t, uiDir) => {
  const position = uiDir === 'rtl' ? 'right' : 'left';
  const subText2 = t(`publications.header.subtext2`);

  return (
    <div className="section-header">
      <Container className="padded">
        <Header as="h1">
          <Header.Content>
            {unit.name}
            {
              unit.description &&
              <Header.Subheader>{unit.description}</Header.Subheader>
            }
            {
              subText2 &&
              <Header.Subheader className="section-header__subtitle2">
                {subText2}
              </Header.Subheader>
            }
          </Header.Content>
        </Header>
        <Header as="h4" color="grey" className="display-inline">
          {t('values.date', { date: unit.film_date })}
        </Header>
        <TagsByUnit id={unit.id} />
      </Container>
    </div>
  );
};

const renderHelmet = unit => (
  <Fragment>
    <Helmets.NoIndex />
    <Helmets.ArticleUnit unit={unit} />
  </Fragment>
);

export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  const lang   = context.locale ?? DEFAULT_CONTENT_LANGUAGE;
  const { id } = context.params;

  await store.dispatch(fetchUnit(id));

  const _langs   = [context.query.source_language, context.query.language, lang];
  const cu       = mdb.getDenormContentUnit(store.getState().mdb, id);
  const language = selectSuitableLanguage(_langs, cu.files.map(f => f.language));

  const { id: fileId } = cu.files.find(f => f.language === language);
  store.dispatch(textFileSlice.actions.setSubjectInfo({ id, language, type: CT_LIKUTIM, fileId }));

  const _doc2Html    = store.dispatch(doc2Html(fileId));
  const _fetchLabels = store.dispatch(fetchLabels({ content_unit: id, language: language }));
  await Promise.all([_doc2Html, _fetchLabels]);

  const _i18n = await serverSideTranslations(lang);
  return { props: { ..._i18n, id, embed: context.query.embed ?? false } };
});
const ArticlePage               = ({ id, embed }) => {
  const { t } = useTranslation();

  const uiDir = useSelector(state => settings.getUIDir(state.settings));
  const unit  = useSelector(state => selectors.getDenormContentUnit(state.mdb, id));

  //const chronicles = useContext(ClientChroniclesContext);
  //const chroniclesAppend = chronicles ? chronicles.append.bind(chronicles) : () => null;

  return (
    <ArticleLayout>
      <ScrollToSearch />
    </ArticleLayout>
  );
};

export default ArticlePage;
