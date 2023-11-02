import React, { useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { Grid, Header, Image } from 'semantic-ui-react';
import clsx from 'clsx';
import { selectors as siteSettings } from '../../../../lib/redux/slices/settingsSlice/settingsSlice';
import { selectors } from '../../../../lib/redux/slices/mdbSlice';
import { getLangPropertyDirection, getLanguageDirection } from '../../../../src/helpers/i18n-utils';
import { physicalFile, strCmp } from '../../../../src/helpers/utils';
import { SectionLogo } from '../../../../src/helpers/images';
import { canonicalLink } from '../../../../src/helpers/links';
import { UNIT_LESSONS_TYPE, MT_AUDIO } from '../../../../src/helpers/consts';
import LibraryBar from '../../../../src/components/Sections/Library/LibraryBar';
import MenuLanguageSelector from '../../../../src/components/Language/Selector/MenuLanguageSelector';
import Download from '../../../../src/components/shared/Download/Download';
import TagsByUnit from '../../../../src/components/shared/TagsByUnit';
import LikutAudioPlayer from '../../../../src/components/Sections/Likutim/LikutAudioPlayer';
import { selectors as textFile } from '../../../../lib/redux/slices/textFileSlice/textFileSlice';
import Link from 'next/link';

const LikutLayout = ({ fileId, children }) => {
  const { t } = useTranslation();

  const { id, language }              = useSelector(state => textFile.getSubjectInfo(state.textFile));
  const { theme, fontType, fontSize } = useSelector(state => textFile.getSettings(state.textFile));
  const isReadable                    = useSelector(state => textFile.getIsReadable(state.textFile));
  const unit                          = useSelector(state => selectors.getDenormContentUnit(state.mdb, id));
  const uiLang                        = useSelector(state => siteSettings.getUILang(state.settings));

  const likutimLanguages                        = unit.files.map(f => f.language);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const articleRef                              = useRef();
  /*
    const [scrollTopPosition, setScrollTopPosition] = useState(0);
    const [scrollingElement, setScrollingElement]   = useState(null);
    useEffect(() => {
      const _scrollingElement = isReadable ? articleRef.current : document.scrollingElement;
      if (articleRef) {
        _scrollingElement.scrollTop = scrollTopPosition;
      }
    }, [isReadable, scrollTopPosition]);*/

  const handleLanguageChanged = (selectedLanguage) => setSelectedLanguage(selectedLanguage);

  const file = unit.files.find(f => f.id === fileId);

  const direction     = getLanguageDirection(uiLang);
  const gridDirection = getLangPropertyDirection(uiLang);

  const { name, film_date, files = [], source_units } = unit;

  const url                = file && physicalFile(file, true);
  const relatedLessons     = Object.values(source_units).filter(u => UNIT_LESSONS_TYPE.includes(u.content_type));
  const relatedLessonsSize = relatedLessons.length > 0 ? 6 : 0;

  const mp3File = files.find(f => f.language === selectedLanguage && f.type === MT_AUDIO);

  return (
    <div
      ref={articleRef}
      className={clsx('source likutim', {
        'is-readable': isReadable,
        [`is-${theme}`]: true,
        [`is-${fontType}`]: true,
        [`size${fontSize}`]: true,
      })}>
      <Grid padded>
        <Grid.Column mobile={16} tablet={16 - relatedLessonsSize} computer={16 - relatedLessonsSize}>
          <div className="section-header likut">
            <Header as="h2" className="topics__title-font">
              <Header.Content>
                {`${t('likutim.item-header')} ${name}`}
                <Header.Subheader>{t('values.date', { date: film_date })}</Header.Subheader>
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
            <LikutAudioPlayer file={mp3File} />
          </div>
          <div
            className={`source__content-wrapper font_settings-wrapper size${fontSize}`}
          >
            <div
              className="font_settings doc2html"
              style={{ direction }}
            >
              {children}
            </div>
          </div>
        </Grid.Column>
        {
          relatedLessonsSize > 0 &&
          <Grid.Column mobile={16} tablet={relatedLessonsSize} computer={relatedLessonsSize}>
            links to other pages
            <Grid padded relaxed="very" className="section-header likut__grid" stackable>
              <Grid.Row>
                <Header icon textAlign={gridDirection} as="h3">
                  <Image size="big" verticalAlign="middle">
                    <SectionLogo name="lessons" />
                  </Image>
                  {`${t(`search.intent-prefix.lessons-topic`)}  ${name}`}
                </Header>
              </Grid.Row>
              <Grid.Row columns={3}>
                {
                  // sort by film date desc
                  relatedLessons
                    .sort((u1, u2) => strCmp(u2.film_date, u1.film_date))
                    .map(u =>
                      <Grid.Column key={u.id}>
                        <Link href={canonicalLink(u)}>{t('values.date', { date: u.film_date })}</Link>
                      </Grid.Column>)
                }
              </Grid.Row>
            </Grid>
          </Grid.Column>
        }
      </Grid>
    </div>
  );
};

export default LikutLayout;
