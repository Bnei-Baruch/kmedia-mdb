import { FN_CONTENT_TYPE, FN_DATE_FILTER, FN_LANGUAGES, FN_SOURCES_MULTI } from '../../../helpers/consts';
import Link from '../../Language/MultiLanguageLink';

export const TAG_DASHBOARD_FILTERS = [FN_SOURCES_MULTI, FN_CONTENT_TYPE, FN_LANGUAGES, FN_DATE_FILTER];

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
