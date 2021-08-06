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
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import { DeviceInfoContext } from '../../../helpers/app-contexts';

// import { isEmpty } from '../../../helpers/utils';

// import { MT_TEXT, CT_LIKUTIM } from '../../../helpers/consts';
import LibraryBar from '../Library/LibraryBar';
import DropdownLanguageSelector from '../../../components/Language/Selector/DropdownLanguageSelector';
import Link from '../../../components/Language/MultiLanguageLink';

// import { getLikutimFiles, isValidLikut } from '../../Pages/Unit/widgets/UnitMaterials/Sources/Sources';
import WipErr from '../../shared/WipErr/WipErr';


// expected unit of type Likutim
const Likut = ({ t }) => {
  let { id } = useParams();

  // TEMP - to remove!!!
  if (!id) {
    id = 'nM9pMrxD' // 'gfVMsqC2'
  }

  console.log('id:', id);

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const unit = useSelector(state => selectors.getDenormContentUnit(state.mdb, id));
  const wip = useSelector(state => selectors.getWip(state.mdb).units[id]);
  const err = useSelector(state => selectors.getErrors(state.mdb).units[id]);
  const getTagById = useSelector(state => tagSelectors.getTagById(state.tags));

  console.log(' unit:', unit);

  const contentLanguage = useSelector(state => siteSettings.getContentLanguage(state.settings));
  const doc2htmlById    = useSelector(state => assetsSelectors.getDoc2htmlById(state.assets));

  const [isReadable, setIsReadable] = useState(false);
  const [settings, setSettings] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [language, setLanguage] = useState(contentLanguage);

  const articleRef = useRef();
  const [scrollTopPosition, setScrollTopPosition] = useState(0);

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
    if (!wip && !err && !unit)  {
      dispatch(actions.fetchUnit(id));
    } else if (unit) {
      const file = unit?.files?.find(x => x.language === language);
      if (file?.id) {
        setFileId(file.id);
      }
    }
  }, [dispatch, err, id, language, unit, wip]);


  useEffect(() => {
    console.log('dispatch file:', fileId)
    dispatch(assetsActions.doc2html(fileId))
  }, [dispatch, fileId]);

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) {
    return wipErr;
  }

  if (!unit) {
    return null;
  }

  const { data } = doc2htmlById[fileId] || {};

  const { theme = 'light', fontType, fontSize = 0 } = settings || {};
  const direction = getLanguageDirection(language);

  const { name, film_date, files, tags } = unit;
  const languages = files.length > 0 ? files.map(f => f.language) : []
  const tagNames = tags.map(getTagById);

  console.log('tagNames:', tagNames);

  const renderTags = () => (
    <ButtonGroup size='mini' compact basic>
      {
        tagNames.map(tag =>
          <Button key={tag.id}>
            <Link to={`/topics/${tag.id}`}>
              {tag.label}
            </Link>
          </Button>)
      }
    </ButtonGroup>
  )

  return (
    <div
      ref={articleRef}
      style={{ direction }}
      className={clsx({
        source: true,
        'is-readable': isReadable,
        [`is-${theme}`]: true,
        [`is-${fontType}`]: true,
        [`size${fontSize}`]: true,
      })}>
      <Grid padded>
        <Grid.Column mobile={16} tablet={12} computer={12}>
          <div className="section-header">
            <Header size='large'>
              <Header.Content>
                {name}
                <Header.Subheader><b>{t('values.date', { date: film_date })}</b></Header.Subheader>
              </Header.Content>
            </Header>
            <Grid padded>
              <Grid.Row columns={2}>
                <Grid.Column>
                  {renderTags()}
                </Grid.Column>
                <Grid.Column>
                  <div className="source__header-toolbar">
                    <LibraryBar fontSize={fontSize} isReadable={isReadable} handleIsReadable={handleIsReadable} handleSettings={setSettings} />
                    <DropdownLanguageSelector
                      languages={languages}
                      defaultValue={language}
                      onSelect={handleLanguageChanged}
                      fluid={isMobileDevice}
                    />
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
          <div className={clsx({
            'source__content-wrapper': true,
            [`size${fontSize}`]: true,
            // "doc2html": true
          })}>
            <div className="source__content"
              style={{ direction }}
              dangerouslySetInnerHTML={{ __html: data }}
            />
          </div>
        </Grid.Column>
        {/* <Grid.Column mobile={16} tablet={4} computer={4}>
          {/* links to other pages */}
        {/* </Grid.Column> */}
      </Grid>
    </div>
  )
}

Likut.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(Likut);
