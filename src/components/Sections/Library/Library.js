import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { Grid, Portal, Segment} from 'semantic-ui-react';

import { selectors } from '../../../redux/modules/assets';
import { physicalFile } from '../../../helpers/utils';

import PDF, { isTaas, startsFrom } from '../../shared/PDF/PDF';
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
import { DeviceInfoContext, SessionInfoContext } from '../../../helpers/app-contexts';
import MenuLanguageSelector from "../../Language/Selector/MenuLanguageSelector";

export const checkRabashGroupArticles = source => {
  if (/^gr-/.test(source)) { // Rabash Group Articles
    const result = /^gr-(.+)/.exec(source);
    return result[1];
  }

  return source;

};

const Library = ({
  data,
  source,
  language = null,
  languages = [],
  langSelectorMount = null,
  downloadAllowed,
  handleLanguageChanged,
  t,
}) => {
  const location                             = useLocation();
  const history                              = useHistory();
  const [pageNumber, setPageNumber]          = useState(getPageFromLocation(location));
  const [searchUrl, setSearchUrl]            = useState();
  const [searchText, setSearchText]          = useState();
  const { srchstart, srchend, highlightAll } = getQuery(location);

  const search                                                          = { srchstart, srchend };
  const { isMobileDevice }                                              = useContext(DeviceInfoContext);
  const { enableShareText: { isShareTextEnabled, setEnableShareText } } = useContext(SessionInfoContext);

  const doc2htmlById = useSelector(state => selectors.getDoc2htmlById(state.assets));

  const getContent = () => {
    if (!data?.[language])
      return null;
    const { pdf, docx, doc } = data[language];
    const file               = docx || doc;
    if (!file) return null;

    if (pdf && isTaas(source))
      return { url: physicalFile(pdf), isPDF: true, name: pdf.name };
    return { url: physicalFile(file, true), name: file.name, ...doc2htmlById[file.id] };
  };

  const content = getContent() || {};

  //use  early definition for use in useEffect
  const updateSelection = () => {
    const { url, text } = buildSearchLinkFromSelection(language);
    if (!url)
      return;
    setSearchText(text);
    setSearchUrl(url);
  };

  const handleOnMouseUp = e => {
    if (isMobileDevice || !isShareTextEnabled) {
      return false;
    }

    updateSelection();
    return false;
  };

  const handleOnMouseDown = e => {
    if (isMobileDevice || !isShareTextEnabled) {
      return false;
    }

    setSearchUrl(null);
    return false;
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleOnMouseUp);
    return () => document.removeEventListener('mouseup', handleOnMouseUp);
  });

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

  const renderShareBar = () => {
    if (isMobileDevice || !searchUrl)
      return null;

    return (
      <ShareBar url={searchUrl} text={searchText} disable={disableShareBar} />
    );
  };

  const getContentToDisplay = () => {
    const { wip, err, data: contentData, isPDF, url } = content;
    const starts                                      = startsFrom(source) || 1;

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

    if (isPDF) {
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

  let languageBar = null;

  if (languages.length > 0) {
    languageBar = (
      <div className="library-language-container">
          <MenuLanguageSelector
            languages={languages}
            defaultValue={language}
            onSelect={handleLanguageChanged}
            fluid={false}
          />
      </div>
    );
  }

  // PDF.js will fetch file by itself
  const mimeType = content.isPDF
    ? 'application/pdf'
    : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  return (
    <div>
      {
        langSelectorMount && languageBar
          ? <Portal open preprend mountNode={langSelectorMount}>{languageBar}</Portal>
          : languageBar
      }
      <Download path={content.url} mimeType={mimeType} downloadAllowed={downloadAllowed} filename={content.name} />
      {contentsToDisplay}
    </div>
  );
};

Library.propTypes = {
  source: PropTypes.string,
  data: PropTypes.any,
  language: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.string),
  langSelectorMount: PropTypes.instanceOf(PropTypes.element),
  handleLanguageChanged: PropTypes.func.isRequired,
  downloadAllowed: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(Library);
