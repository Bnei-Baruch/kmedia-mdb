import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Header, List } from 'semantic-ui-react';

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
    <List.Item as={Link} to={canonicalLink(c)} key={id} className="media_item">
      <UnitLogoWithDuration unit={cus[0]} />
      <div className="media_item__content">
        <Header content={name} />
        <div className="description">{getDate()}</div>
      </div>
    </List.Item>
  );
};

export default CollectionItem;
