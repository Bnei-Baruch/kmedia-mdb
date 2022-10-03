import React from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Header, List } from 'semantic-ui-react';

import { fromToLocalized } from '../../../helpers/date';
import { canonicalLink } from '../../../helpers/links';
import { selectors as mdb } from '../../../redux/modules/mdb';
import Link from '../../Language/MultiLanguageLink';
import UnitLogoWithDuration from '../../shared/UnitLogoWithDuration';

const CollectionItem = ({ id, t }) => {
  const c = useSelector(state => mdb.getDenormCollection(state.mdb, id));
  if (!c) return null;

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

export default withNamespaces()(CollectionItem);
