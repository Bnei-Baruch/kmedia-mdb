import React from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { canonicalLink } from '../../../helpers/links';
import { isEmpty } from '../../../helpers/utils';
import Link from '../../Language/MultiLanguageLink';
import UnitLogoWithDuration from '../../shared/UnitLogoWithDuration';
import { mdbGetDenormContentUnitSelector } from '../../../redux/selectors';

const UnitItem = ({ id, t }) => {
  const cu = useSelector(state => mdbGetDenormContentUnitSelector(state, id));
  if (!cu) return null;

  const link        = canonicalLink(cu);
  const collections = Object.values(cu.collections);

  return (
    <div key={id} className="media_item">
      <Link to={link}>
        <UnitLogoWithDuration unit={cu}/>
      </Link>
      <div className="media_item__content">
        <h5 className="font-bold"><Link to={link}>{cu.name}</Link></h5>
        {
          !isEmpty(collections) && (
            <div className="additional_links">
              {
                collections.map(c => (
                  <Link key={c.id} to={canonicalLink(c)}>
                    {`${t(`constants.content-types.${c.content_type}`)}: ${c.name}`}
                  </Link>
                ))
              }
            </div>
          )
        }
        <div className="description">
          {t('values.date', { date: cu.film_date })}
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(UnitItem);
