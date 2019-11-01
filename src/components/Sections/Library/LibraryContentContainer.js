import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { isEmpty } from '../../../helpers/utils';
import { selectSuitableLanguage } from '../../../helpers/language';
import { updateQuery } from '../../../helpers/url';
import { actions } from '../../../redux/modules/assets';
import * as shapes from '../../shapes';
import Library, { checkRabashGroupArticles } from './Library';
import PDF from '../../shared/PDF/PDF';

const LibraryContentContainer = (props) => {
  const { index: { data } = { index: { data: null } }, 
    source = null, 
    uiLanguage, 
    contentLanguage, 
    history,
    langSelectorMount = null, 
    downloadAllowed } = props;

  const [language, setLanguage] = useState(null);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    if (data){
      const languages = Object.keys(data);
      setLanguages(languages);
    }
  }, [data]);

  useEffect(() => {
    const newLanguage = selectSuitableLanguage(contentLanguage, uiLanguage, languages);
    if (newLanguage){
      setLanguage(newLanguage);
    }
  }, [contentLanguage, uiLanguage, languages]);

  
  const dispatch = useDispatch();

  useEffect(() => {
    if (data && language && !isEmpty(source)){
      const lData = data[language];

      // In case of TAS we prefer PDF, otherwise HTML
      // pdf.js fetch it on his own (smarter than us), we fetch it for nothing.
      if (lData && (!lData.pdf || !PDF.isTaas(source))) {
        const id = checkRabashGroupArticles(source);
  
        dispatch(actions.fetchAsset(`sources/${id}/${lData.html}`));
      }
    }
  }, [data, language, source, dispatch]);

  // this handler passed to child component to handle language change from there
  const handleLanguageChanged = (e, language) => {
    updateQuery(history, query => ({
      ...query,
      language,
    }));

    setLanguage(language);
  };

  return (
    <Library
      source={source}
      data={data}
      language={language}
      languages={languages}
      handleLanguageChanged={handleLanguageChanged}
      langSelectorMount={langSelectorMount}
      downloadAllowed={downloadAllowed}
    />
  );
}

LibraryContentContainer.propTypes = {
  source: PropTypes.string,
  index: shapes.DataWipErr,
  uiLanguage: PropTypes.string.isRequired,
  contentLanguage: PropTypes.string.isRequired,
  langSelectorMount: PropTypes.instanceOf(PropTypes.element),
  history: shapes.History.isRequired,
  downloadAllowed: PropTypes.bool.isRequired,
};

export default LibraryContentContainer;