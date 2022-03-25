import { sortRootsPosition } from '../components/Sections/Topics/TopicContainer';

export const getTree = (roots, getTagById, cuStats, t) => {
  const sorted = sortRootsPosition(roots);
  return (
    [
      {
        value: 'root',
        text: t('filters.topics-filter.all'),
        children: sorted ? sorted.map(x => buildNode(x, getTagById, cuStats)) : null,
      }
    ]);
};

const buildNode      = (id, getTagById, cuStats) => {
  const { label, children } = getTagById(id);
  return {
    value: id,
    text: label,
    count: cuStats ? cuStats[id] : null,
    children: children ? children.map(x => buildNode(x, getTagById, cuStats)) : null,
  };
};
