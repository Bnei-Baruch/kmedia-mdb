import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { fromToLocalized } from '../../../helpers/date';
import { canonicalLink } from '../../../helpers/links';
import Link from '../../Language/MultiLanguageLink';
import UnitLogoWithDuration from '../../shared/UnitLogoWithDuration';
import { mdbGetDenormCollectionSelector } from '../../../redux/selectors';

const CollectionItem = ({ id }) => {
  const { t } = useTranslation();
  const c     = useSelector(state => mdbGetDenormCollectionSelector(state, id));
  if (!c?.content_units) return null;

  const { film_date, name, content_units: cus, start_date, end_date } = c;

  const getDate = () => {
    if (film_date)
      return t('values.date', { date: film_date });

    if (start_date && end_date)
      return fromToLocalized(start_date, end_date);
    return null;

  };

  return (
    <div className="media_item">
      <Link to={canonicalLink(c)}>
        <UnitLogoWithDuration unit={cus[0]} />
      </Link>
      <div className="media_item__content">
        <h5 className="font-bold">{name}</h5>
        <div className="description">{getDate()}</div>
      </div>
    </div>
  );
};

export default CollectionItem;
