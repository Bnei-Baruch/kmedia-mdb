import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { canonicalLink } from '../../../helpers/links';
import MediaHelper from '../../../helpers/media';
import { isEmpty } from '../../../helpers/utils';
import Link from '../../Language/MultiLanguageLink';
import { buildTextItemInfo } from '../../shared/ContentItem/helper';
import GalleryModal from './ZipFileModal';
import ImageFileModal from './ImageFileModal';
import { isZipFile } from '../../Pages/WithPlayer/widgets/UnitMaterials/Sketches/helper';
import { stringify } from '../../../helpers/url';
import {
  settingsGetContentLanguagesSelector,
  mdbGetDenormContentUnitSelector,
  sourcesGetPathByIDSelector,
  settingsGetUIDirSelector,
  assetsNestedGetZipByIdSelector
} from '../../../redux/selectors';

const findZipFile = (cu, contentLanguages) => {
  const zips = cu.files
    .filter(x => MediaHelper.IsImage(x) && isZipFile(x));

  let files = [];
  if (contentLanguages.includes(cu.original_language)) {
    files = zips.filter(file => file.language === cu.original_language);
  } else {
    files = zips.filter(file => contentLanguages.includes(file.language));
  }

  return files[0] || zips[0];
};

const UnitItem = ({ id }) => {
  const { t } = useTranslation();
  const cu               = useSelector(state => mdbGetDenormContentUnitSelector(state, id));
  const getZipById       = useSelector(assetsNestedGetZipByIdSelector);
  const getPathByID      = useSelector(sourcesGetPathByIDSelector);
  const uiDir            = useSelector(settingsGetUIDirSelector);
  const contentLanguages = useSelector(settingsGetContentLanguagesSelector);

  if (!cu) return null;

  const imgs = cu.files.filter(x => MediaHelper.IsImage(x) && !isZipFile(x));
  const zip  = findZipFile(cu, contentLanguages);
  const uniq = zip ? getZipById(zip.id)?.data?.uniq.map(x => x.path) : [];

  if (isEmpty(uniq) && isEmpty(imgs)) return null;

  const { title, description } = buildTextItemInfo(cu, null, t, getPathByID, false);

  const to  = canonicalLink(cu);
  to.search = [to.search, stringify({ activeTab: 'sketches' })].filter(x => !!x).join('&');
  return (
    <>
      {
        imgs?.map(f => (
          <div key={f.id} className="rounded shadow border overflow-hidden">
            <ImageFileModal file={f}/>
            <div className="p-4">
              <Link to={to} className="font-semibold">{cu.name}</Link>
            </div>
            <div className={`cu_info_description ${uiDir} px-4 pb-4 small text-gray-500`}>
              {[title, ...description].map((d, i) => (<span key={i}>{d}</span>))}
            </div>
          </div>
        ))
      }
      {
        uniq?.map(path => (
          <div key={path} className="rounded shadow border overflow-hidden">
            <GalleryModal id={zip.id} path={path}/>
            <div className="p-4">
              <Link to={to} className="font-semibold">{cu.name}</Link>
            </div>
            <div className={`cu_info_description ${uiDir} px-4 pb-4 small text-gray-500`}>
              {[title, ...description].map((d, i) => (<span key={i}>{d}</span>))}
            </div>
          </div>
        ))
      }
    </>
  );
};

export default UnitItem;
