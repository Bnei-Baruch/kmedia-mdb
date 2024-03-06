import { sortRootsPosition } from '../components/Sections/Topics/TopicContainer';
import { getEscapedRegExp } from './utils';

export const getTree = (roots, getTagById, cuStats, match, t) => {
  const sorted   = sortRootsPosition(roots);
  const children = sorted ? sorted.map(x => buildNode(x, getTagById, cuStats, match)) : [];
  const matched  = children.some(x => x.matched);

  return (
    [
      {
        value: 'root',
        text: t('filters.topics-filter.all'),
        matched,
        children,
      }
    ]);
};

const buildNode = (id, getTagById, cuStats, match = '') => {
  const { label, children: leafs } = getTagById(id);

  const children = leafs ? leafs.map(x => buildNode(x, getTagById, cuStats, match)) : [];
  const regExp   = getEscapedRegExp(match);
  const matched  = !match || (label && regExp.test(label)) || children.some(x => x.matched);

  return {
    value: id,
    text: label,
    matched,
    count: cuStats ? cuStats[id] : null,
    children,
  };
};
