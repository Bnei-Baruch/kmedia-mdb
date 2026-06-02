import { clsx } from 'clsx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { canonicalLink } from '../../../helpers/links';

import Link from '../../Language/MultiLanguageLink';
import TooltipIfNeed from '../../shared/TooltipIfNeed';
import UnitLogoWithDuration from '../../shared/UnitLogoWithDuration';
import { mdbGetDenormContentUnitSelector, recommendedGetViewsSelector } from '../../../redux/selectors';

const ItemOfList = ({ id, ccu }) => {
  const { t } = useTranslation();

  const views = useSelector(state => recommendedGetViewsSelector(state, id));
  const cu    = useSelector(state => mdbGetDenormContentUnitSelector(state, id));

  if (!cu)
    return null;

  const to = canonicalLink(cu);

  const description = [];
  const part        = Number(ccu?.ccuNames?.[cu.id]);
  part && description.push(t('pages.unit.info.episode', { name: part }));
  description.push(t('values.date', { date: cu.film_date }));
  if (views > 0) description.push(t('pages.unit.info.views', { views }));

  return (<div key={id} className="media_item">
    <UnitLogoWithDuration unit={cu}/>
    <div className="media_item__content">
      <Link to={to}><TooltipIfNeed text={cu.name} Component="h5" className="font-bold" content={cu.name}/></Link>
      {
        cu.description && (
          <TooltipIfNeed
            text={cu.description}
            Component="div"
            content={cu.description}
          />
        )
      }
      <div className={clsx('description', { 'is_single': !(description?.length > 1) })}>
        {
          description.map((d, i) => (<span key={i}>{d}</span>))
        }
      </div>
    </div>
  </div>);
};

export default ItemOfList;
