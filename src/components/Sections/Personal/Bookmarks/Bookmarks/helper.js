import { CT_LIKUTIM, CT_SOURCE } from '../../../../../helpers/consts';
import { cuPartNameByCCUType } from '../../../../../helpers/utils';

export const buildTitleByUnit = (cu, t, getPathByID) => {

  if (!cu) return '';

  const { content_type, film_date, collections, name } = cu;

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
  return `${collection.name} ${partName} ${t('values.date', { date: film_date })}`;
};

