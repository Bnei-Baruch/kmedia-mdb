import React from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Header, List } from 'semantic-ui-react';
import { canonicalLink } from '../../../helpers/links';

import { selectors as mdb } from '../../../redux/modules/mdb';
import Link from '../../Language/MultiLanguageLink';
import UnitLogo from '../../shared/Logo/UnitLogo';

const DailyLessonItem = ({ id, t }) => {
  const c = useSelector(state => mdb.getDenormCollection(state.mdb, id));
  if (!c) return null;

  const { number, film_date, content_units } = c;

  return (
    <List.Item key={id} className="media_item daily_lesson">
      <div style={{ minWidth: '140px' }}>
        <UnitLogo unitId={content_units[0].id} width={144} />
      </div>
      <div className="media_item__content">
        <Header as={Link} to={canonicalLink(c)}>
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

export default withTranslation()(DailyLessonItem);
