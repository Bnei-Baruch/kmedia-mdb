import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { Container, Portal, Segment } from 'semantic-ui-react';

import { assetUrl } from '../../../helpers/Api';
import { formatError, isEmpty } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash/Splash';
import AnchorsLanguageSelector from '../../Language/Selector/AnchorsLanguageSelector';
import PDF from '../../shared/PDF/PDF';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import { updateQuery } from '../../../helpers/url';
import withPagination from '../../Pagination/withPagination';
import Download from '../../shared/Download/Download';

const defaultContent = {
  data: null,
  wip: false,
  err: null,
};

const getContentToDisplay = (language, pageNumber, pageNumberHandler, usePdfFile, pdfFile, startsFrom, content, t) => {
  const { wip: contentWip, err: contentErr, data: contentData } = content;

  if (contentErr) {
    if (contentErr.response && contentErr.response.status === 404) {
      return <FrownSplash text={t('messages.source-content-not-found')} />;
    } else {
      return <ErrorSplash text={t('messages.server-error')} subtext={formatError(contentErr)} />;
    }
  } else if (contentWip) {
    return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
  } else if (usePdfFile) {
    return (
      <PDF
        pdfFile={assetUrl(`sources/${pdfFile}`)}
        pageNumber={pageNumber || 1}
        startsFrom={startsFrom}
        pageNumberHandler={pageNumberHandler}
      />
    );
  } else if (contentData) {
    const direction = getLanguageDirection(language);

    return (
      <div
        style={{ direction, textAlign: (direction === 'ltr' ? 'left' : 'right') }}
        dangerouslySetInnerHTML={{ __html: contentData }}
      />
    );
  } else {
    return null;
  }
};

const Library = (props) => {
  const location                    = useLocation();
  const history                     = useHistory();
  const [pageNumber, setPageNumber] = useState(withPagination.getPageFromLocation(location));

  const
    {
      content           = defaultContent,
      language          = null,
      languages         = [],
      isTaas,
      langSelectorMount = null,
      fullUrlPath       = null,
      t,
    } = props;

  const pageNumberHandler = pageNumber => {
    setPageNumber(pageNumber);
    updateQuery(history, query => ({
      ...query,
      page: pageNumber,
    }));
  };

  if (isEmpty(content)) {
    return <Segment basic>&nbsp;</Segment>;
  }

  // PDF.js will fetch file by itself
  const { pdfFile = null, startsFrom = 1, downloadAllowed } = props;
  const usePdfFile                                          = isTaas && pdfFile;
  const mimeType                                            = usePdfFile ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  const contentsToDisplay = getContentToDisplay(language, pageNumber, pageNumberHandler, pdfFile, usePdfFile, startsFrom, content, t);
  if (contentsToDisplay === null) {
    return <Segment basic>{t('sources-library.no-source')}</Segment>;
  }

  let languageBar = null;
  if (languages.length > 0) {
    const { handleLanguageChanged } = props;
    languageBar                     = (
      <Container fluid textAlign="right">
        <AnchorsLanguageSelector
          languages={languages}
          defaultValue={language}
          onSelect={handleLanguageChanged}
        />
      </Container>
    );
  }

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
  content: PropTypes.shape({
    data: PropTypes.string, // actual content (HTML)
    wip: shapes.WIP,
    err: shapes.Error,
  }),
  isTaas: PropTypes.bool.isRequired,
  pdfFile: PropTypes.string,
  startsFrom: PropTypes.number,
  language: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.string),
  langSelectorMount: PropTypes.instanceOf(PropTypes.element),
  handleLanguageChanged: PropTypes.func.isRequired,
  fullUrlPath: PropTypes.string,
  downloadAllowed: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(Library);
