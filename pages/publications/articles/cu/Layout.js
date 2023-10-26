import React, { useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { Grid, Header } from 'semantic-ui-react';
import clsx from 'clsx';
import { selectors as siteSettings } from '../../../../lib/redux/slices/settingsSlice/settingsSlice';
import { selectors } from '../../../../lib/redux/slices/mdbSlice';
import { getLanguageDirection } from '../../../../src/helpers/i18n-utils';
import { physicalFile } from '../../../../src/helpers/utils';
import LibraryBar from '../../../../src/components/Sections/Library/LibraryBar';
import MenuLanguageSelector from '../../../../src/components/Language/Selector/MenuLanguageSelector';
import Download from '../../../../src/components/shared/Download/Download';
import TagsByUnit from '../../../../src/components/shared/TagsByUnit';
import { selectors as textFile } from '../../../../lib/redux/slices/textFileSlice/textFileSlice';

const ArticleLayout = ({ children }) => {
  const { t } = useTranslation();

  const { id, language, fileId }      = useSelector(state => textFile.getSubjectInfo(state.textFile));
  const { theme, fontType, fontSize } = useSelector(state => textFile.getSettings(state.textFile));
  const isReadable                    = useSelector(state => textFile.getIsReadable(state.textFile));
  const unit                          = useSelector(state => selectors.getDenormContentUnit(state.mdb, id));
  const uiLang                        = useSelector(state => siteSettings.getUILang(state.settings));

  const languages                               = unit.files.map(f => f.language);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const articleRef                              = useRef();

  const handleLanguageChanged = (selectedLanguage) => setSelectedLanguage(selectedLanguage);

  const direction = getLanguageDirection(uiLang);

  const { name, film_date, description = '' } = unit;

  const file = unit.files.find(f => f.id === fileId);
  const url  = file && physicalFile(file, true);

  const subText2 = t(`publications.header.subtext2`);
  return (
    <div
      ref={articleRef}
      className={clsx('source likutim', {
        'is-readable': isReadable,
        [`is-${theme}`]: true,
        [`is-${fontType}`]: true,
        [`size${fontSize}`]: true,
      })}>
      <div className="section-header likut">
        <Header as="h2" className="topics__title-font">
          <Header.Content>
            {name}
            {
              <Header.Subheader>
                {`${t('values.date', { date: film_date })} ${description}`}
              </Header.Subheader>
            }
            {
              subText2 && (
                <Header.Subheader className="section-header__subtitle2">
                  {subText2}
                </Header.Subheader>
              )
            }
          </Header.Content>
        </Header>
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
                <LibraryBar />
              </div>
              <div className="library-language-container">
                <MenuLanguageSelector
                  languages={languages}
                  selected={selectedLanguage}
                  onLanguageChange={handleLanguageChanged}
                  multiSelect={false}
                />
              </div>
            </div>
          </Grid.Column>
        </Grid>
      </div>
      <div className={`source__content-wrapper font_settings-wrapper size${fontSize}`}>
        <div className="font_settings doc2html" style={{ direction }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ArticleLayout;
