import React from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Card } from 'semantic-ui-react';
import { canonicalLink } from '../../../helpers/links';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as assets } from '../../../redux/modules/assets';
import MediaHelper from '../../../helpers/media';
import { isEmpty } from '../../../helpers/utils';
import Link from '../../Language/MultiLanguageLink';
import { buildTextItemInfo } from '../../shared/ContentItem/helper';
import { selectors as sources } from '../../../redux/modules/sources';
import { isLanguageRtl } from '../../../helpers/i18n-utils';
import { selectors as settings } from '../../../redux/modules/settings';
import GalleryModal from './ZipFileModal';
import ImageFileModal from './ImageFileModal';
import { isZipFile } from '../../Pages/WithPlayer/widgets/UnitMaterials/helper';

const findZipFile = (cu, language) => {
  const zips = cu.files
    .filter(x => MediaHelper.IsImage(x) && isZipFile(x));
  // try filter by language
  let files  = zips.filter(file => file.language === language);

  // if no files by language - return original language files
  if (files.length === 0) {
    files = zips.filter(f => f.language === cu.original_language);
  }

  return files[0] || zips[0];
};

const UnitItem = ({ id, t }) => {
  const cu          = useSelector(state => mdb.getDenormContentUnit(state.mdb, id));
  const getZipById  = useSelector(state => assets.nestedGetZipById(state.assets));
  const getPathByID = useSelector(state => sources.getPathByID(state.sources));
  const language    = useSelector(state => settings.getLanguage(state.settings));

  if (!cu) return null;

  const dir = isLanguageRtl(language) ? 'rtl' : 'ltr';

  const imgs = cu.files.filter(x => MediaHelper.IsImage(x) && !isZipFile(x));
  const zip  = findZipFile(cu, language);
  const uniq = zip ? getZipById(zip.id)?.data?.uniq.map(x => x.path) : [];

  if (isEmpty(uniq) && isEmpty(imgs)) return null;

  const { title, description } = buildTextItemInfo(cu, null, t, getPathByID, false);
  const to                     = `${canonicalLink(cu)}?activeTab=sketches`;

  return (
    <>
      {
        imgs?.map(f => (
          <Card>
            <ImageFileModal file={f} />
            <Card.Content>
              <Card.Description as={Link} to={to} content={cu.name} />
            </Card.Content>
            <Card.Meta className={`cu_info_description ${dir}`}>
              {[title, ...description].map((d, i) => (<span key={i}>{d}</span>))}
            </Card.Meta>
          </Card>
        ))
      }
      {
        uniq?.map(path => (
          <Card>
            <GalleryModal id={zip.id} path={path} />
            <Card.Content>
              <Card.Description as={Link} to={to} content={cu.name} />
            </Card.Content>

            <Card.Meta className={`cu_info_description ${dir}`}>
              {[title, ...description].map((d, i) => (<span key={i}>{d}</span>))}
            </Card.Meta>
          </Card>
        ))
      }
    </>
  );
};

export default withNamespaces()(UnitItem);
