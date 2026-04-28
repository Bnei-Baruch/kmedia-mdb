import { clsx } from 'clsx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { COLLECTION_DAILY_LESSONS } from '../../../../helpers/consts';
import { canonicalLink } from '../../../../helpers/links';
import { isEmpty } from '../../../../helpers/utils';
import Link from '../../../Language/MultiLanguageLink';
import TooltipIfNeed from '../../../shared/TooltipIfNeed';
import UnitLogoWithDuration from '../../../shared/UnitLogoWithDuration';
import { mdbGetDenormContentUnitSelector, recommendedGetViewsSelector } from '../../../../redux/selectors';

const UnitItem = ({ id }) => {
  const { t } = useTranslation();
  const cu    = useSelector(state => mdbGetDenormContentUnitSelector(state, id));
  const views = useSelector(state => recommendedGetViewsSelector(state, id));

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
    <div className="media_item">
      <Link to={link}>
        <UnitLogoWithDuration unit={cu}/>
      </Link>
      <div className="media_item__content">
        <TooltipIfNeed text={cu.name} Component="h5" className="font-bold" as={Link} to={link} content={cu.name}/>
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
    </div>
  );
};

export default UnitItem;
