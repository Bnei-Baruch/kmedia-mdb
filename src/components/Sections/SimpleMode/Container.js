import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { getQuery, updateQuery } from '../../../helpers/url';
import { isEmpty, noop } from '../../../helpers/utils';
import Page from './Page';
import { groupOtherMediaByType, renderCollection } from './RenderListHelpers';
import { ClientChroniclesContext, DeviceInfoContext } from '../../../helpers/app-contexts';
import { settingsGetContentLanguagesSelector } from '../../../redux/selectors';

const SimpleModeContainer = () => {
  const contentLanguages = useSelector(settingsGetContentLanguagesSelector);

  const { deviceInfo: { browser: { name: browserName } } } = useContext(DeviceInfoContext);
  const chronicles                                         = useContext(ClientChroniclesContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [filesLanguages, setFilesLanguages] = useState(contentLanguages);

  const [selectedDate, setSelectedDate] = useState(() => {
    const query = getQuery(location);
    const qdate = query?.date;
    return (qdate && moment(qdate).isValid())
      ? moment(qdate, 'YYYY-MM-DD').toDate()
      : new Date();
  });

  useEffect(() => {
    setFilesLanguages(contentLanguages);
  }, [contentLanguages]);

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
    renderUnit      : renderUnitOrCollection,
    onDayClick      : handleDayClick,
    onLanguageChange: selected => setFilesLanguages(selected),
  };

  return <Page {...pageProps} />;
};

export default SimpleModeContainer;
