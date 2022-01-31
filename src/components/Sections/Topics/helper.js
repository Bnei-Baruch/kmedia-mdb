import {
  CT_DAILY_LESSON,
  CT_KITEI_MAKOR,
  CT_LELO_MIKUD,
  CT_LESSON_PART,
  CT_LIKUTIM,
  CT_SOURCE,
  CT_VIDEO_PROGRAM_CHAPTER,
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

const UNIT_VIDEOS_TYPE = [...UNIT_LESSONS_TYPE, ...UNIT_PROGRAMS_TYPE, ...UNIT_EVENTS_TYPE, CT_KITEI_MAKOR];
const FILTER_CT        = [CT_LELO_MIKUD, CT_KITEI_MAKOR];

export const extractByMediaType = (cusByType, isText = false) => {
  let res = [];
  for (const k in cusByType) {
    if (FILTER_CT.includes(k)) continue;
    if ([CT_VIDEO_PROGRAM_CHAPTER, CT_LESSON_PART].includes(k)) {
      const fromTabs = cusByType[k].filter(x => !!x.label?.properties?.activeTab === isText);
      res            = [...res, ...fromTabs];
      continue;
    }

    if (UNIT_VIDEOS_TYPE.includes(k) !== isText) {
      res = [...res, ...cusByType[k]];
    }
  }

  return res;
};

export const buildTextUnitInfo = (cu, t, getPathByID, { label, date }) => {

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

  const { properties: { srchstart, srchend } = false, name, author } = label;

  if (srchstart || srchend) {
    subject = t(`topics.part-of`, { name: subject });
  }

  subTitle = subject;
  title    = name;
  description.push(author);

  return { subTitle, title, description };
};
