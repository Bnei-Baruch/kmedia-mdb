import { canonicalCollection, isEmpty } from './utils';
import { filtersTransformer } from '@/lib/filters/index';
import { stringify as urlSearchStringify, stringify } from './url';

import {
  BLOG_ID_LAITMAN_CO_IL,
  BLOG_ID_LAITMAN_COM,
  BLOG_ID_LAITMAN_ES,
  BLOG_ID_LAITMAN_RU,
  COLLECTION_EVENTS_TYPE,
  COLLECTION_LESSONS_TYPE,
  COLLECTION_PROGRAMS_TYPE,
  COLLECTION_PUBLICATIONS_TYPE,
  CT_ARTICLE,
  CT_ARTICLES,
  CT_BLOG_POST,
  CT_CLIP,
  CT_CLIPS,
  CT_CONGRESS,
  CT_DAILY_LESSON,
  CT_EVENT_PART,
  CT_FRIENDS_GATHERING,
  CT_FRIENDS_GATHERINGS,
  CT_FULL_LESSON,
  CT_HOLIDAY,
  CT_KTAIM_NIVCHARIM,
  CT_LECTURE,
  CT_LECTURE_SERIES,
  CT_LESSON_PART,
  CT_LESSONS_SERIES,
  CT_LIKUTIM,
  CT_MEAL,
  CT_MEALS,
  CT_PICNIC,
  CT_SONGS,
  CT_SOURCE,
  CT_SPECIAL_LESSON,
  CT_TAG,
  CT_UNITY_DAY,
  CT_VIDEO_PROGRAM,
  CT_VIDEO_PROGRAM_CHAPTER,
  CT_VIRTUAL_LESSON,
  CT_VIRTUAL_LESSONS,
  CT_WOMEN_LESSON,
  CT_WOMEN_LESSONS,
  EVENT_TYPES,
  SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_LINK,
  UNIT_EVENTS_TYPE,
  UNIT_LESSONS_TYPE,
  UNIT_PROGRAMS_TYPE,
  UNIT_PUBLICATIONS_TYPE,
} from './consts';

export const landingPageSectionLink = (landingPage, filterValues) => {
  const linkParts = (SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_LINK[landingPage] || '').split('?');
  const hasPath   = linkParts.length > 1;
  const search    = [hasPath ? linkParts[1] : linkParts[0]];
  const params    = filterValues &&
    filterValues.filter(filterValue => filterValue.name !== 'text')
      .map(filterValue => `${filterValue.name}=${filterValue.value}`).join('&');

  if (params) {
    search.push(params);
  }

  return { pathname: hasPath ? linkParts[0] : '', search: search.join('&') };
};

export const intentSectionLink = (section, filters) => {
  const query = filtersTransformer.toQueryParams(filters);
  return `/${section}?${urlSearchStringify(query)}`;
};

const blogNames = new Map([
  [BLOG_ID_LAITMAN_RU, 'laitman-ru'],
  [BLOG_ID_LAITMAN_COM, 'laitman-com'],
  [BLOG_ID_LAITMAN_ES, 'laitman-es'],
  [BLOG_ID_LAITMAN_CO_IL, 'laitman-co-il'],
]);

const mediaPrefix = new Map([
  [CT_LESSON_PART, '/lessons/cu/'],
  [CT_LECTURE, '/lessons/cu/'],
  [CT_VIRTUAL_LESSON, '/lessons/cu/'],
  [CT_WOMEN_LESSON, '/lessons/cu/'],
  [CT_BLOG_POST, '/lessons/cu/'],
  // [CT_CHILDREN_LESSON, '/lessons/cu/'],
  [CT_KTAIM_NIVCHARIM, '/lessons/cu/'],
  [CT_VIDEO_PROGRAM_CHAPTER, '/programs/cu/'],
  [CT_CLIP, '/programs/cu/'],
  [CT_EVENT_PART, '/events/cu/'],
  [CT_FULL_LESSON, '/events/cu/'],
  [CT_FRIENDS_GATHERING, '/events/cu/'],
  [CT_MEAL, '/events/cu/'],
  [CT_ARTICLE, '/publications/articles/cu/'],
]);

export const getCuByCcuSkipPreparation = ccu => {
  if (isEmpty(ccu?.cuIDs)) return null;

  return ccu.cuIDs.filter(id => !ccu.ccuNames || Number(ccu.ccuNames[id]) !== 0)[0] || ccu.cuIDs[0];
};

/* WARNING!!!
   This function MUST be synchronized with the next one: canonicalContentType
 */
