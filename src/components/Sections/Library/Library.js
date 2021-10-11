import React, { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';

import { selectors, actions } from '../../../redux/modules/assets';
import { selectors as settings } from '../../../redux/modules/settings';
import { DeviceInfoContext, SessionInfoContext } from '../../../helpers/app-contexts';
import { physicalFile, isEmpty } from '../../../helpers/utils';
import { selectSuitableLanguage } from '../../../helpers/language';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import { getQuery, updateQuery } from '../../../helpers/url';
import {
  buildSearchLinkFromSelection,
  DOM_ROOT_ID,
  prepareScrollToSearch
} from '../../../helpers/scrollToSearch/helper';
import { getPageFromLocation } from '../../Pagination/withPagination';
import Download from '../../shared/Download/Download';
import WipErr from '../../shared/WipErr/WipErr';
import ShareBar from '../../shared/ShareSelected';
import PDF, { isTaas, startsFrom } from '../../shared/PDF/PDF';
import MenuLanguageSelector from '../../Language/Selector/MenuLanguageSelector';

export const checkRabashGroupArticles = source => {
  if (/^gr-/.test(source)) { // Rabash Group Articles
    const result = /^gr-(.+)/.exec(source);
    return result[1];
  }

  return source;

};

const Library = ({ data, source, downloadAllowed, t }) => {
  const location                             = useLocation();
  const history                              = useHistory();
  const [pageNumber, setPageNumber]          = useState(getPageFromLocation(location));
  const [searchUrl, setSearchUrl]            = useState();
  const [searchText, setSearchText]          = useState();
  const [language, setLanguage]              = useState(null);
  const [languages, setLanguages]            = useState([]);
  const { srchstart, srchend, highlightAll } = getQuery(location);
  const search                               = { srchstart, srchend };
  const { isMobileDevice }                                              = useContext(DeviceInfoContext);
  const { enableShareText: { isShareTextEnabled, setEnableShareText } } = useContext(SessionInfoContext);

  const doc2htmlById    = useSelector(state => selectors.getDoc2htmlById(state.assets));
  const uiLanguage      = useSelector(state => settings.getLanguage(state.settings));
  const contentLanguage = useSelector(state => settings.getContentLanguage(state.settings, location));

  useEffect(() => {
    if (data) {
      const languages = Object.keys(data);
      setLanguages(languages);
    }
  }, [data]);

  useEffect(() => {
    const newLanguage = selectSuitableLanguage(contentLanguage, uiLanguage, languages);
    if (newLanguage) {
      setLanguage(newLanguage);
    }
  }, [contentLanguage, uiLanguage, languages]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (data && language && !isEmpty(source)) {
      const lData = data[language];

      // In case of TAS we prefer PDF, otherwise HTML
      // pdf.js fetch it on his own (smarter than us), we fetch it for nothing.
      if (lData && (!lData.pdf || !isTaas(source))) {
        const { id } = lData.docx || lData.doc || {};
        id && dispatch(actions.doc2html(id));
      }
    }
  }, [data, language, source, dispatch]);

  useEffect(() => {
    const handleOnMouseUp = e => {
      if (isMobileDevice || !isShareTextEnabled) {
        return false;
      }

      const { url, text } = buildSearchLinkFromSelection(language);
      if (url)       {
        setSearchText(text);
        setSearchUrl(url);
      }

      return false;
    };

    document.addEventListener('mouseup', handleOnMouseUp);
    return () => document.removeEventListener('mouseup', handleOnMouseUp);
  }, [isMobileDevice, isShareTextEnabled, language]);


  const handleOnMouseDown = e => {
    if (isMobileDevice || !isShareTextEnabled) {
      return false;
    }

    setSearchUrl(null);
    return false;
  };

  if (!data) {
    return <Segment basic>&nbsp;</Segment>;
  }

  const pageNumberHandler = pageNumber => {
    setPageNumber(pageNumber);
    updateQuery(history, query => ({
      ...query,
      page: pageNumber,
    }));
  };

  const disableShareBar = () => setEnableShareText(false);

  const renderShareBar = () => isMobileDevice || !searchUrl
    ? null
    : <ShareBar url={searchUrl} text={searchText} disable={disableShareBar} />;

  const handleLanguageChanged = (e, language) => {
    updateQuery(history, query => ({
      ...query,
      language,
    }));

    setLanguage(language);
  };

  const languageBar = languages.length > 0 &&
      <div className="library-language-container">
        <MenuLanguageSelector
          languages={languages}
          defaultValue={language}
          onSelect={handleLanguageChanged}
          fluid={false}
        />
      </div>

  const getContent = () => {
    if (!data?.[language])
      return null;

    const { pdf, docx, doc } = data[language];
    if (pdf && isTaas(source))
      return { url: physicalFile(pdf), isPDF: true, name: pdf.name };

    const file = docx || doc;
    if (!file)
      return null;

    return { url: physicalFile(file, true), name: file.name, ...doc2htmlById[file.id] };
  };

  const content = getContent() || {};

  const getContentToDisplay = () => {
    const { wip, err, data: contentData, isPDF, url } = content;

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

    if (isPDF) {
      const starts = startsFrom(source) || 1;

      return (
        <PDF
          pdfFile={url}
          pageNumber={pageNumber || 1}
          startsFrom={starts}
          pageNumberHandler={pageNumberHandler}
        />
      );
    } else if (contentData) {
      const direction = getLanguageDirection(language);
      return (
        <div className="search-on-page--container">
          {isShareTextEnabled && renderShareBar()}
          <div
            id={DOM_ROOT_ID}
            onMouseDown={handleOnMouseDown}
            style={{ direction, textAlign: (direction === 'ltr' ? 'left' : 'right') }}
            dangerouslySetInnerHTML={{ __html: prepareScrollToSearch(contentData, search, highlightAll === 'true') }}
          />
        </div>
      );
    }

    return null;

  };

  const contentsToDisplay = getContentToDisplay();
  if (contentsToDisplay === null) {
    return <Segment basic>{t('sources-library.no-source')}</Segment>;
  }

  // PDF.js will fetch file by itself
  const mimeType = content.isPDF
    ? 'application/pdf'
    : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  return (
    <div>
      {languageBar}
      <Download path={content.url} mimeType={mimeType} downloadAllowed={downloadAllowed} filename={content.name} />
      {contentsToDisplay}
    </div>
  );
};

Library.propTypes = {
  source: PropTypes.string,
  data: PropTypes.any,
  downloadAllowed: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(Library);
