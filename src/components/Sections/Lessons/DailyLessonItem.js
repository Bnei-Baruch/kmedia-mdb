import React from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Header, List } from 'semantic-ui-react';
import { canonicalLink, getCuByCcuSkipPreparation } from '../../../helpers/links';

import { selectors as mdb } from '../../../redux/modules/mdb';
import Link from '../../Language/MultiLanguageLink';
import UnitLogoWithDuration, { getLogoUnit } from '../../shared/UnitLogoWithDuration';
import { MY_NAMESPACE_HISTORY } from '../../../helpers/consts';

const DailyLessonItem = ({ id, t }) => {
  const ccu = useSelector(state => mdb.getDenormCollection(state.mdb, id));

  const { number, film_date, content_units = [] } = ccu || {};


  if (!ccu || content_units.length === 0) return null;
  const logoUnit = content_units.find(x => x.id === getCuByCcuSkipPreparation(ccu));
  const link     = canonicalLink(logoUnit);

  return (
    <List.Item key={id} className="media_item daily_lesson">
      <Link to={link} style={{ minWidth: '140px' }}>
        <UnitLogoWithDuration unit={logoUnit} />
      </Link>
      <div className="media_item__content">
        <Header as={Link} to={canonicalLink(ccu)}>
          {t('constants.content-types.DAILY_LESSON')}
          <small>
            <span className="display-iblock margin-left-8 margin-right-8">{t('values.date', { date: film_date })}</span>
            {(number && number < 5) ? `(${t(`lessons.list.nameByNum_${number}`)})` : ''}
          </small>
        </Header>
        <div className="additional_links">
          {content_units.map(cu => <Link to={canonicalLink(cu)} as="span" key={cu.id}>{cu.name}</Link>)}
        </div>
      </div>
    </List.Item>
  );
};

export default withNamespaces()(DailyLessonItem);
