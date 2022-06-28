import clsx from 'clsx';
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

  const { film_date, name, content_type, content_units: cus, start_date, end_date } = c;

  const description = [];
  if (film_date) {
    description.push(t('values.date', { date: film_date }));
  } else if (start_date && end_date) {
    description.push(fromToLocalized(start_date, end_date));
  }

  return (
    <List.Item key={id} className="media_item">
      <UnitLogoWithDuration duration={cus[0].duration} unitId={cus[0].id} width={144} />
      <div className="media_item__content">
        <Header as={Link} to={canonicalLink(c)} content={name} />
        <div>{t(`constants.content-types.${content_type}`)}</div>
        <div className={clsx('description', { 'is_single': !(description?.length > 1) })}>
          {description.map((d, i) => (<span key={i}>{d}</span>))}
        </div>
      </div>
    </List.Item>
  );
};

export default withNamespaces()(CollectionItem);
