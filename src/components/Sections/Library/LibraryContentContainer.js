import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { assetUrl } from '../../../helpers/Api';
import { isEmpty } from '../../../helpers/utils';
import { selectSuitableLanguage } from '../../../helpers/language';
import { updateQuery } from '../../../helpers/url';
import { actions, selectors } from '../../../redux/modules/assets';
import * as shapes from '../../shapes';
import Library from './Library';
import PDF from '../../shared/PDF/PDF';

const getFullUrl = (pdf, data, language, source) => {
  if (pdf) {
    return assetUrl(`sources/${pdf}`);
  }

  if (isEmpty(data) || isEmpty(data[language])) {
    return null;
  }

  let id = source;
  if (/^gr-/.test(id)) { // Rabash Group Articles
    const result = /^gr-(.+)/.exec(id);
    id           = result[1];
  }

  return assetUrl(`sources/${id}/${data[language].docx}`);
};


const getTaasPdf = (langData, source) => {
  let pdfFile;

  if (langData && langData.pdf) {
    pdfFile = `${source}/${langData.pdf}`;
  }

  return pdfFile;
};

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
      const languages =[...Object.keys(data)];
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

  const fetchContent = useCallback(() => {
    if (data && language){
      const lData = data[language];

      // In case of TAS we prefer PDF, otherwise HTML
      if (lData && lData.pdf && PDF.isTaas(source)) {
      // pdf.js fetch it on his own (smarter than us), we fetch it for nothing.
        return;
      }
  
      let id = source;
      if (/^gr-/.test(id)) { // Rabash Group Articles
        const result = /^gr-(.+)/.exec(id);
        id           = result[1];
      }
  
      dispatch(actions.fetchAsset(`sources/${id}/${lData.html}`));
    }
  }, [data, language, source, dispatch]);

  useEffect(() => {
    if (!isEmpty(source)) {
      fetchContent();
    }
  }, [source, fetchContent]);

  // this handler passed to child component to handle language change from there
  const handleLanguageChanged = (e, language) => {
    updateQuery(history, query => ({
      ...query,
      language,
    }));

    setLanguage(language);
  };

  const content = useSelector(state => selectors.getAsset(state.assets));

  const startsFrom = PDF.startsFrom(source);
  const isTaas     = PDF.isTaas(source);
  
  let pdfFile;
  if (data && isTaas){
    const langData = data[language];
    pdfFile = getTaasPdf(langData, source);
  }

  return (
    <Library
      isTaas={isTaas}
      pdfFile={pdfFile}
      fullUrlPath={getFullUrl(pdfFile, data, language, source)}
      startsFrom={startsFrom}
      content={data ? content : {}}
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