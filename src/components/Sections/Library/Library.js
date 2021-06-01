import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import {Container, Grid, Portal, Segment} from 'semantic-ui-react';

import { selectors } from '../../../redux/modules/assets';
import { assetUrl } from '../../../helpers/Api';
import { isEmpty } from '../../../helpers/utils';
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
import DropdownLanguageSelector from "../../Language/Selector/DropdownLanguageSelector";
import classNames from "classnames";

export const checkRabashGroupArticles = (source) => {
  if (/^gr-/.test(source)) { // Rabash Group Articles
    const result = /^gr-(.+)/.exec(source);
    return result[1];
  } else {
    return source;
  }
};

const getFullUrl = (pdfFile, data, language, source) => {
  if (pdfFile) {
    return assetUrl(`sources/${pdfFile}`);
  }

  if (isEmpty(data) || isEmpty(data[language])) {
    return null;
  }

  const id = checkRabashGroupArticles(source);

  return assetUrl(`sources/${id}/${data[language].docx}`);
};

const Library = ({ data, source, language = null, languages = [], langSelectorMount = null, downloadAllowed, handleLanguageChanged, t, }) => {
  const location                             = useLocation();
  const history                              = useHistory();
  const [pageNumber, setPageNumber]          = useState(getPageFromLocation(location));
  const [searchUrl, setSearchUrl]            = useState();
  const [searchText, setSearchText]          = useState();
  const { srchstart, srchend, highlightAll } = getQuery(location);

  const search                                                          = { srchstart, srchend };
  const { isMobileDevice }                                              = useContext(DeviceInfoContext);
  const { enableShareText: { isShareTextEnabled, setEnableShareText } } = useContext(SessionInfoContext);

  const content = useSelector(state => selectors.getAsset(state.assets));

  //use  early definition for use in useEffect
  const updateSelection = () => {
    const { url, text } = buildSearchLinkFromSelection(language);
    if (!url)
      return;
    setSearchText(text);
    setSearchUrl(url);
  };

  const handleOnMouseUp = (e) => {
    if (isMobileDevice || !isShareTextEnabled) {
      return false;
    }
    updateSelection();
    return false;
  };

  const handleOnMouseDown = (e) => {
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

  const taas = isTaas(source);

  let pdfFile;
  if (data && taas) {
    const langData = data[language];

    if (langData && langData.pdf) {
      pdfFile = `${source}/${langData.pdf}`;
    }
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
    const { wip, err, data: contentData } = content;
    const starts                          = startsFrom(source) || 1;

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

    if (pdfFile) {
      return (
        <PDF
          pdfFile={assetUrl(`sources/${pdfFile}`)}
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
    } else {
      return null;
    }
  };

  const contentsToDisplay = getContentToDisplay();
  if (contentsToDisplay === null) {
    return <Segment basic>{t('sources-library.no-source')}</Segment>;
  }

  let languageBar = null;

  if (languages.length > 0) {
    languageBar = (
      <Grid container padded={false} columns={isMobileDevice ? 1 : 2} className={classNames("no-margin-top", "no-padding-top")}>
        {!isMobileDevice &&
        <Grid.Column width={12}>
        </Grid.Column>}
        <Grid.Column width={isMobileDevice ? 16 : 4} className="library-language-column">
          <DropdownLanguageSelector
            className="no-padding"
            languages={languages}
            defaultValue={language}
            onSelect={handleLanguageChanged}
            fluid={isMobileDevice}
          />
        </Grid.Column>
      </Grid>
    );
  }

  const fullUrlPath = getFullUrl(pdfFile, data, language, source);

  // PDF.js will fetch file by itself
  const mimeType = pdfFile
    ? 'application/pdf'
    : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  return (
    <div>
      {
        langSelectorMount && languageBar
          ? <Portal open preprend mountNode={langSelectorMount}>{languageBar}</Portal>
          : languageBar
      }
      <Download path={fullUrlPath} mimeType={mimeType} downloadAllowed={downloadAllowed} />
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
