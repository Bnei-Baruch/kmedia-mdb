import React, { useContext, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Container, Icon, Portal, Segment, Sticky } from 'semantic-ui-react';

import { selectors } from '../../../redux/modules/assets';
import { assetUrl } from '../../../helpers/Api';
import { isEmpty } from '../../../helpers/utils';
import AnchorsLanguageSelector from '../../Language/Selector/AnchorsLanguageSelector';
import PDF, { isTaas, startsFrom } from '../../shared/PDF/PDF';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import { getQuery, updateQuery } from '../../../helpers/url';
import { prepareScrollToSearch, buildSearchLinkFromSelection } from '../../../helpers/utils';
import { getPageFromLocation } from '../../Pagination/withPagination';
import Download from '../../shared/Download/Download';
import WipErr from '../../shared/WipErr/WipErr';
import ShareBar from '../../AVPlayer/Share/ShareBar';
import { DeviceInfoContext } from '../../../helpers/app-contexts';

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
  const location                            = useLocation();
  const history                             = useHistory();
  const [pageNumber, setPageNumber]         = useState(getPageFromLocation(location));
  const [searchUrl, setSearchUrl]           = useState();
  const [isShareBarOpen, setIsShareBarOpen] = useState();
  const { srchstart, srchend }              = getQuery(location);
  const search                              = { srchstart, srchend };
  const { isMobileDevice }                  = useContext(DeviceInfoContext);

  const content = useSelector(state => selectors.getAsset(state.assets));

  const contentRef = useRef();

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

  const updateSelection = () => {
    let url = buildSearchLinkFromSelection(language);
    if (!url)
      return;
    setSearchUrl(url);
  };

  const handleOnShareClick = (e) => {
    setIsShareBarOpen(!isShareBarOpen);
    updateSelection();
  };

  const handleOnTouchStart = (e) => setIsShareBarOpen(false);

  const handleOnMouseUp = (e) => {
    if (isMobileDevice) {
      return false;
    }
    updateSelection();
    return false;
  };

  const handleOnMouseDown = (e) => {
    if (isMobileDevice) {
      return false;
    }
    setSearchUrl(null);
    return false;
  };

  const renderShareBar = () => {

    const shareBar = <ShareBar
      url={searchUrl}
      buttonSize="medium"
      embedContent={searchUrl}
      messageTitle={t('share-text.message-title')}
      className="search-on-page--share-bar" />;

    let bar = null;
    if (isMobileDevice) {
      const openClose = !isShareBarOpen ?
        (<Button icon onClick={handleOnShareClick}>{t('share-text.share-button')}
          <Icon name="share alternate" />
        </Button>) : null;

      bar = (<div className="search-on-page--share">{openClose} {isShareBarOpen ? shareBar : null}</div>);
    } else {
      bar = searchUrl ? shareBar : null;
    }

    if (bar === null)
      return null;

    return (
      <Sticky context={contentRef} offset={isMobileDevice ? 30 : 80} styleElement={{ 'width': 'auto' }}>
        {bar}
      </Sticky>
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
        <div ref={contentRef} className="search-on-page--container">
          {renderShareBar()}
          <div
            onMouseUp={handleOnMouseUp}
            onMouseDown={handleOnMouseDown}
            onTouchStart={handleOnTouchStart}
            style={{ direction, textAlign: (direction === 'ltr' ? 'left' : 'right') }}
            dangerouslySetInnerHTML={{ __html: prepareScrollToSearch(contentData, search) }}
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
      <Container fluid textAlign="right">
        <AnchorsLanguageSelector
          languages={languages}
          defaultValue={language}
          onSelect={handleLanguageChanged}
        />
      </Container>
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
