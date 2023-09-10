import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { selectors as sources } from '../../../../lib/redux/slices/sourcesSlice/sourcesSlice';
import { canonicalLink, canonicalSectionByLink } from '../../../helpers/links';
import * as shapes from '../../shapes';
import Link from '../../Language/MultiLanguageLink';
import UnitLogo from '../../shared/Logo/UnitLogo';
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
import ContentItemContainer from '../../shared/ContentItem/ContentItemContainer';
import { fromToLocalized } from '../../../helpers/date';
import { getRandomLatestLesson } from './LatestDailyLesson';
import { useTranslation } from 'next-i18next';

const LatestUpdate = ({ item, label }) => {
  const { content_type, name, film_date, name_in_collection, id, source_id, start_date, end_date, number } = item;

  const { t }    = useTranslation();
  const to       = canonicalLink(item);
  let title      = name || `${t(`constants.content-types.${content_type}`)} ${t('lessons.list.number')} ${name_in_collection}`;
  let subheader  = [`${t('values.date', { date: item.film_date })} - ${label}`];
  let authorName = '';

  const getPathByID = useSelector(state => sources.getPathByID(state.sources));

  if (content_type === CT_LESSONS_SERIES && source_id) {
    authorName = getPathByID(source_id)?.[0]?.name;
  }

  let canonicalSection = getRandomLatestLesson();

  // collections -- prepare random image
  switch (content_type) {
    case CT_VIDEO_PROGRAM_CHAPTER:
    case CT_CLIP:
    case CT_VIRTUAL_LESSON:
      return <ContentItemContainer id={id} noViews />;
    case CT_DAILY_LESSON:
      title     = t(`constants.content-types.${content_type}`);
      subheader = [`${t('values.date', { date: film_date })}${number && ` (${t(`lessons.list.nameByNum_${number}`)})`}`];
      break;
    case CT_WOMEN_LESSONS:
      title     = name;
      subheader = [t('values.date', { date: film_date })];
      break;
    case CT_LESSONS_SERIES:
      title     = [t(`player.header.series-by-topic`), `${authorName}`, ` ${name}`] || t(`constants.content-types.${content_type}`);
      subheader = [fromToLocalized(start_date || film_date, end_date)];
      break;
    case CT_CONGRESS:
    case CT_HOLIDAY:
      subheader = [fromToLocalized(start_date || film_date, end_date)];
      break;
    case CT_SPECIAL_LESSON:
    case CT_MEAL:
    case CT_FRIENDS_GATHERING:
    case CT_PICNIC:
    case CT_UNITY_DAY:
      break;
    default:
      canonicalSection = canonicalSectionByLink(to);
  }

  return (
    <Card raised className="cu_item" as={Link} to={to}>
      <div className="cu_item_img">
        <UnitLogo unitId={id} width={250} fallbackImg={canonicalSection} />
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
};

export default LatestUpdate;
