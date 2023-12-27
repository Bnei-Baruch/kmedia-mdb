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
