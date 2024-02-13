import { RH_ZOHAR, BS_TAAS } from '../../../helpers/consts';
import { getIndex } from './TOC/TOC';

export const getFullPath = (sourceId, getPathByID) => {
  // Go to the root of this sourceId
  if (!getPathByID) {
    return [{ id: '0' }, { id: sourceId }];
  }

  const path = getPathByID(sourceId);

  if (!path || path.length < 2 || !path[1]) {
    return [{ id: '0' }, { id: sourceId }];
  }

  return path;
};

export const properParentId = path => (path[1].id);

export const fixPrevNextZoharTaas = (path, getSourceById, increment = 1) => {
  if (path[1]?.id !== RH_ZOHAR && path[1]?.id !== BS_TAAS) return null;
  const parentIdx = getIndex(path[1], path[2]);
  const newParent = getSourceById(path[1].children[parentIdx + increment]);
  return newParent?.children[increment > 0 ? 0 : newParent.children.length - 1];
};
