import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { Container, Portal, Segment } from 'semantic-ui-react';

import { selectors } from '../../../redux/modules/assets';
import { assetUrl } from '../../../helpers/Api';
import { isEmpty } from '../../../helpers/utils';
import AnchorsLanguageSelector from '../../Language/Selector/AnchorsLanguageSelector';
import PDF, { isTaas, startsFrom } from '../../shared/PDF/PDF';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import { updateQuery } from '../../../helpers/url';
import { getPageFromLocation } from '../../Pagination/withPagination';
import Download from '../../shared/Download/Download';
import WipErr from '../../shared/WipErr/WipErr';

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

const getContentToDisplay = (content, language, pageNumber, pageNumberHandler, pdfFile, startsFrom, t) => {
  const { wip, err, data: contentData } = content;

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) {
    return wipErr;
  }

  if (pdfFile) {
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
  const location                    = useLocation();
  const history                     = useHistory();
  const [pageNumber, setPageNumber] = useState(getPageFromLocation(location));

  const content = useSelector(state => selectors.getAsset(state.assets));

  if (!data) {
    return <Segment basic>&nbsp;</Segment>;
  }

  const starts = startsFrom(source) || 1;
  const taas   = isTaas(source);

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

  const contentsToDisplay = getContentToDisplay(content, language, pageNumber, pageNumberHandler, pdfFile, starts, t);
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
