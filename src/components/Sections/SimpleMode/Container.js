import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { withTranslation } from 'next-i18next';

import { getQuery, updateQuery } from '../../../helpers/url';
import { isEmpty, noop } from '../../../helpers/utils';
import { selectors as settings } from '../../../../lib/redux/slices/settingsSlice/settingsSlice';
import { actions } from '../../../redux/modules/simpleMode';
import Page from './Page';
import { groupOtherMediaByType, renderCollection } from './RenderListHelpers';
import { ClientChroniclesContext, DeviceInfoContext } from '../../../helpers/app-contexts';

const SimpleModeContainer = () => {
  console.log('SimpleModeContainer');
  const uiLang           = useSelector(state => settings.getUILang(state.settings));
  const contentLanguages = useSelector(state => settings.getContentLanguages(state.settings));

  const { deviceInfo: { browser: { name: browserName } } } = useContext(DeviceInfoContext);
  const chronicles                                         = useContext(ClientChroniclesContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [filesLanguages, setFilesLanguages]   = useState(contentLanguages);
  const [blinkLangSelect, setBlinkLangSelect] = useState(false);

  const [selectedDate, setSelectedDate] = useState(() => {
    const query   = getQuery(location);
    const newDate = (query.date && moment(query.date).isValid())
      ? moment(query.date, 'YYYY-MM-DD').toDate()
      : new Date();

    return newDate;
  });

  const dispatch = useDispatch();

  useEffect(() => {
    setFilesLanguages(contentLanguages);
  }, [contentLanguages]);

  useEffect(() => {
    console.log('fetchForDate...', uiLang);
    // We want to fetch again when uiLang or the date changed.
    dispatch(actions.fetchForDate({ date: selectedDate }));
  }, [dispatch, selectedDate, uiLang]);

  const handleDayClick = (selDate, { disabled } = {}) => {
    if (disabled) {
      return;
    }

    const currentDate = moment(selDate).format('YYYY-MM-DD');

    updateQuery(navigate, location, query => ({
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

  const chroniclesAppend       = chronicles ? chronicles.append.bind(chronicles) : noop;
  const renderUnitOrCollection = (item, filesLanguages, t) => (
    isEmpty(item.content_units)
      ? groupOtherMediaByType(item, filesLanguages, t, helpChooseLang, chroniclesAppend)
      : renderCollection(item, filesLanguages, t, helpChooseLang, chroniclesAppend)
  );

  const pageProps = {
    selectedDate,
    filesLanguages,
    renderUnit: renderUnitOrCollection,
    onDayClick: handleDayClick,
    onLanguageChange: selected => setFilesLanguages(selected),
    blinkLangSelect
  };

  return <Page {...pageProps} />;
};

export default withTranslation()(SimpleModeContainer);
