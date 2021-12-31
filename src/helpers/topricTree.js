import {TOPICS_FOR_DISPLAY} from "./consts";

export const getTree = (roots, getTagById, cuStats, t) => (
  [
    {
      value: 'root',
      text: t('filters.topics-filter.all'),
      children: roots
        ? roots
          .filter(x => TOPICS_FOR_DISPLAY.indexOf(x) !== -1)
          .map(x => buildNode(x, getTagById, cuStats))
        : null,
    }
  ]);

const buildNode = (id, getTagById, cuStats) => {
  const { label, children } = getTagById(id);
  return {
    value: id,
    text: label,
    count: cuStats ? cuStats[id] : null,
    children: children ? children.map(x => buildNode(x, getTagById, cuStats)) : null,
  };
};
