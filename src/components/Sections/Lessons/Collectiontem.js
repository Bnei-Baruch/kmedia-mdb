import clsx from 'clsx';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { useSelector, shallowEqual } from 'react-redux';
import { Header, List } from 'semantic-ui-react';

import { CT_LESSONS_SERIES, MY_NAMESPACE_HISTORY } from '../../../helpers/consts';
import { fromToLocalized } from '../../../helpers/date';
import { canonicalLink } from '../../../helpers/links';
import { selectors as mdb } from '../../../../lib/redux/slices/mdbSlice/mdbSlice';
import { selectors as my } from '../../../redux/modules/my';
import Link from '../../Language/MultiLanguageLink';
import UnitLogoWithDuration, { getLogoUnit } from '../../shared/UnitLogoWithDuration';

const CollectionItem = ({ id }) => {
  const { t }        = useTranslation();
  const c            = useSelector(state => mdb.getDenormCollection(state.mdb, id));
  const historyItems = useSelector(state => my.getList(state.my, MY_NAMESPACE_HISTORY), shallowEqual) || [];

  if (!c?.content_units) return null;

  const { film_date, name, content_type, content_units, start_date, end_date } = c;

  const logoUnit = getLogoUnit(content_units, historyItems);
  const description = [];

  if (content_type === CT_LESSONS_SERIES) {
    description.push(t(`pages.unit.info.series-episodes`, { name: content_units.length }))
  }

  if (film_date) {
    description.push(t('values.date', { date: film_date }));
  } else if (start_date && end_date) {
    description.push(fromToLocalized(start_date, end_date));
  }

  const link = canonicalLink(logoUnit, '', c);
  const displayDuration = content_type !== CT_LESSONS_SERIES;

  return (
    <List.Item key={id} className="media_item">
      <Link to={link} style={{ minWidth: '140px' }}>
        <UnitLogoWithDuration unit={logoUnit} displayDuration={displayDuration} />
      </Link>
      <div className="media_item__content">
        <Header as={Link} to={canonicalLink(c)} content={name} />
        <div>{t(`constants.content-types.${content_type}`)}</div>
        <div className={clsx('description', { 'is_single': description.length <= 1 })}>
          {description.map((d, i) => (<span key={i}>{d}</span>))}
        </div>
      </div>
    </List.Item>
  );
};

export default CollectionItem;
