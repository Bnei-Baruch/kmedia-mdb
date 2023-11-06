import React from 'react';
import { withTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { Card } from 'semantic-ui-react';
import { canonicalLink } from '../../../helpers/links';
import { selectors as mdb } from '../../../../lib/redux/slices/mdbSlice/mdbSlice';
import { selectors as assets } from '../../../../lib/redux/slices/assetSlice/assetSlice';
import MediaHelper from '../../../helpers/media';
import { isEmpty } from '../../../helpers/utils';
import Link from '../../Language/MultiLanguageLink';
import { buildTextItemInfo } from '../../../../app/components/ContentItem/helper';
import { selectors as sources } from '../../../../lib/redux/slices/sourcesSlice/sourcesSlice';
import { selectors as settings } from '../../../../lib/redux/slices/settingsSlice/settingsSlice';
import GalleryModal from './ZipFileModal';
import ImageFileModal from './ImageFileModal';
import { isZipFile } from '../../Pages/WithPlayer/widgets/UnitMaterials/helper';
import { stringify } from '../../../helpers/url';

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

const UnitItem = ({ id, t }) => {
  const cu               = useSelector(state => mdb.getDenormContentUnit(state.mdb, id));
  const getZipById       = useSelector(state => assets.nestedGetZipById(state.assets));
  const getPathByID      = useSelector(state => sources.getPathByID(state.sources));
  const uiDir            = useSelector(state => settings.getUIDir(state.settings));
  const contentLanguages = useSelector(state => settings.getContentLanguages(state.settings));

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
          <Card key={f.id}>
            <ImageFileModal file={f} />
            <Card.Content>
              <Card.Description as={Link} to={to} content={cu.name} />
            </Card.Content>
            <Card.Meta className={`cu_info_description ${uiDir}`}>
              {[title, ...description].map((d, i) => (<span key={i}>{d}</span>))}
            </Card.Meta>
          </Card>
        ))
      }
      {
        uniq?.map(path => (
          <Card key={path}>
            <GalleryModal id={zip.id} path={path} />
            <Card.Content>
              <Card.Description as={Link} to={to} content={cu.name} />
            </Card.Content>

            <Card.Meta className={`cu_info_description ${uiDir}`}>
              {[title, ...description].map((d, i) => (<span key={i}>{d}</span>))}
            </Card.Meta>
          </Card>
        ))
      }
    </>
  );
};

export default withTranslation()(UnitItem);
