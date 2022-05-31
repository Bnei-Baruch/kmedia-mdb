import React from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Container, Header, List } from 'semantic-ui-react';
import { fromToLocalized } from '../../../helpers/date';
import { canonicalLink } from '../../../helpers/links';
import { canonicalCollection } from '../../../helpers/utils';

import { selectors as mdb } from '../../../redux/modules/mdb';
import Link from '../../Language/MultiLanguageLink';
import UnitLogo from '../../shared/Logo/UnitLogo';

const CollectionItem = ({ id, t }) => {
  const c = useSelector(state => mdb.getDenormCollection(state.mdb, id));

  const { film_date, name, content_type, content_units: cus, start_date, end_date } = c;

  const description = [];
  if (film_date) {
    description.push(t('values.date', { date: film_date }));
  } else if (start_date && end_date) {
    description.push(fromToLocalized(start_date, end_date));
  }

  return (<List.Item key={id} className="media_item">
    <div style={{ minWidth: '140px' }}>
      <UnitLogo unitId={cus[0].id} width={144} />
    </div>
    <div className="media_item__content">
      <Link to={canonicalLink(c)}>
        {name}
        <span className="display-iblock margin-left-8 margin-right-8">{t('values.date', { date: film_date })}</span>
      </Link>
      <div>{t(`constants.content-types.${content_type}`)}</div>
      <div className="description">
        {description.map((d, i) => (<span key={i}>{d}</span>))}
      </div>
    </div>
  </List.Item>);
};

export default withNamespaces()(CollectionItem);
