export const searchOnPage = (str, root) => {
  const ranges = [];
  const regexp = new RegExp(str, 'g');
  if (root.nodeType === Node.TEXT_NODE) {
    const matches = root.textContent.matchAll(regexp);
    for (const match of matches) {
      const r = new Range();
      r.setStart(root, match.index);
      r.setEnd(root, match.index + match[0].length);
      ranges.push(r);
    }

    return ranges;
  }

  if (root.childNodes.length < 1) {
    return ranges;
  }

  for (const n of root.childNodes) {
    const _rang = searchOnPage(str, n);
    ranges.push(..._rang);
  }

  return ranges;
};
