import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

import { getQuery, updateQuery } from '../../../helpers/url';
import { isEmpty } from '../../../helpers/utils';
import { selectors as settings } from '../../../redux/modules/settings';
import { actions } from '../../../redux/modules/simpleMode';
import Page from './Page';
import { groupOtherMediaByType, renderCollection } from './RenderListHelpers';
import { ClientChroniclesContext, DeviceInfoContext } from '../../../helpers/app-contexts';

const SimpleModeContainer = () => {
  const uiLanguage = useSelector(state => settings.getLanguage(state.settings));
  const contentLanguage = useSelector(state => settings.getContentLanguage(state.settings));

  const { deviceInfo: { browser: { name: browserName } } } = useContext(DeviceInfoContext);
  const chronicles = useContext(ClientChroniclesContext);

  const history = useHistory();
  const location = useLocation();

  const [filesLanguage, setFilesLanguage] = useState(contentLanguage);
  const [blinkLangSelect, setBlinkLangSelect] = useState(false);

  const [selectedDate, setSelectedDate] = useState(() => {
    const query = getQuery(location);
    const newDate  = (query.date && moment(query.date).isValid())
      ? moment(query.date, 'YYYY-MM-DD').toDate()
      : new Date();

    return newDate;
  });

  const dispatch = useDispatch();

  useEffect(() => {
    setFilesLanguage(contentLanguage);
  }, [contentLanguage]);

  useEffect(() => {
    dispatch(actions.fetchForDate({ date: selectedDate, language: uiLanguage }))
  }, [dispatch, selectedDate, uiLanguage]);

  const handleLanguageChanged = (e, filesLang) => {
    const language = filesLang || e.currentTarget.value;
    setFilesLanguage(language);
    setBlinkLangSelect(false);
  };

  const handleDayClick = (selDate, { disabled } = {}) => {
    if (disabled) {
      return;
    }

    const currentDate = moment(selDate).format('YYYY-MM-DD');

    updateQuery(history, query => ({
      ...query,
      date: currentDate
    }));

    setSelectedDate(selDate);
  };

  const helpChooseLang = () => {
    setBlinkLangSelect(true);
    setTimeout(() => setBlinkLangSelect(false), 7500);
    scrollToTop();
  };

  const scrollToTop = () => {
    (browserName.toLowerCase() === 'chrome' || browserName.toLowerCase() === 'firefox')
      ? window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      : window.scrollTo(0, 0);
  };

  const renderUnitOrCollection = (item, language, t) => (
    isEmpty(item.content_units)
      ? groupOtherMediaByType(item, language, t, helpChooseLang, chronicles)
      : renderCollection(item, language, t, helpChooseLang, chronicles)
  );


  const pageProps = {
    selectedDate,
    filesLanguage,
    renderUnit: renderUnitOrCollection,
    onDayClick: handleDayClick,
    onLanguageChange: handleLanguageChanged,
    blinkLangSelect
  };

  return <Page {...pageProps} />;
}

export default withNamespaces()(SimpleModeContainer);
