import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';

import { canonicalLink, canonicalSectionByLink } from '../../../helpers/links';
import * as shapes from '../../shapes';
import Link from '../../Language/MultiLanguageLink';
import UnitLogo from '../../shared/Logo/UnitLogo';
import { Requests } from '../../../helpers/Api';
import {
  CT_CLIP,
  CT_CONGRESS,
  CT_DAILY_LESSON,
  CT_FRIENDS_GATHERING,
  CT_HOLIDAY,
  CT_LESSONS_SERIES,
  CT_MEAL,
  CT_PICNIC,
  CT_SPECIAL_LESSON,
  CT_UNITY_DAY,
  CT_VIDEO_PROGRAM_CHAPTER,
  CT_VIRTUAL_LESSON,
  CT_WOMEN_LESSONS
} from '../../../helpers/consts';
import CUItemContainer from '../../shared/CUItem/CUItemContainer';
import { fromToLocalized } from '../../../helpers/date';

const LatestUpdate = ({ item, t, label }) => {
  const { content_type, name, film_date, name_in_collection, id, start_date, end_date, number } = item;

  const link           = canonicalLink(item);
  let title            = name || `${t(`constants.content-types.${content_type}`)} ${t('lessons.list.number')} ${name_in_collection}`;
  let subheader        = [`${t('values.date', { date: item.film_date })} - ${label}`];
  let canonicalSection = Requests.imaginaryRandom('resize', {
    width: 512,
    height: 288,
    nocrop: false,
    stripmeta: true,
  }, `lessons/latest_lesson_%s.jpg`);

  // collections -- prepare random image
  switch (content_type) {
    case CT_VIDEO_PROGRAM_CHAPTER:
    case CT_CLIP:
    case CT_VIRTUAL_LESSON:
      return <CUItemContainer id={id} noViews />;
    case CT_DAILY_LESSON:
      title     = t(`constants.content-types.${content_type}`);
      subheader = [`${t('values.date', { date: film_date })}${number && ` (${t(`lessons.list.nameByNum_${number}`)})`}`];
      break;
    case CT_WOMEN_LESSONS:
      title     = name;
      subheader = [t('values.date', { date: film_date })];
      break;
    case CT_LESSONS_SERIES:
      title     = name || t(`constants.content-types.${content_type}`);
      subheader = [fromToLocalized(start_date || film_date, end_date)];
      break;
    case CT_SPECIAL_LESSON:
    case CT_CONGRESS:
    case CT_MEAL:
    case CT_FRIENDS_GATHERING:
    case CT_HOLIDAY:
    case CT_PICNIC:
    case CT_UNITY_DAY:
      break;
    default:
      canonicalSection = canonicalSectionByLink(link);
  }

  return (
    <Card raised className="cu_item" as={Link} to={link}>
      <div className="cu_item_img">
        <UnitLogo unitId={id} width={520} fallbackImg={canonicalSection} />
      </div>
      <Card.Content>
        <Card.Description content={title} className="bold-font" />
      </Card.Content>
      <Card.Meta className={'cu_info_description'}>
        {subheader.map((d, i) => (<span key={i}>{d}</span>))}
      </Card.Meta>
    </Card>
  );
};

LatestUpdate.propTypes = {
  item: PropTypes.oneOfType([shapes.ContentUnit, shapes.Collection]).isRequired,
  label: PropTypes.string,
  t: PropTypes.func.isRequired,
};

export default LatestUpdate;
