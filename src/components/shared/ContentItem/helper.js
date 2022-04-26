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

export const imageWidthBySize = {
  'small': 144,
  'big': 287,
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

export const buildTitleByUnit = (cu, t, getPathByID, nameOnly = false) => {
  if (!cu) return '';

  const { content_type, film_date, collections, name } = cu;

  if (content_type === CT_LESSON_PART) {
    const ctLabel = t(`constants.content-types.${CT_DAILY_LESSON}`);
    const fd      = t('values.date', { date: film_date });
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

  if (nameOnly)
    return collection.name;

  const part     = Number(collection?.ccuNames[cu.id]);
  const partName = t(cuPartNameByCCUType(content_type), { name: part });
  return `${collection.name} ${partName} (${t('values.date', { date: film_date })})`;
};

export const buildTextItemInfo = (cu, label, t, getPathByID) => {
  let subTitle = '', title = '', description = [];
  if (!cu || !getPathByID)
    return { subTitle, title, description };

  title       = buildTitleByUnit(cu, t, getPathByID, true);
  description = buildDescription(cu, t);
  description.push(t('values.date', { date: label?.date || cu.film_date }));
  if (cu.contextType === CT_ARTICLE) {
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

