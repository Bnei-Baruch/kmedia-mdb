import { UNIT_VIDEOS_TYPE } from '../../helpers/consts';
import { stringify } from '../../helpers/url';

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

export const buildHighlightLinkTarget = (to, highlight, contentType) => {
  const search = buildHighlightSearchQuery(highlight);
  if (!search) {
    return null;
  }

  // Player pages default to the playlist tab on mobile, so transcript deep links must open the text tab first.
  const textTabSearch = UNIT_VIDEOS_TYPE.includes(contentType)
    ? stringify({ activeTab: 'transcription', autoPlay: 0 })
    : '';

  return {
    ...to,
    search: [to.search, textTabSearch, stringify(search)].filter(Boolean).join('&')
  };
};