export const canonicalLink = (entity, mediaLang, ccu) => {
  if (!entity) {
    return { pathname: `.`, query: {} };
  }

  // source
  if (entity.content_type === CT_SOURCE) {
    return { pathname: `/sources/${entity.id}`, query: {} };
  }

  // tag
  if (entity.content_type === CT_TAG) {
    return { pathname: `/topics/${entity.id}`, query: {} };
  }

  if (entity.content_type === 'POST') {
    const [blogID, postID] = entity.id.split('-');
    const blogName         = blogNames.get(parseInt(blogID, 10)) || 'laitman-co-il';

    return { pathname: `/publications/blog/${blogName}/${postID}`, query: {} };
  }

  // collections
  switch (entity.content_type) {
    case CT_DAILY_LESSON:
    case CT_SPECIAL_LESSON:
      const cuId = getCuByCcuSkipPreparation(entity);
      if (!cuId)
        return { pathname: `/lessons/daily/c/${entity.id}`, query: { 'ap': 0 } };
      return { pathname: `/lessons/cu/${cuId}`, query: {} };
    case CT_VIRTUAL_LESSONS:
      return { pathname: `/lessons/virtual/c/${entity.id}`, query: {} };
    case CT_LECTURE_SERIES:
      return { pathname: `/lessons/lectures/c/${entity.id}`, query: {} };
    case CT_WOMEN_LESSONS:
      return { pathname: `/lessons/women/c/${entity.id}`, query: {} };
    case CT_LESSONS_SERIES:
      return { pathname: `/lessons/series/c/${entity.id}`, query: {} };
    case CT_VIDEO_PROGRAM:
    case CT_CLIPS:
      return { pathname: `/programs/c/${entity.id}`, query: {} };
    case CT_ARTICLES:
      return { pathname: `/publications/articles/c/${entity.id}`, query: {} };
    case CT_FRIENDS_GATHERINGS:
    case CT_MEALS:
    case CT_CONGRESS:
    case CT_HOLIDAY:
    case CT_PICNIC:
    case CT_UNITY_DAY:
      return { pathname: `/events/c/${entity.id}`, query: {} };
    case CT_SONGS:
      return { pathname: `/music/c/${entity.id}`, query: {} };
    default:
      break;
  }

  // content units
  switch (entity.content_type) {
    case CT_ARTICLE:
      return { pathname: `/publications/articles/cu/${entity.id}`, query: {} };
    case CT_LIKUTIM:
      return { pathname: `/likutim/${entity.id}`, query: {} };
    default:
      break;
  }

  // units whose canonical collection is an event goes as an event item
  const collection = ccu || canonicalCollection(entity);
  if (collection) {
    const { id, content_type } = collection;

    if (EVENT_TYPES.includes(content_type)) {
      return { pathname: `/events/cu/${entity.id}`, query: ccu ? { c: id } : {} };
    }

    if (content_type === CT_LESSONS_SERIES) {
      return { pathname: `/lessons/series/cu/${entity.id}`, query: ccu ? { c: id } : {} };
    }

    if (content_type === CT_SONGS) {
      return { pathname: `/music/cu/${entity.id}`, query: ccu ? { c: id } : {} };
    }
  }

  const mediaLangSuffix = mediaLang ? `?language=${mediaLang}` : '';

  // unit based on type
  const prefix   = mediaPrefix.get(entity.content_type);
  const query    = mediaLang ? { language: mediaLang } : {};
  const pathname = prefix ? `${prefix}${entity.id}` : '/';
  return { pathname, query };
};

/* WARNING!!!
   This function MUST be synchronized with the previous one: canonicalLink
 */
export const canonicalContentType = entity => {
  switch (entity) {
    case 'sources':
      return ['SOURCE'];
    case 'lessons':
      return [...COLLECTION_LESSONS_TYPE, ...UNIT_LESSONS_TYPE];
    case 'programs':
      return [...COLLECTION_PROGRAMS_TYPE, ...UNIT_PROGRAMS_TYPE];
    case 'publications':
      return ['POST', CT_ARTICLES, ...COLLECTION_PUBLICATIONS_TYPE, ...UNIT_PUBLICATIONS_TYPE];
    case 'events':
      return [...COLLECTION_EVENTS_TYPE, ...UNIT_EVENTS_TYPE];
    default:
      return [];
  }
};

export const canonicalSectionByUnit = unit => {
  const to = canonicalLink(unit);
  return canonicalSectionByLink(to);
};

export const canonicalSectionByLink = ({ pathname }) => {
  const s = pathname.split('/');
  return s.length > 2 ? s[1] : null;
};

