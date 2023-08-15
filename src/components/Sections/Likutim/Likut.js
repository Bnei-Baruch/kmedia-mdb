import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { Grid, Header, Image } from 'semantic-ui-react';
import clsx from 'clsx';

import { actions as assetsActions, selectors as assetsSelectors } from '../../../redux/modules/assets';
import { selectors as siteSettings } from '../../../redux/modules/settings';
import { actions, selectors, selectors as mdb } from '../../../redux/modules/mdb';
import { getLangPropertyDirection, getLanguageDirection } from '../../../helpers/i18n-utils';
import { physicalFile, strCmp } from '../../../helpers/utils';
import { SectionLogo } from '../../../helpers/images';
import { canonicalLink } from '../../../helpers/links';
import { LANG_ENGLISH, LANG_HEBREW, UNIT_LESSONS_TYPE, MT_AUDIO, MT_TEXT } from '../../../helpers/consts';
import LibraryBar from '../Library/LibraryBar';
import MenuLanguageSelector from '../../../components/Language/Selector/MenuLanguageSelector';
import Link from '../../../components/Language/MultiLanguageLink';
import WipErr from '../../shared/WipErr/WipErr';
import Download from '../../shared/Download/Download';
import ScrollToSearch from '../../shared/DocToolbar/ScrollToSearch';
import TagsByUnit from '../../shared/TagsByUnit';
import LikutAudioPlayer from './LikutAudioPlayer';
import Helmets from '../../shared/Helmets';

const DEFAULT_LANGUAGES      = [LANG_ENGLISH, LANG_HEBREW];
export const selectLikutFile = (files, language, idx = 0) => {
  if (!files) return null;

  let file = files.find(x => x.language === language && x.type === MT_TEXT);
  if (file) return file;
  if (idx >= DEFAULT_LANGUAGES.length) {
    file = files.find(x => x.type === MT_TEXT);
    return file;
  }
  return selectLikutFile(files, DEFAULT_LANGUAGES[idx], idx++);
};
// expected unit of type Likutim
const Likut                  = () => {
  const { id } = useParams();
  const { t }  = useTranslation();

  const location        = useLocation();
  const unit            = useSelector(state => selectors.getDenormContentUnit(state.mdb, id));
  const fetched         = useSelector(state => mdb.getFullUnitFetched(state.mdb)[id]);
  const wip             = useSelector(state => selectors.getWip(state.mdb).units[id]);
  const err             = useSelector(state => selectors.getErrors(state.mdb).units[id]);
  const contentLanguage = useSelector(state => siteSettings.getContentLanguage(state.settings, location));
  const doc2htmlById    = useSelector(state => assetsSelectors.getDoc2htmlById(state.assets));

  const [isReadable, setIsReadable]               = useState(false);
  const [settings, setSettings]                   = useState(null);
  const [language, setLanguage]                   = useState(contentLanguage);
  const [scrollTopPosition, setScrollTopPosition] = useState(0);
  const [scrollingElement, setScrollingElement]   = useState(null);
  const articleRef                                = useRef();

  useEffect(() => {
    const scrollingElement = isReadable ? articleRef.current : document.scrollingElement;
    setScrollingElement(scrollingElement);

    if (articleRef) {
      scrollingElement.scrollTop = scrollTopPosition;
    }
  }, [isReadable, scrollTopPosition]);

  const handleIsReadable = () => {
    setScrollTopPosition(scrollingElement?.scrollTop || 0);
    setIsReadable(!isReadable);
  };

  const handleLanguageChanged = (e, lang) => setLanguage(lang);

  const dispatch = useDispatch();

  useEffect(() => {
    (!fetched) && dispatch(actions.fetchUnit(id));
  }, [dispatch, id, fetched]);

  const file      = selectLikutFile(unit?.files, language);
  const lang      = file?.language || language;
  const needFetch = !doc2htmlById[file?.id];
  useEffect(() => {
    if (file?.id && needFetch) {
      dispatch(assetsActions.doc2html(file.id));
    }
  }, [dispatch, file?.id, needFetch]);

  if (!unit) {
    return null;
  }

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) {
    return wipErr;
  }

  const { data } = doc2htmlById[file?.id] || {};

  const { theme = 'light', fontType, fontSize = 0 } = settings || {};

  const direction     = getLanguageDirection(lang);
  const gridDirection = getLangPropertyDirection(lang);

  const { name, film_date, files = [], source_units } = unit;
  const languages                                     = files.map(f => f.language);

  const url                = file && physicalFile(file, true);
  const relatedLessons     = Object.values(source_units).filter(u => UNIT_LESSONS_TYPE.includes(u.content_type));
  const relatedLessonsSize = relatedLessons.length > 0 ? 6 : 0;
  const bookmarkSource     = { subject_uid: unit.id, subject_type: unit.content_type, language: lang };
  const labelSource        = { content_unit: unit.id, language: lang };

  let mp3File = files.find(f => f.language === lang && f.type === MT_AUDIO);
  const title = `${t('likutim.item-header')} ${name}`;

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
              <Helmets.Basic title={title} />
              <Header.Content>
                {title}
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
                      languages={languages}
                      defaultValue={lang}
                      onSelect={handleLanguageChanged}
                      fluid={false}
                    />
                  </div>
                </div>
              </Grid.Column>
            </Grid>
          </div>
          <div className="likut__audio">
            <LikutAudioPlayer mp3={mp3File} id={id} lang={lang} />
          </div>

          {/* content */}
          <div
            className={`source__content-wrapper font_settings-wrapper size${fontSize}`}
          >
            <div
              className="font_settings doc2html"
              style={{ direction }}
            >
              {
                data && (
                  <ScrollToSearch
                    language={lang}
                    data={data}
                    source={bookmarkSource}
                    label={labelSource}
                  />
                )
              }
            </div>
          </div>
        </Grid.Column>
        {relatedLessonsSize > 0 &&
          <Grid.Column mobile={16} tablet={relatedLessonsSize} computer={relatedLessonsSize}>
            {/* links to other pages */}
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
                        <Link to={canonicalLink(u)}>{t('values.date', { date: u.film_date })}</Link>
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

export default Likut;
