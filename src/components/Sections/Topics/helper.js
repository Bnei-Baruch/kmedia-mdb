import Link from '../../Language/MultiLanguageLink';

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
