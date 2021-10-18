import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { Button, Grid, Header, Image } from 'semantic-ui-react';
import clsx from 'clsx';

import { selectors as assetsSelectors, actions as assetsActions } from '../../../redux/modules/assets';
import { selectors as siteSettings } from '../../../redux/modules/settings';
import { selectors as tagSelectors } from '../../../redux/modules/tags';
import { actions, selectors } from '../../../redux/modules/mdb';
import { getLanguageDirection, getLangPropertyDirection } from '../../../helpers/i18n-utils';
import { physicalFile } from '../../../helpers/utils';
import { SectionLogo } from '../../../helpers/images';
import { canonicalLink } from '../../../helpers/links';
import { LANG_ENGLISH, LANG_HEBREW, UNIT_LESSONS_TYPE } from '../../../helpers/consts';
import LibraryBar from '../Library/LibraryBar';
import MenuLanguageSelector from '../../../components/Language/Selector/MenuLanguageSelector';
import Link from '../../../components/Language/MultiLanguageLink';
import WipErr from '../../shared/WipErr/WipErr';
import Download from '../../shared/Download/Download';
import ScrollToSearch from '../../shared/ScrollToSearch';

// expected unit of type Likutim
const Likut = ({ t }) => {
  const { id } = useParams();

  const location        = useLocation();
  const unit            = useSelector(state => selectors.getDenormContentUnit(state.mdb, id));
  const wip             = useSelector(state => selectors.getWip(state.mdb).units[id]);
  const err             = useSelector(state => selectors.getErrors(state.mdb).units[id]);
  const getTagById      = useSelector(state => tagSelectors.getTagById(state.tags));
  const contentLanguage = useSelector(state => siteSettings.getContentLanguage(state.settings, location));
  const doc2htmlById    = useSelector(state => assetsSelectors.getDoc2htmlById(state.assets));

  const [isReadable, setIsReadable]               = useState(false);
  const [settings, setSettings]                   = useState(null);
  const [file, setFile]                           = useState(null);
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
    dispatch(actions.fetchUnit(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (unit) {
      let f = unit.files?.find(x => x.language === language);

      if (!f && language !== LANG_ENGLISH && !file) {
        f = unit.files?.find(x => x.language === LANG_ENGLISH);
        setLanguage(LANG_ENGLISH);
      }

      if (!f && language !== LANG_HEBREW) {
        f = unit.files?.find(x => x.language === LANG_HEBREW);
        setLanguage(LANG_HEBREW);
      }

      if (f) {
        setFile(f);
      }
    }
  }, [dispatch, language, unit]);

  useEffect(() => {
    if (file) {
      dispatch(assetsActions.doc2html(file.id));
    }
  }, [dispatch, file]);

  if (!unit) {
    return null;
  }

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) {
    return wipErr;
  }

  const { data } = doc2htmlById[file?.id] || {};

  const { theme = 'light', fontType, fontSize = 0 } = settings || {};
  const direction                                   = getLanguageDirection(language);
  const gridDirection                               = getLangPropertyDirection(language);

  const { name, film_date, files = [], tags = [], source_units } = unit;
  const languages                                                = files.map(f => f.language);
  const tagNames                                                 = tags.map(getTagById);

  const renderTags = () => (
    tagNames.length > 0 &&
    <div>
      {
        tagNames.map((tag, index) =>
          <Button key={`${tag.id}${index}`} basic compact size='small'>
            <Link to={`/topics/${tag.id}`}>{tag.label}</Link>
          </Button>
        )
      }
    </div>
  );

  const url                = file && physicalFile(file, true);
  const relatedLessons     = Object.values(source_units).filter(u => UNIT_LESSONS_TYPE.includes(u.content_type));
  const relatedLessonsSize = relatedLessons.length > 0 ? 6 : 0;

  return (
    <div
      ref={articleRef}
      className={clsx({
        source: true,
        'is-readable': isReadable,
        [`is-${theme}`]: true,
        [`is-${fontType}`]: true,
        [`size${fontSize}`]: true,
      })}>
      <Grid padded>
        <Grid.Column mobile={16} tablet={16 - relatedLessonsSize} computer={16 - relatedLessonsSize}>
          <div className="section-header likut">
            <Header as='h2' className="topics__title-font">
              <Header.Content>
                {`${t('likutim.item-header')} ${name}`}
                <Header.Subheader>{t('values.date', { date: film_date })}</Header.Subheader>
              </Header.Content>
            </Header>
            {/* toolbar */}
            <Grid className="likut__toolbar" columns={2}>
              <Grid.Column>
                {renderTags()}
              </Grid.Column>
              <Grid.Column>
                <div className="source__header-toolbar">
                  <div className="display-iblock margin-right-8 margin-left-8">
                    {
                      file &&
                      <Download path={url} mimeType={file.mimetype} downloadAllowed={true} filename={file.name} />
                    }
                    <LibraryBar
                      fontSize={fontSize}
                      isReadable={isReadable}
                      handleIsReadable={handleIsReadable}
                      handleSettings={setSettings}
                    />
                  </div>
                  <div className="library-language-container">
                    <MenuLanguageSelector
                      languages={languages}
                      defaultValue={language}
                      onSelect={handleLanguageChanged}
                      fluid={false}
                    />
                  </div>
                </div>
              </Grid.Column>
            </Grid>
          </div>
          {/* content */}
          <div
            className={`source__content-wrapper font_settings-wrapper size${fontSize}`}
          >
            <div
              className="font_settings doc2html"
              style={{ direction }}
            >
              <ScrollToSearch language={language} data={data} />
            </div>
          </div>
        </Grid.Column>
        {relatedLessonsSize > 0 &&
        <Grid.Column mobile={16} tablet={relatedLessonsSize} computer={relatedLessonsSize}>
          {/* links to other pages */}
          <Grid padded relaxed='very' className="section-header likut__grid" stackable>
            <Grid.Row>
              <Header icon textAlign={gridDirection} as='h3'>
                <Image size="big" verticalAlign="middle">
                  <SectionLogo name='lessons' />
                </Image>
                {`${t(`search.intent-prefix.lessons-topic`)}  ${name}`}
              </Header>
            </Grid.Row>
            <Grid.Row columns={3}>
              {
                relatedLessons
                  .sort((u1, u2) => u1.film_date <= u2.film_date ? 1 : -1)
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

Likut.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(Likut);
