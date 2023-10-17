import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { Grid, Header } from 'semantic-ui-react';
import { selectors as siteSettings } from '../../../lib/redux/slices/settingsSlice/settingsSlice';
import { selectors } from '../../../lib/redux/slices/mdbSlice/mdbSlice';
import { selectSuitableLanguage } from '../../../src/helpers/language';
import { LANG_HEBREW, MT_AUDIO } from '../../../src/helpers/consts';
import LibraryBar from '../../../src/components/Sections/Library/LibraryBar';
import MenuLanguageSelector from '../../../src/components/Language/Selector/MenuLanguageSelector';
import Download from '../../../src/components/shared/Download/Download';
import TagsByUnit from '../../../src/components/shared/TagsByUnit';
import LikutAudioPlayer from '../../../src/components/Sections/Likutim/LikutAudioPlayer';

const HeaderLikut = () => {
  const { id } = useParams();
  const { t }  = useTranslation();

  const location         = useLocation();
  const unit             = useSelector(state => selectors.getDenormContentUnit(state.mdb, id));
  const uiLang           = useSelector(state => siteSettings.getUILang(state.settings, location));
  const contentLanguages = useSelector(state => siteSettings.getContentLanguages(state.settings, location));

  const [settings, setSettings]     = useState(null);

  const likutimLanguages                          = ((unit && unit.files) || []).map(f => f.language);
  const defaultLanguage                           = selectSuitableLanguage(contentLanguages, likutimLanguages, LANG_HEBREW);
  const [selectedLanguage, setSelectedLanguage]   = useState(defaultLanguage);

  const handleLanguageChanged = (selectedLanguage) => setSelectedLanguage(selectedLanguage);

  const { fontSize = 0 } = settings || {};
  const bookmarkSource     = { subject_uid: unit.id, subject_type: unit.content_type, language: uiLang };
  const labelSource        = { content_unit: unit.id, language: uiLang };

  const mp3File = files.find(f => f.language === selectedLanguage && f.type === MT_AUDIO);

  return (
    <>
      <div className="section-header likut">
        <Header as="h2" className="topics__title-font">
          <Header.Content>
            {`${t('likutim.item-header')} ${name}`}
            <Header.Subheader>{t('values.date', { date: film_date })}</Header.Subheader>
          </Header.Content>
        </Header>
        {/* toolbar */}
        <Grid className="likut__toolbar" columns={2} stackable>
          <Grid.Column>
            <TagsByUnit id={id} />
          </Grid.Column>
          <Grid.Column>
            <div className="source__header-toolbar">
              <div className="display-iblock margin-right-8 margin-left-8">
                {
                  file && (
                    <Download
                      path={url}
                      mimeType={file.mimetype}
                      downloadAllowed={true}
                      filename={file.name}
                    />
                  )
                }
                <LibraryBar
                  fontSize={fontSize}
                  isReadable={isReadable}
                  handleIsReadable={handleIsReadable}
                  handleSettings={setSettings}
                  source={bookmarkSource}
                  label={labelSource}
                />
              </div>
              <div className="library-language-container">
                <MenuLanguageSelector
                  languages={likutimLanguages}
                  selected={selectedLanguage}
                  onLanguageChange={handleLanguageChanged}
                  multiSelect={false}
                />
              </div>
            </div>
          </Grid.Column>
        </Grid>
      </div>
      <div className="likut__audio">
        <LikutAudioPlayer file={mp3File} id={id} lang={lang} />
      </div>
    </>
  );
};

export default HeaderLikut;
