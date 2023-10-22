import React, { useContext, useState } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { isEmpty, noop } from '../../src/helpers/utils';
import { selectors as settings } from '../../lib/redux/slices/settingsSlice/settingsSlice';
import Page from '../../src/components/Sections/SimpleMode/Page';
import { groupOtherMediaByType, renderCollection } from '../../src/components/Sections/SimpleMode/RenderListHelpers';
import { DeviceInfoContext } from '../../src/helpers/app-contexts';
import { wrapper } from '../../lib/redux';
import { DEFAULT_CONTENT_LANGUAGE, PAGE_NS_SIMPLE_MODE, FN_DATE_FILTER } from '../../src/helpers/consts';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { fetchSimpleMode } from '../../lib/redux/slices/simpleMode/thunks';
import { fetchSQData } from '../../lib/redux/slices/mdbSlice';
import { filtersTransformer } from '../../lib/filters';
import { filterSlice } from '../../lib/redux/slices/filterSlice/filterSlice';
import { definitionsByName } from '../../lib/filters/transformer';

export const getServerSideProps = wrapper.getServerSideProps(store => async (context) => {
  const lang = context.locale ?? DEFAULT_CONTENT_LANGUAGE;

  await store.dispatch(fetchSQData());
  const filters = filtersTransformer.fromQueryParams(context.query);
  if (!filters[FN_DATE_FILTER]) {
    const _filter           = { from: moment(Date.now()).toDate(), to: moment(Date.now()).toDate() };
    filters[FN_DATE_FILTER] = definitionsByName[FN_DATE_FILTER].valueToQuery(_filter);
  }
  store.dispatch(filterSlice.actions.hydrateNamespace({ namespace: PAGE_NS_SIMPLE_MODE, filters }));
  await store.dispatch(fetchSimpleMode());
  const _i18n = await serverSideTranslations(lang);
  return { props: { ..._i18n } };
});

const SimpleModePage = () => {
  const contentLanguages = useSelector(state => settings.getContentLanguages(state.settings));

  const { deviceInfo: { browser: { name: browserName } } } = useContext(DeviceInfoContext);
  //const chronicles                                         = useContext(ClientChroniclesContext);

  const [filesLanguages, setFilesLanguages] = useState(contentLanguages);

  const helpChooseLang = () => {
    (browserName.toLowerCase() === 'chrome' || browserName.toLowerCase() === 'firefox')
      ? window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      : window.scrollTo(0, 0);
  };

  const chroniclesAppend       = noop;// chronicles ? chronicles.append.bind(chronicles) : noop;
  const renderUnitOrCollection = (item, filesLanguages, t) => (
    isEmpty(item.content_units)
      ? groupOtherMediaByType(item, filesLanguages, t, helpChooseLang, chroniclesAppend)
      : renderCollection(item, filesLanguages, t, helpChooseLang, chroniclesAppend)
  );

  const pageProps = {
    filesLanguages,
    renderUnit: renderUnitOrCollection,
    onLanguageChange: selected => setFilesLanguages(selected),
  };

  return <Page {...pageProps} />;
};

export default SimpleModePage;
