import React from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Header, List } from 'semantic-ui-react';

import { COLLECTION_DAILY_LESSONS } from '../../../helpers/consts';
import { canonicalLink } from '../../../helpers/links';
import { isEmpty } from '../../../helpers/utils';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as recommended } from '../../../redux/modules/recommended';
import Link from '../../Language/MultiLanguageLink';
import UnitLogo from '../../shared/Logo/UnitLogo';
import TooltipIfNeed from '../../shared/tooltipIfNeed';

const UnitItem = ({ id, t }) => {
  const cu    = useSelector(state => mdb.getDenormContentUnit(state.mdb, id));
  const views = useSelector(state => recommended.getViews(id, state.recommended));

  if (!cu) return null;

  const link         = canonicalLink(cu);
  const additionCCUs = Object.values(cu.collections).filter(c => !COLLECTION_DAILY_LESSONS.includes(c.content_type));

  const description = [];
  description.push(t('values.date', { date: cu.film_date }));
  if (views > 0) description.push(t('pages.unit.info.views', { views }));

  const renderCCU = c => {
    return (
      <Link to={canonicalLink(c)}>
        {`${t(`constants.content-types.${c.content_type}`)}: ${c.name}`}
      </Link>
    );
  };

  return (
    <List.Item key={id} className="media_item">
      <Link to={link} style={{ minWidth: '140px' }}>
        <UnitLogo unitId={id} width={144} />
      </Link>
      <div className="media_item__content">
        <TooltipIfNeed text={cu.name} Component={Header} as={Link} to={link} content={cu.name} />
        {
          !isEmpty(additionCCUs) && (
            <div className="separate_with_line">
              {additionCCUs.map(renderCCU)}
            </div>
          )
        }
        <div className="description">
          {description.map((d, i) => (<span key={i}>{d}</span>))}
        </div>
      </div>
    </List.Item>
  );
};

export default withNamespaces()(UnitItem);
