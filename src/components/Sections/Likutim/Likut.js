import React, { useEffect, useState, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, ButtonGroup, Grid, Header } from 'semantic-ui-react';
import clsx from 'clsx';

import { selectors as assetsSelectors, actions as assetsActions } from '../../../redux/modules/assets';
import { selectors as siteSettings } from '../../../redux/modules/settings';
import { selectors as tagSelectors } from '../../../redux/modules/tags';
import { actions, selectors } from '../../../redux/modules/mdb';
import { getLanguageDirection, getLangPropertyDirection } from '../../../helpers/i18n-utils';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { physicalFile } from '../../../helpers/utils';
import { SectionLogo } from '../../../helpers/images';
import { canonicalLink } from '../../../helpers/links';
import { CT_LESSON_PART } from '../../../helpers/consts';
import LibraryBar from '../Library/LibraryBar';
import DropdownLanguageSelector from '../../../components/Language/Selector/DropdownLanguageSelector';
import Link from '../../../components/Language/MultiLanguageLink';
import WipErr from '../../shared/WipErr/WipErr';
import Download from '../../shared/Download/Download';


// expected unit of type Likutim
const Likut = ({ t }) => {
  const { id }             = useParams();
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const unit            = useSelector(state => selectors.getDenormContentUnit(state.mdb, id));
  const wip             = useSelector(state => selectors.getWip(state.mdb).units[id]);
  const err             = useSelector(state => selectors.getErrors(state.mdb).units[id]);
  const getTagById      = useSelector(state => tagSelectors.getTagById(state.tags));
  const contentLanguage = useSelector(state => siteSettings.getContentLanguage(state.settings));
  const doc2htmlById    = useSelector(state => assetsSelectors.getDoc2htmlById(state.assets));

  const [isReadable, setIsReadable]               = useState(false);
  const [settings, setSettings]                   = useState(null);
  const [file, setFile]                           = useState(null);
  const [language, setLanguage]                   = useState(contentLanguage);
  const [scrollTopPosition, setScrollTopPosition] = useState(0);

  const articleRef = useRef();
  const scrollingElement = isReadable ? articleRef.current : document?.scrollingElement;

  const handleIsReadable = () => {
    setScrollTopPosition(scrollingElement?.scrollTop || 0);
    setIsReadable(!isReadable);
  }

  useEffect(() => {
    if (articleRef) {
      scrollingElement.scrollTop = scrollTopPosition;
    }
  }, [scrollTopPosition, scrollingElement]);

  const handleLanguageChanged = (e, lang) => setLanguage(lang);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!wip && !err && (!unit || !unit.files))  {
      dispatch(actions.fetchUnit(id));
    } else if (unit) {
      const file = unit?.files?.find(x => x.language === language);
      if (file) {
        setFile(file);
      }
    }
  }, [dispatch, err, id, language, unit, wip]);


  useEffect(() => {
    if (file) {
      dispatch(assetsActions.doc2html(file.id))
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
  const direction = getLanguageDirection(language);
  const gridDirection = getLangPropertyDirection(language);

  const { name, film_date, files = [], tags = [], source_units } = unit;
  const languages = files.map(f => f.language)
  const tagNames = tags.map(getTagById);

  const renderTags = () => (
    tagNames.length > 0 &&
      <ButtonGroup size='small' basic floated='left'>
        {
          tagNames.map(tag =>
            <Button key={tag.id} className='likut'>
              <Link to={`/topics/${tag.id}`}>{tag.label}</Link>
            </Button>
          )
        }
      </ButtonGroup>
  )

  const url = file && physicalFile(file, true)

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
        <Grid.Column mobile={16} tablet={10} computer={10}>
          <div className="section-header likut">
            <Header as='h2' >
              <Header.Content>
                {name}
                <Header.Subheader><b>{t('values.date', { date: film_date })}</b></Header.Subheader>
              </Header.Content>
            </Header>
            <div className="likut__toolbar">
              {renderTags()}
              <div className="source__header-toolbar">
                { file && <Download path={url} mimeType={file.mimetype} downloadAllowed={true} filename={file.name} /> }
                <LibraryBar fontSize={fontSize} isReadable={isReadable} handleIsReadable={handleIsReadable} handleSettings={setSettings} />
                <DropdownLanguageSelector
                  languages={languages}
                  defaultValue={language}
                  onSelect={handleLanguageChanged}
                  fluid={isMobileDevice}
                />
              </div>
            </div>
          </div>
          {/* content */}
          <div
            style={{ direction }}
            className={clsx({
              'source__content-wrapper': true,
              [`size${fontSize}`]: true,
            })}>
            <div className="source__content"
              dangerouslySetInnerHTML={{ __html: data }}
            />
          </div>
        </Grid.Column>
        <Grid.Column mobile={16} tablet={6} computer={6}>
          {/* links to other pages */}
          <Grid padded relaxed='very' columns={3} className="section-header" doubling>
            <Header icon textAlign={gridDirection} as='h3' className="display-inline">
              <SectionLogo name='lessons' />
              {`${t(`search.intent-prefix.lessons-topic`)}  ${name}`}
            </Header>
            {
              Object.values(source_units)
                .filter(u => u.content_type === CT_LESSON_PART)
                .sort((u1, u2) => u1.film_date <= u2.film_date ? 1 : -1)
                .map(u =>
                  <Grid.Column>
                    <Link to={canonicalLink(u)}>{t('values.date', { date: u.film_date })}</Link>
                  </Grid.Column>)
            }
          </Grid>
        </Grid.Column>
      </Grid>
    </div>
  )
}

Likut.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(Likut);
