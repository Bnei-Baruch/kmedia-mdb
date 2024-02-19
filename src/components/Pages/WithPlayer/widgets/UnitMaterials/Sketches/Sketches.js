import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

import { selectSuitableLanguage } from '../../../../../../helpers/language';
import { strCmp, isEmpty } from '../../../../../../helpers/utils';
import { actions } from '../../../../../../redux/modules/assets';
import WipErr from '../../../../../shared/WipErr/WipErr';
import MenuLanguageSelector from '../../../../../Language/Selector/MenuLanguageSelector';
import { imageGalleryItem, isZipFile } from './helper';
import { settingsGetContentLanguagesSelector, assetsNestedGetZipByIdSelector } from '../../../../../../redux/selectors';
import SketchesGallery from './SketchesGallery';
import NotFound from '../../../../../shared/NotFound';

const findFiles = (files = [], language) => {
  const _files = files.filter(f => f.language === language);

  const zipId = _files.find(isZipFile)?.id;
  const imgs  = _files.find(f => !isZipFile(f));
  return { zipId, imgs };
};

const Sketches = ({ unit }) => {
  const dispatch = useDispatch();
  const { t }    = useTranslation();

  const imgFiles                = unit.files.filter(f => f.type === 'image');
  const contentLanguages        = useSelector(settingsGetContentLanguagesSelector);
  const languages               = imgFiles.map(file => file.language);
  const _language               = selectSuitableLanguage(contentLanguages, languages, unit.original_language);
  const [language, setLanguage] = useState(_language || '');
  const { zipId, imgs }         = findFiles(unit.files, language);
  const { wip, err, data }      = useSelector(assetsNestedGetZipByIdSelector)(zipId) || {};

  const _needFetch = !wip && !err && !data;
  useEffect(() => {
    if (zipId && _needFetch) {
      dispatch(actions.unzipList([zipId]));
    }
  }, [zipId, _needFetch, dispatch]);

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) return wipErr;

  const handleLanguageChanged = l => setLanguage(l);

  // prepare the image array for the gallery and sort it
  const items = (
    zipId ?
      data?.full.filter(x => !x.path?.toUpperCase().includes('MACOSX')) || []
      : imgs
  ).map(imageGalleryItem).sort((a, b) => strCmp(a.original, b.original));

  return (
    <>
      {
        languages.length > 1 && (
          <Container fluid textAlign="right" className="padded">
            <MenuLanguageSelector
              languages={languages}
              selected={language}
              onLanguageChange={handleLanguageChanged}
              multiSelect={false}
            />
          </Container>
        )
      }
      {
        isEmpty(items) ? <NotFound textKey="messages.no-images" /> : <SketchesGallery items={items} />
      }
    </>
  );
};

export default Sketches;
