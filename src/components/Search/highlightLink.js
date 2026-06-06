export const HIGHLIGHT_LINK_WORDS_COUNT = 4;

export const clearHighlightTextForLink = str => str.replace(/(\r?\n|\r){1,}/g, ' ').replace(/<.+?>/gi, '');

export const buildHighlightSearchQuery = highlight => {
  const searchArr = clearHighlightTextForLink(highlight).split(' ').map(word => word.trim()).filter(Boolean);
  if (searchArr.length === 0) {
    return null;
  }

  return {
    srchstart   : searchArr.slice(0, HIGHLIGHT_LINK_WORDS_COUNT).join(' '),
    srchend     : searchArr.slice(-1 * HIGHLIGHT_LINK_WORDS_COUNT).join(' '),
    highlightAll: true
  };
};
