import {
  CT_ARTICLE,
  CT_BLOG_POST,
  CT_DAILY_LESSON,
  CT_LIKUTIM,
  CT_PUBLICATION,
  CT_RESEARCH_MATERIAL,
  CT_SOURCE,
  UNIT_EVENTS_TYPE,
  UNIT_LESSONS_TYPE,
  UNIT_PROGRAMS_TYPE
} from '../../../helpers/consts';

export const buildDailyLessonTitle = (cu, t) => {
  const ctLabel = t(`constants.content-types.${CT_DAILY_LESSON}`);
  const fd      = t('values.date', { date: cu.film_date });
  return `${ctLabel} (${fd})`;
};

export const buildSourceTitle = (getPathByID, cu) => {
  const path        = getPathByID(cu.id)?.map(x => x.name);
  const articleName = path.splice(-1);
  return `${articleName} ${path.join('. ')}`;
};

const UNIT_TEXT_TYPE   = [CT_ARTICLE, CT_BLOG_POST, CT_PUBLICATION, CT_RESEARCH_MATERIAL, CT_SOURCE, CT_LIKUTIM,];
const UNIT_VIDEOS_TYPE = [...UNIT_LESSONS_TYPE, ...UNIT_PROGRAMS_TYPE, ...UNIT_EVENTS_TYPE];

export const extractByMediaType = items => items.reduce((acc, { cu, label }) => {
  if (!cu)
    return acc;

  if (label?.media_type === 'text') {
    acc.texts.push({ cu, label });
    return acc;
  }

  if (UNIT_VIDEOS_TYPE.includes(cu.content_type)) {
    acc.medias.push({ cu, label });
  }

  if (UNIT_TEXT_TYPE.includes(cu.content_type)) {
    acc.texts.push({ cu, label });
  }

  return acc;
}, { texts: [], medias: [] });

export const buildTextUnitInfo = ({ cu, label }, t, getPathByID) => {
  const date  = label?.date || cu.film_date;
  let subject = '', subTitle = '', title = '', description = [];
  if (!cu) return { subTitle, title, description };

  const { id, content_type, name } = cu;

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
  description.push(author);

  return { subTitle, title, description };
};
