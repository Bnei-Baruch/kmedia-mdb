import { canonicalCollection, tracePath } from './utils';
import { filtersTransformer } from '../filters/index';
import { stringify as urlSearchStringify } from './url';

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
  CT_LECTURE,
  CT_LECTURE_SERIES,
  CT_LESSON_PART,
  CT_LESSONS_SERIES,
  CT_MEAL,
  CT_MEALS,
  CT_PICNIC,
  CT_SPECIAL_LESSON,
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

export const landingPageSectionLink = (landingPage) => {
  return SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_LINK[landingPage];
};

export const intentSectionLink = (section, filters) => {
  const filterValues = filters.map(({ name, value, getFilterById }) => {
    if (['topics-filter', 'sources-filter'].includes(name)) {
      const tagOrSource = getFilterById(value);
      if (!tagOrSource) {
        return null;
      }
      const path = tracePath(tagOrSource, getFilterById);
      return { name, values: [path.map(y => y.id)] };
    }

    return { name, values: [value] };
  });
  const query        = filtersTransformer.toQueryParams(filterValues.filter(f => !!f));
  return `/${section}?${urlSearchStringify(query)}`;
};

const blogNames = new Map([
  [BLOG_ID_LAITMAN_RU, 'laitman-ru'],
  [BLOG_ID_LAITMAN_COM, 'laitman-com'],
  [BLOG_ID_LAITMAN_ES, 'laitman-es'],
  [BLOG_ID_LAITMAN_CO_IL, 'laitman-co-il'],
]);

const collectionPrefixes = new Map([
  [CT_DAILY_LESSON, '/lessons/daily/c/'],
  [CT_SPECIAL_LESSON, '/lessons/daily/c/'],
  [CT_VIRTUAL_LESSONS, '/lessons/virtual/c/'],
  [CT_LECTURE_SERIES, '/lessons/lectures/c/'],
  [CT_WOMEN_LESSONS, '/lessons/women/c/'],
  // [CT_CHILDREN_LESSONS, '/lessons/children/c/'],
  [CT_LESSONS_SERIES, '/lessons/series/c/'],
  [CT_VIDEO_PROGRAM, '/programs/c/'],
  [CT_CLIPS, '/programs/c/'],
  [CT_ARTICLES, '/publications/articles/c/'],
  [CT_FRIENDS_GATHERINGS, '/events/c/'],
  [CT_MEALS, '/events/c/'],
  [CT_CONGRESS, '/events/c/'],
  [CT_HOLIDAY, '/events/c/'],
  [CT_PICNIC, '/events/c/'],
  [CT_UNITY_DAY, '/events/c/'],
]);

const mediaPrefix = new Map([
  [CT_LESSON_PART, '/lessons/cu/'],
  [CT_LECTURE, '/lessons/cu/'],
  [CT_VIRTUAL_LESSON, '/lessons/cu/'],
  [CT_WOMEN_LESSON, '/lessons/cu/'],
  [CT_BLOG_POST, '/lessons/cu/'],
  // [CT_CHILDREN_LESSON, '/lessons/cu/'],
  [CT_VIDEO_PROGRAM_CHAPTER, '/programs/cu/'],
  [CT_CLIP, '/programs/cu/'],
  [CT_EVENT_PART, '/events/cu/'],
  [CT_FULL_LESSON, '/events/cu/'],
  [CT_FRIENDS_GATHERING, '/events/cu/'],
  [CT_MEAL, '/events/cu/'],
  [CT_ARTICLE, '/publications/articles/cu/'],
]);

/* WARNING!!!
   This function MUST be synchronized with the next one: canonicalContentType
 */
export const canonicalLink = (entity, mediaLang) => {
  if (!entity) {
    return '/';
  }

  // source
  if (entity.content_type === 'SOURCE') {
    return `/sources/${entity.id}`;
  }

  if (entity.content_type === 'POST') {
    const [blogID, postID] = entity.id.split('-');
    const blogName         = blogNames.get(parseInt(blogID, 10)) || 'laitman-co-il';

    return `/publications/blog/${blogName}/${postID}`;
  }

  // collections
  const collectionPrefix = collectionPrefixes.get(entity.content_type);
  if (collectionPrefix) {
    return `${collectionPrefix}${entity.id}`;
  }

  // units whose canonical collection is an event goes as an event item
  const collection = canonicalCollection(entity);
  if (collection && EVENT_TYPES.indexOf(collection.content_type) !== -1) {
    return `/events/cu/${entity.id}`;
  }

  const mediaLangSuffix = mediaLang ? `?language=${mediaLang}` : '';
  // unit based on type
  const prefix          = mediaPrefix.get(entity.content_type);
  if (prefix) {
    return `${prefix}${entity.id}${mediaLangSuffix}`;
  } else {
    return '/';
  }
};

/* WARNING!!!
   This function MUST be synchronized with the previous one: canonicalLink
 */
export const canonicalContentType = (entity) => {
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
