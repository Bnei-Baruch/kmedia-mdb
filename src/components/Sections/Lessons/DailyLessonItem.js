import React from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Container, Header, List } from 'semantic-ui-react';
import { canonicalLink } from '../../../helpers/links';
import { canonicalCollection } from '../../../helpers/utils';

import { selectors as recommended } from '../../../redux/modules/recommended';
import { selectors as mdb } from '../../../redux/modules/mdb';
import Link from '../../Language/MultiLanguageLink';
import UnitLogo from '../../shared/Logo/UnitLogo';
import TooltipIfNeed from '../../shared/tooltipIfNeed';

const DailyLessonItem = ({ id, t }) => {
  const c = useSelector(state => mdb.getDenormCollection(state.mdb, id));

  const cus                   = c.content_units;
  const { number, film_date } = c;
  const description           = [];

  return (<List.Item key={id} className="media_item">
    <div style={{ minWidth: '140px' }}>
      <UnitLogo unitId={cus[0].id} width={144} />
    </div>
    <div className="media_item__content">
      <Link to={canonicalLink(c)}>
        {t('constants.content-types.DAILY_LESSON')}
        <small>
          <span className="display-iblock margin-left-8 margin-right-8">{t('values.date', { date: film_date })}</span>
          {(number && number < 5) ? `(${t(`lessons.list.nameByNum_${number}`)})` : ''}
        </small>
      </Link>
      <div className="description">
        {description.map((d, i) => (<span key={i}>{d}</span>))}
      </div>
    </div>
  </List.Item>);
};

export default withNamespaces()(DailyLessonItem);
