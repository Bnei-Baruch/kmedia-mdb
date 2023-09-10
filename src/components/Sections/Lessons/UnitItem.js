import clsx from 'clsx';
import React from 'react';
import { withTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { Header, List } from 'semantic-ui-react';

import { COLLECTION_DAILY_LESSONS } from '../../../helpers/consts';
import { canonicalLink } from '../../../helpers/links';
import { isEmpty } from '../../../helpers/utils';
import { selectors as mdb } from '../../../../lib/redux/slices/mdbSlice/mdbSlice';
import { selectors as recommended } from '../../../redux/modules/recommended';
import Link from '../../Language/MultiLanguageLink';
import TooltipIfNeed from '../../shared/TooltipIfNeed';
import UnitLogoWithDuration from '../../shared/UnitLogoWithDuration';

const UnitItem = ({ id, t }) => {
  const cu    = useSelector(state => mdb.getDenormContentUnit(state.mdb, id));
  const views = useSelector(state => recommended.getViews(id, state.recommended));

  if (!cu) return null;

  const additionCCUs = Object.values(cu.collections).filter(c => !COLLECTION_DAILY_LESSONS.includes(c.content_type));
  const link         = canonicalLink(cu, null, additionCCUs[0]);

  const description = [];
  description.push(t('values.date', { date: cu.film_date }));
  if (views > 0) description.push(t('pages.unit.info.views', { views }));

  const renderCCU = (c, i) => (
    <Link to={canonicalLink(c)} key={i}>
      {`${t(`constants.content-types.${c.content_type}`)}: ${c.name}`}
    </Link>
  );

  return (
    <List.Item className="media_item">
      <Link to={link}>
        <UnitLogoWithDuration unit={cu} />
      </Link>
      <div className="media_item__content">
        <TooltipIfNeed text={cu.name} Component={Header} as={Link} to={link} content={cu.name} />
        {
          !isEmpty(additionCCUs) && (
            <div className="additional_links">
              {additionCCUs.map(renderCCU)}
            </div>
          )
        }
        <div className={clsx('description', { 'is_single': !(description?.length > 1) })}>
          {description.map((d, i) => (<span key={i}>{d}</span>))}
        </div>
      </div>
    </List.Item>
  );
};

export default withTranslation()(UnitItem);
