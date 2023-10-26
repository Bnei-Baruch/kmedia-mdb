import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

import { selectors as assets } from '../../../../lib/redux/slices/assetSlice/assetSlice';
import { getLanguageName } from '../../../helpers/language';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import PDF, { startsFrom } from '../../shared/PDF/PDF';
import ScrollToSearch from '../../../helpers/scrollToSearch/ScrollToSearch';
import Download from '../../shared/Download/Download';
import WipErr from '../../shared/WipErr/WipErr';
import AudioPlayer from '../../shared/AudioPlayer';
import MenuLanguageSelector from '../../Language/Selector/MenuLanguageSelector';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { getLibraryContentFile, buildBookmarkSource, buildLabelData } from './helper';
import { selectors as textFile, selectors } from '../../../../lib/redux/slices/textFileSlice/textFileSlice';

const Library = () => {
  const { isMobileDevice, deviceInfo } = useContext(DeviceInfoContext);
  const { t }                          = useTranslation();

  const id            = useSelector(state => selectors.getSubjectInfo(state.textFile).id);
  const doc2htmlById  = useSelector(state => assets.getDoc2htmlById(state.assets));
  const { data = {} } = useSelector(state => assets.getSourceIndexById(state.assets)[id]) || false;
  const fileLanguage  = useSelector(state => textFile.getLanguage(state.textFile));

  const sourceLanguages = Object.keys(data);
  const file            = getLibraryContentFile(data[fileLanguage], id);

  const searchParams = useSearchParams();
  const router       = useRouter();

  const pageNumberHandler = pageNumber => {
    const _params = new URLSearchParams(searchParams);
    _params.page  = pageNumber;
    router.push({ query: _params.toString() });
  };

  const handleLanguageChanged = (selected) => {
    const _params           = new URLSearchParams(searchParams);
    _params.source_language = selected;
    router.push({ query: _params.toString() });
  };

  const getAudioPlayer = () => {
    const { mp3 } = data[fileLanguage] || {};
    return mp3 ? <AudioPlayer file={mp3} /> : null;
  };

  const getLanguageBar = () => {
    const languageBar = sourceLanguages.length > 0 &&
      <div className="library-language-container">
        {!isMobileDevice && getAudioPlayer()}
        <MenuLanguageSelector
          languages={sourceLanguages}
          selected={fileLanguage}
          onLanguageChange={handleLanguageChanged}
          multiSelect={false}
          optionText={(language) => getLanguageName(language) + (data && data[language] && data[language].mp3 ? ' \uD83D\uDD0A' : '')}
        />
        {isMobileDevice && getAudioPlayer()}
      </div>;

    return languageBar;
  };
  const languageBar    = getLanguageBar();
  const content        = (file.isPDF || !file) ? file : { ...file, ...doc2htmlById[file.id] };

  const getContentToDisplay = () => {
    const { wip, err, data: contentData, isPDF, url } = content;

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

    if (isPDF) {
      const starts = startsFrom(id) || 1;

      return (
        <PDF
          pdfFile={url}
          pageNumber={searchParams.get('page') || 1}
          startsFrom={starts}
          pageNumberHandler={pageNumberHandler}
        />
      );
    } else if (contentData) {
      const direction = getLanguageDirection(fileLanguage);

      return (
        <div
          style={{ direction, textAlign: (direction === 'ltr' ? 'left' : 'right') }}>
          <ScrollToSearch />
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
      <Download path={content.url} mimeType={mimeType} downloadAllowed={deviceInfo.os.name !== 'iOS'} filename={content.name} />
      {contentsToDisplay}
    </div>
  );
};

Library.propTypes = {
  id: PropTypes.string,
  data: PropTypes.any,
};

export default Library;
