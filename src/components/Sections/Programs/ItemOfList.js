import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Container, Header, List } from 'semantic-ui-react';

import { canonicalLink } from '../../../helpers/links';
import { canonicalCollection } from '../../../helpers/utils';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as recommended } from '../../../redux/modules/recommended';
import Link from '../../Language/MultiLanguageLink';
import TooltipIfNeed from '../../shared/TooltipIfNeed';
import UnitLogoWithDuration from '../../shared/UnitLogoWithDuration';

const ItemOfList = ({ id }) => {
  const { t } = useTranslation();
  const views = useSelector(state => recommended.getViews(id, state.recommended));
  const cu    = useSelector(state => mdb.getDenormContentUnit(state.mdb, id));

  if (!cu)
    return null;

  const link = canonicalLink(cu);
  const ccu  = canonicalCollection(cu) || {};

  const description = [ccu.name];
  const part        = Number(ccu?.ccuNames?.[cu.id]);
  part && description.push(t('pages.unit.info.episode', { name: part }));
  description.push(t('values.date', { date: cu.film_date }));
  if (views > 0) description.push(t('pages.unit.info.views', { views }));

  return (
    <List.Item key={id} className="media_item">
      <Link to={link} style={{ minWidth: '140px' }}>
        <UnitLogoWithDuration unit={cu} />
      </Link>
      <div className="media_item__content">
        <TooltipIfNeed text={cu.name} Component={Header} as={Link} to={link} content={cu.name} />
        {
          cu.description && (
            <TooltipIfNeed
              text={cu.description}
              Component={Container}
              content={cu.description}
            />
          )
        }
        <div className="description">
          {description.map((d, i) => (<span key={i}>{d}</span>))}
          {ccu && (<span className="opacity_1">
            <Link as={'a'} to={canonicalLink(ccu)}>
              {t('programs.list.show_all')}
            </Link>
          </span>)}
        </div>
      </div>
    </List.Item>
  );
};

export default ItemOfList;
