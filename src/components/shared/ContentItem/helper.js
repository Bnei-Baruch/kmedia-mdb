import {
  CT_ARTICLE,
  CT_CONGRESS,
  CT_DAILY_LESSON,
  CT_LESSON_PART,
  CT_LIKUTIM,
  CT_SOURCE,
  CT_SPECIAL_LESSON,
  UNIT_VIDEOS_TYPE
} from '../../../helpers/consts';
import { canonicalCollection, cuPartNameByCCUType } from '../../../helpers/utils';
import { canonicalLink } from '../../../helpers/links';
import { stringify } from '../../../helpers/url';
import { Progress } from 'semantic-ui-react';
import { PLAYER_POSITION_STORAGE_KEY } from '../../Player/constants';

export const imageWidthBySize = {
  'tiny': 120,
  'small': 144,
  'big': 287,
};

export const getProgress = (unit, playTime) => {
  let progressIndicator = null;

  if (unit && playTime) {
    progressIndicator = (
      <Progress
        size="tiny"
        className="cu_item_progress"
        percent={playTime * 100 / unit.duration} />
    );
  }

  return progressIndicator;
};

export const textPartLink = (properties, cu) => {
  if (!properties)
    return canonicalLink(cu);

  const { uid_prefix, ...urlParams } = properties;

  let link = canonicalLink({ ...cu, id: `${uid_prefix || ''}${cu.id}` });
  if (!urlParams?.activeTab && UNIT_VIDEOS_TYPE.includes(cu.content_type)) {
    urlParams.activeTab = 'transcription';
  }

  if (urlParams) {
    link = `${link}?${stringify(urlParams)}`;
    if (urlParams.activeTab)
      link = `${link}&autoPlay=0`;
  }

  return link;
};

export const buildTitleByUnit = (cu, t, getPathByID, nameOnly = false, withDate = true) => {
  if (!cu) return '';

  const { content_type, film_date, collections, name } = cu;

  if (content_type === CT_LESSON_PART) {
    const ctLabel = t(`constants.content-types.${CT_DAILY_LESSON}`);
    if (!withDate) return ctLabel;
    const fd = t('values.date', { date: film_date });
    return `${ctLabel} (${fd})`;
  }

  if (content_type === CT_SOURCE) {
    const path        = getPathByID(cu.id)?.map(x => x.name);
    const articleName = path.splice(-1);
    return `${articleName} ${path.join('. ')}`;
  }

  if (content_type === CT_LIKUTIM) {
    return `${name} (${t('nav.sidebar.likutim')})`;
  }

  const collection = Object.values(collections)[0];

  if (!collection) return '';

  if (nameOnly)
    return collection.name;

  const part     = Number(collection.ccuNames[cu.id]);
  const partName = t(cuPartNameByCCUType(content_type), { name: part });
  return `${collection.name} ${partName} (${t('values.date', { date: film_date })})`;
};

export const buildTextItemInfo = (cu, label, t, getPathByID, titleWithDate = true) => {
  let subTitle = '', title = '', description = [];
  if (!cu || !getPathByID)
    return { subTitle, title, description };

  title       = buildTitleByUnit(cu, t, getPathByID, true, titleWithDate);
  description = buildDescription(cu, t);
  description.push(t('values.date', { date: label?.date || cu.film_date }));
  if (cu.content_type === CT_ARTICLE) {
    subTitle = title;
    title    = cu.name;
  }

  if (label) {
    const { author, name } = label;
    subTitle               = title;
    title                  = name;
    description.push(t('personal.label.createdBy', { author }));
  }

  return { subTitle, title, description };
};

const buildDescription = (cu, t) => {
  const res = [];
  if (!cu)
    return res;

  const { content_type, ccuNames } = canonicalCollection(cu) || false;
  if ([CT_DAILY_LESSON, CT_SPECIAL_LESSON, CT_CONGRESS].includes(content_type)) {
    const part = Number(ccuNames[cu.id]);
    (part && !isNaN(part)) && res.push(t(cuPartNameByCCUType(content_type), { name: part }));
  }

  return res;
};

