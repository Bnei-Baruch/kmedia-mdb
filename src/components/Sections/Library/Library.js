import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { selectors as settings } from '../../../redux/modules/settings';
import { actions, selectors } from '../../../redux/modules/assets';
import { getLanguageName, selectSuitableLanguage } from '../../../helpers/language';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import { physicalFile } from '../../../helpers/utils';
import { getQuery, updateQuery } from '../../../helpers/url';
import PDF, { isTaas, startsFrom } from '../../shared/PDF/PDF';
import ScrollToSearch from '../../shared/DocToolbar/ScrollToSearch';
import Download from '../../shared/Download/Download';
import WipErr from '../../shared/WipErr/WipErr';
import AudioPlayer from '../../shared/AudioPlayer';
import MenuLanguageSelector from '../../Language/Selector/MenuLanguageSelector';
import { getPageFromLocation } from '../../Pagination/withPagination';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { CT_SOURCE, LANG_HEBREW } from '../../../helpers/consts';

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

export const buildLabelData        = source => {
  const { uid, isGr } = checkRabashGroupArticles(source);
  const s             = { content_unit: uid };
  if (isGr) {
    s.properties = { uid_prefix: 'gr-' };
  }

  return s;
};
export const getLibraryContentFile = (data = {}, sourceId) => {
  const { pdf, docx, doc } = data;
  if (pdf && isTaas(sourceId))
    return { url: physicalFile(pdf), isPDF: true, name: pdf.name };

  const file = docx || doc;
  if (!file)
    return {};

  return { url: physicalFile(file, true), name: file.name, id: file.id };
};

const Library = ({ data, source, downloadAllowed }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const location           = useLocation();
  const navigate           = useNavigate();
  const { t }              = useTranslation();

  const doc2htmlById    = useSelector(state => selectors.getDoc2htmlById(state.assets));
  const contentLanguages = useSelector(state => settings.getContentLanguages(state.settings, location));

  const [pageNumber, setPageNumber] = useState(getPageFromLocation(location));

  const query = getQuery(location);
  let desiredLanguages = contentLanguages.slice();
  if (query && query.source_language) {
    desiredLanguages = [query.source_language];
  }

  const sourceLanguages = data ? Object.keys(data) : [];
  const _language = selectSuitableLanguage(desiredLanguages, sourceLanguages, LANG_HEBREW);
  const dispatch  = useDispatch();

  const [selectedSourceLanguage, setSelectedSourceLanguage] = useState('');

  useEffect(() => {
    if (!selectedSourceLanguage && !!desiredLanguages.length) {
      setSelectedSourceLanguage(selectSuitableLanguage(desiredLanguages, sourceLanguages, LANG_HEBREW));
    }
  }, [desiredLanguages.join(','), sourceLanguages.slice().sort().join(',')]);

  const file    = getLibraryContentFile(data?.[selectedSourceLanguage], source);
  const fetched = !!doc2htmlById[file.id]?.data;
  useEffect(() => {
    if (file.id && !fetched)
      dispatch(actions.doc2html(file.id));
  }, [file.id, fetched]);

  if (!data) {
    return <Segment basic>&nbsp;</Segment>;
  }

  const pageNumberHandler = pageNumber => {
    setPageNumber(pageNumber);
    updateQuery(navigate, location, query => ({
      ...query,
      page: pageNumber,
    }));
  };

  const handleLanguageChanged = (selected) => {
    updateQuery(navigate, location, query => ({ ...query, source_language: selected }));
    if (!!sourceLanguages.length) {
      setSelectedSourceLanguage(selected);
    }
  };

  const getAudioPlayer = () => {
    const { mp3 } = data[selectedSourceLanguage] || {};
    return mp3 ? <AudioPlayer file={mp3} /> : null;
  };

  const getLanguageBar = () => {
    const languageBar = sourceLanguages.length > 0 &&
      <div className="library-language-container">
        {!isMobileDevice && getAudioPlayer()}
        <MenuLanguageSelector
          languages={sourceLanguages}
          selected={selectedSourceLanguage}
          onLanguageChange={handleLanguageChanged}
          multiSelect={false}
          optionText={(language) => getLanguageName(language) + (data && data[language] && data[language].mp3 ? ' \uD83D\uDD0A' : '')}
        />
        {isMobileDevice && getAudioPlayer()}
      </div>;

    return languageBar;
  };
  const languageBar         = getLanguageBar();
  const content             = (file.isPDF || !file) ? file : { ...file, ...doc2htmlById[file.id] };

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
      const direction = getLanguageDirection(selectedSourceLanguage);

      return (
        <div
          style={{ direction, textAlign: (direction === 'ltr' ? 'left' : 'right') }}>
          <ScrollToSearch
            data={contentData}
            language={selectedSourceLanguage}
            source={{ selectedSourceLanguage, ...buildBookmarkSource(source) }}
            label={{ selectedSourceLanguage, ...buildLabelData(source) }}
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
};

export default Library;
