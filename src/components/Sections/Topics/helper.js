import {
  CT_CONGRESS,
  CT_DAILY_LESSON,
  CT_LIKUTIM,
  CT_SOURCE,
  CT_SPECIAL_LESSON,
  FN_CONTENT_TYPE,
  FN_DATE_FILTER,
  FN_LANGUAGES,
  FN_SOURCES_MULTI
} from '../../../helpers/consts';
import { canonicalCollection, cuPartNameByCCUType } from '../../../helpers/utils';
import Link from '../../Language/MultiLanguageLink';

export const TAG_DASHBOARD_FILTERS = [FN_SOURCES_MULTI, FN_CONTENT_TYPE, FN_LANGUAGES, FN_DATE_FILTER];
export const buildDailyLessonTitle = (cu, t) => {
  const ctLabel = t(`constants.content-types.${CT_DAILY_LESSON}`);
  const fd      = t('values.date', { date: cu.film_date });
  return `${ctLabel} (${fd})`;
};

export const buildSourceTitle = (getPathByID, id) => {
  let path = getPathByID(id);
  if (!Array.isArray(path))
    return null;
  path              = path?.map(x => x.name);
  const articleName = path.splice(-1);
  return `${articleName} ${path.join('. ')}`;
};

export const buildTextUnitInfo = ({ cu, label }, t, getPathByID) => {
  const date  = label?.date || cu.film_date;
  let subject = '', subTitle = '', title = '', description = [];
  if (!cu) return { subTitle, title, description };

  const { id, content_type, name } = cu;
  insertCCUPart(cu, description, t);

  description.push(t('values.date', { date }));
  switch (true) {
    case content_type === CT_SOURCE:
      subject = buildSourceTitle(getPathByID, id);
      break;
    case content_type === CT_LIKUTIM:
      subject = t('topics.likut-title', { name });
      break;
    case !!label?.properties?.activeTab:
      subject = t(`topics.${label.properties.activeTab}-based-on`, { name });
      break;
    default:
      subject = name;
  }

  return insertInfoFromLabel(subject, description, label, t);
};

const insertCCUPart = (cu, description, t) => {
  if (!cu) return;

  const { content_type, ccuNames } = canonicalCollection(cu) || false;
  if (![CT_DAILY_LESSON, CT_SPECIAL_LESSON, CT_CONGRESS].includes(content_type))
    return;

  const part = Number(ccuNames[cu.id]);
  if (!part || isNaN(part))
    return;

  description.push(t(cuPartNameByCCUType(content_type), { name: part }));
};

export const buildVideoUnitInfo = (cu, t, { label, date }) => {

  const subject = '', subTitle = '', title = '', description = [];
  if (!cu) return { subTitle, title, description };

  const { id, content_type, name } = cu;

  description.push(t('values.date', { date }));

  return insertInfoFromLabel(subject, description, label, t);
};

export const insertInfoFromLabel = (subject, description, label, t) => {
  let subTitle = '', title = '';
  if (!label) {
    return { subTitle, title: subject, description };
  }

  const { properties, name, author } = label;
  const { srchstart, srchend }       = properties || false;

  if (srchstart || srchend) {
    subject = t(`topics.part-of`, { name: subject });
  }

  subTitle = subject;
  title    = name;
  description.push(t('personal.label.createdBy', { author }));

  return { subTitle, title, description };
};

export const getBreadCrumbSection = (p, index, arr) => {
  if (!p) return arr;
  const section = {
    key: p.id,
    content: p.label,
  };

  if (index === arr.length - 1) {
    section.active = true;
  } else {
    section.as = Link;
    section.to = `/topics/${p.id}`;
  }

  return section;
};