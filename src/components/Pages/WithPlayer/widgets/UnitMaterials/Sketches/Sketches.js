import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { selectSuitableLanguage } from '../../../../../../helpers/language';
import MediaHelper from '../../../../../../helpers/media';
import { isEmpty, strCmp } from '../../../../../../helpers/utils';
import { actions } from '../../../../../../redux/modules/assets';
import { assetsNestedGetZipByIdSelector, settingsGetContentLanguagesSelector } from '../../../../../../redux/selectors';
import MenuLanguageSelector from '../../../../../Language/Selector/MenuLanguageSelector';
import NotFound from '../../../../../shared/NotFound';
import WipErr from '../../../../../shared/WipErr/WipErr';
import SketchesGallery from './SketchesGallery';
import { imageGalleryItem, isZipFile } from './helper';

const findFiles = (files = [], language) => {
  const _files = files
    .filter(MediaHelper.IsImage)
    .filter(f => f.language === language);

  const zipId = _files.find(isZipFile)?.id;
  const imgs  = _files.filter(f => !isZipFile(f));
  return { zipId, imgs };
};

const Sketches = ({ unit }) => {
  const dispatch = useDispatch();
  const { t }    = useTranslation();

  const imgFiles                = unit.files.filter(f => f.type === 'image');
  const contentLanguages        = useSelector(settingsGetContentLanguagesSelector);
  const languages               = imgFiles.map(file => file.language);
  const _language               = selectSuitableLanguage(contentLanguages, languages, unit.original_language, languages[0]);
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

  const items = (
    zipId ?
      data?.full.filter(x => !x.path?.toUpperCase().includes('MACOSX')) || []
      : imgs
  ).map(imageGalleryItem).sort((a, b) => strCmp(a.original, b.original));

  return (
    <>
      {
        languages.length > 1 && (
          <div className="w-full text-right ">
            <MenuLanguageSelector
              languages={languages}
              selected={language}
              onLanguageChange={handleLanguageChanged}
              multiSelect={false}
            />
          </div>
        )
      }
      {
        isEmpty(items) ? <NotFound textKey="messages.no-images" /> : <SketchesGallery items={items} />
      }
    </>
  );
};

export default Sketches;
