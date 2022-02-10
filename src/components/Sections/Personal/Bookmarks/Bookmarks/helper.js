import {
  CT_DAILY_LESSON,
  CT_LESSON_PART,
  CT_LIKUTIM,
  CT_SOURCE,
  UNIT_VIDEOS_TYPE
} from '../../../../../helpers/consts';
import { cuPartNameByCCUType } from '../../../../../helpers/utils';
import { canonicalLink } from '../../../../../helpers/links';
import { stringify } from '../../../../../helpers/url';

export const buildTitleByUnit = (cu, t, getPathByID) => {

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
    return name;
  }

  const collection = Object.values(collections)[0];
  const part       = Number(collection?.ccuNames[cu.id]);
  const partName   = t(cuPartNameByCCUType(content_type), { name: part });
  return `${collection.name} ${partName} (${t('values.date', { date: film_date })})`;
};

export const buildBookmarkLink = (bookmark, cu) => {
  if (!bookmark?.properties)
    return canonicalLink(cu);

  const { properties: { uid_prefix, ...urlParams } } = bookmark;

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
