import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { selectors as settings } from '../../../redux/modules/settings';
import { actions, selectors } from '../../../redux/modules/assets';
import { selectSuitableLanguage } from '../../../helpers/language';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import { isEmpty, physicalFile } from '../../../helpers/utils';
import { updateQuery } from '../../../helpers/url';
import PDF, { isTaas, startsFrom } from '../../shared/PDF/PDF';
import ScrollToSearch from '../../shared/DocToolbar/ScrollToSearch';
import Download from '../../shared/Download/Download';
import WipErr from '../../shared/WipErr/WipErr';
import AudioPlayer from '../../shared/AudioPlayer';
import MenuLanguageSelector from '../../Language/Selector/MenuLanguageSelector';
import { getPageFromLocation } from '../../Pagination/withPagination';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { CT_SOURCE } from '../../../helpers/consts';

export const checkRabashGroupArticles = source => {
  if (/^gr-/.test(source)) { // Rabash Group Articles
    const result = /^gr-(.+)/.exec(source);
    return { uid: result[1], isGr: true };
  }

  return { uid: source, isGr: false };
};

export const buildBookmarkSource = source => {
  const { uid, isGr } = checkRabashGroupArticles(source);
  const s             = {
    subject_uid: uid,
    subject_type: CT_SOURCE
  };
  if (isGr) {
    s.properties = { uid_prefix: 'gr-' };
  }

  return s;
};

export const buildLabelData = source => {
  const { uid, isGr } = checkRabashGroupArticles(source);
  const s             = { content_unit: uid };
  if (isGr) {
    s.properties = { uid_prefix: 'gr-' };
  }

  return s;
};

const Library = ({ data, source, downloadAllowed, t }) => {
  const location                    = useLocation();
  const history                     = useHistory();
  const [pageNumber, setPageNumber] = useState(getPageFromLocation(location));
  const [language, setLanguage]     = useState(null);
  const [languages, setLanguages]   = useState([]);

  const { isMobileDevice } = useContext(DeviceInfoContext);

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

  const handleLanguageChanged = (e, language) => {
    updateQuery(history, query => ({ ...query, language }));
    setLanguage(language);
  };

  const getAudioPlayer = () => {
    const { mp3 } = data[language];
    return mp3 ? <AudioPlayer mp3={mp3} /> : null;
  }

  const getLanguageBar = () => {
    const languageBar = languages.length > 0 &&
      <div className="library-language-container">
        {!isMobileDevice && getAudioPlayer()}
        <MenuLanguageSelector
          languages={languages}
          defaultValue={language}
          onSelect={handleLanguageChanged}
          fluid={false}
        />
        {isMobileDevice && getAudioPlayer()}
      </div>;

    return languageBar;
  };

  const languageBar = getLanguageBar();

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
        <div
          style={{ direction, textAlign: (direction === 'ltr' ? 'left' : 'right') }}>
          <ScrollToSearch
            data={contentData}
            language={language}
            source={{ language, ...buildBookmarkSource(source) }}
            label={{ language, ...buildLabelData(source) }}
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
