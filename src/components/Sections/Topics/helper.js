import Link from '../../Language/MultiLanguageLink';

export const getBreadCrumbSection = (p, index, arr) => {
  if (!p) return null;
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

// "Topics › Parent › Topic. A collection of all items for a selected topic." — unique per topic.
export const topicDescription = (sections, t) =>
  `${sections.map(s => s?.content).filter(Boolean).join(' › ')}. ${t('topics.header.subtext')}`;

// The active breadcrumb item is the page title → <h1>, styled like the surrounding breadcrumb text
// (unlayered h1 rules set font-family/margins, hence the ! utilities).
export const TOPIC_H1_CLASS = 'inline m-0! text-[length:inherit]! font-bold leading-[inherit]! [font-family:inherit]!';
