import {
  CT_VIRTUAL_LESSON,
  CT_WOMEN_LESSON,
  CT_LECTURE,
  CT_LESSONS_SERIES,
  CT_DAILY_LESSON,
  CT_LESSON_PART,
  COLLECTION_PROGRAMS_TYPE,
  UNIT_PROGRAMS_TYPE,
  EVENT_PAGE_CTS,
  PAGE_NS_LESSONS,
  PAGE_NS_PROGRAMS,
  PAGE_NS_EVENTS,
  FN_SHOW_LESSON_AS_UNITS,
  PAGE_NS_ARTICLES,
  CT_ARTICLE, CT_BLOG_POST, PAGE_NS_AUDIO_BLOG
} from '../../src/helpers/consts';
import { isEmpty } from '../../src/helpers/utils';

const SHOWED_CT = [CT_VIRTUAL_LESSON, CT_WOMEN_LESSON, CT_LECTURE, CT_LESSONS_SERIES];

export const LESSON_AS_COLLECTION = [CT_DAILY_LESSON, ...SHOWED_CT];
export const LESSON_AS_UNIT       = [CT_LESSON_PART, ...SHOWED_CT];

const PROGRAMS_PARAMS = { content_type: [...COLLECTION_PROGRAMS_TYPE, ...UNIT_PROGRAMS_TYPE] };
const EVENTS_PARAMS   = { content_type: EVENT_PAGE_CTS };

export const baseParamsByNamespace = (namespace, filters = {}) => {
  switch (namespace) {
    case PAGE_NS_LESSONS:
      const isUnit = Object.entries(filters).some(([name, values]) => FN_SHOW_LESSON_AS_UNITS.includes(name) && !isEmpty(values));
      return { content_type: isUnit ? LESSON_AS_UNIT : LESSON_AS_COLLECTION };
    case PAGE_NS_PROGRAMS:
      return PROGRAMS_PARAMS;
    case PAGE_NS_EVENTS:
      return EVENTS_PARAMS;
    case PAGE_NS_ARTICLES:
      return { content_type: CT_ARTICLE };
    case PAGE_NS_AUDIO_BLOG:
      return { content_type: CT_BLOG_POST };
    default:
      return {};
  }
};
