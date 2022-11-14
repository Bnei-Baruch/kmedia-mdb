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
import GalleryModal from './GalleryModal';

const UnitItem = ({ id, t }) => {
  const cu          = useSelector(state => mdb.getDenormContentUnit(state.mdb, id));
  const getZipById  = useSelector(state => assets.nestedGetZipById(state.assets));
  const getPathByID = useSelector(state => sources.getPathByID(state.sources));
  const language    = useSelector(state => settings.getLanguage(state.settings));

  if (!cu) return null;

  const dir  = isLanguageRtl(language) ? 'rtl' : 'ltr';
  const uniq = cu.files
    .filter(x => MediaHelper.IsImage(x))
    .flatMap(f => {
        const { data } = getZipById(f.id) || false;
        return data?.uniq.map(() => f.id);
      }
    ).filter(x => !!x);

  if (isEmpty(uniq)) return null;

  const { title, description } = buildTextItemInfo(cu, null, t, getPathByID, false);
  const to                   = `${canonicalLink(cu)}?activeTab=sketches`;

  return (
    <>
      {
        uniq.map((fId, idx) => (
          <Card>
            <GalleryModal id={fId} uniqIdx={idx} />
            <Card.Content>
              <Card.Header as={Link} to={to}>{cu.name}</Card.Header>
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
