import React from 'react';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { Header, List } from 'semantic-ui-react';
import { canonicalLink, getCuByCcuSkipPreparation } from '../../../helpers/links';

import { selectors as mdb } from '../../../../lib/redux/slices/mdbSlice/mdbSlice';
import Link from '../../Language/MultiLanguageLink';
import UnitLogoWithDuration from '../../shared/UnitLogoWithDuration';
import { CT_LESSON_PART } from '../../../helpers/consts';

const DailyLessonItem = ({ id }) => {
  const ccu   = useSelector(state => mdb.getDenormCollection(state.mdb, id));
  const { t } = useTranslation();

  const { number, film_date, content_units = [] } = ccu || {};

  if (!ccu || content_units.length === 0) return null;
  const logoUnit      = content_units.find(x => x.id === getCuByCcuSkipPreparation(ccu));
  const link          = canonicalLink(logoUnit);
  const totalDuration = content_units.filter(cu => cu.content_type === CT_LESSON_PART)
    .reduce((acc, cu) => acc += cu.duration, 0);

  return (
    <List.Item key={id} className="media_item daily_lesson">
      <Link to={link} style={{ minWidth: '140px' }}>
        <UnitLogoWithDuration unit={logoUnit} totalDuration={totalDuration} />
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

export default DailyLessonItem;
