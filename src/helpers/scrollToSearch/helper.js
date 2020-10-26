import { SCROLL_SEARCH_ID } from '../consts';
import { stringify } from '../url';
import { RenderHighlightAll } from './RenderHighlightAll';
import { RenderHighlightBorder } from './RenderHighlightBorder';

/* eslint-disable  no-useless-escape */
export const KEEP_LETTERS_RE            = /[".,\/#!$%\^&\*;:{}=\-_`~()\[\]]/g;
export const KEEP_LETTERS_WITH_SPACE_RE = /[".,\/#!$%\^&\*;:{}=\-_`~()\[\]\s]/g;

export const OFFSET_TEXT_SEPARATOR = ':$:';

/***
 * help functions for render html
 */
export const prepareScrollToSearch = (data, { srchstart: start, srchend: end }, highlightAll = false) => {
  if (!start?.length || !end?.length) {
    return data;
  }
  let render;
  if (highlightAll)
    render = new RenderHighlightAll(data, start, end);
  else
    render = new RenderHighlightBorder(data, start, end);
  return render.build();
};

export const getPositionInHtml = (pos, tags) => {
  return tags
    .filter(t => t.noHtmlPos <= pos)
    .reduce((acc, t) => {
      return acc + t.str.length;
    }, pos);
};

export const filterTagsByBorder = (from, to, tags) => {
  const result = [];
  let diff     = 0;
  for (const p of tags) {
    diff += p.str.length;

    const tagEndP = p.pos + p.str.length;
    const startP  = from + diff;
    const endP    = to + diff;

    if (tagEndP >= endP) {
      continue;
    }

    to = endP;

    if (tagEndP <= startP) {
      from = startP;
      continue;
    }

    result.push(p);
  }
  return { tagsPositionInner: result, from, to };
};

export const textToHtml = (source, from, to, allTags) => {
  let currentPos = from;
  return source
    .split(' ')
    .map((word) => {

      const tags = allTags
        .filter((t, i) => currentPos < t.noHtmlPos && currentPos + word.length + 1 >= t.noHtmlPos);
      currentPos += word.length + 1;

      if (tags.length === 0)
        return word.length === 0 ? '' : `<em class="_h">${word}</em>`;

      if (word.length === 0)
        return tags.map(t => t.str).join('');

      const r = tags.reduce((acc, t, i) => {
        const p                      = t.noHtmlPos - from;
        let { prevPosition, result } = acc;
        if (p !== 0) {
          const s = word.slice(prevPosition, p);
          prevPosition += s.length;
          result.push(`<em class="_h">${s}</em>`);
        }
        result.push(t.str);
        if (i === tags.length - 1) {
          result.push(`<em class="_h">${word.slice(p)}</em>`);
        }

        return { prevPosition, result };
      }, { prevPosition: 0, result: [] });
      return r.result.join('');
    }).join(' ');
};

export const wrapSeekingPlace = (data, tags, fromNohtml, toNoHtml) => {
  const from = getPositionInHtml(fromNohtml, tags);
  const to   = getPositionInHtml(toNoHtml, tags);

  let openTagP;
  let closeTagP;
  let i = tags.length;
  while (!(openTagP && closeTagP) && i >= 1) {
    i--;

    if (!openTagP) {
      const tagDown = tags[i];
      if (tagDown.pos < from && tagDown.str.search(/<p|<h/) !== -1) {
        openTagP = tagDown;
      }
    }

    if (!closeTagP) {
      const tagUp = tags[tags.length - (i + 1)];
      if (tagUp.pos > to && tagUp.str.search(/<\/p>|<\/h\d>/) !== -1) {
        closeTagP = tagUp;
      }
    }
  }
  openTagP  = openTagP ?? tags[0];
  closeTagP = closeTagP ?? tags[tags.length - 1];

  let before = data.slice(0, openTagP.pos);
  before += data.slice(openTagP.pos, from).replace(/<p|<h/, x => `<div class="scroll-to-search" id="${SCROLL_SEARCH_ID}">${x}`);

  let after = data.slice(to, closeTagP.pos);
  after += data.slice(closeTagP.pos).replace(/<\/p>|<\/h\d>/, x => x + '</div>');

  return { before, after };
};

/***
 * help functions for build link
 */
export const DOM_ROOT_ID                  = 'roodNodeOfShareText';
export const buildSearchLinkFromSelection = (language) => {
  if (!window?.getSelection) {
    return { url: null };
  }
  const sel = window.getSelection();
  if (sel.isCollapsed || !sel.anchorNode || !sel.focusNode) {
    return { url: null };
  }
  const isForward = isSelectionForward(sel);

  const words                                  = sel.toString().replace(/\r?\n|\r{1,}/g, ' ').split(' ');
  const { protocol, hostname, port, pathname } = window.location;
  let sStart                                   = words.slice(0, 5).join(' ');
  let sEnd                                     = words.slice(-5).join(' ');

  let start = isForward ? { node: sel.anchorNode, offset: sel.anchorOffset }
    : { node: sel.focusNode, offset: sel.focusOffset };

  let end = isForward ? { node: sel.focusNode, offset: sel.focusOffset }
    : { node: sel.anchorNode, offset: sel.anchorOffset };

  const sOffset = findOffsetOfDOMNode(start.node, start.offset);
  const eOffset = findOffsetOfDOMNode(end.node, end.offset);

  if (sOffset === null || eOffset === null)
    return { url: null, text: null };

  const query = {
    srchstart: wholeStartWord(start.node.textContent, start.offset) + sStart + OFFSET_TEXT_SEPARATOR + sOffset,
    srchend: sEnd + wholeEndWord(end.node.textContent, end.offset) + OFFSET_TEXT_SEPARATOR + eOffset
  };

  if (language) {
    query.language = language;
  }
  const url = `${protocol}//${hostname}${port ? `:${port}` : ''}${pathname}?${stringify(query)}`;
  return { url, text: sel.toString() };
};

const findOffsetOfDOMNode = (node, offset) => {
  offset += countOffsetFromParent(node);
  const parent = node.parentNode;
  if (parent.nodeName.toLowerCase() === 'body')
    return null;
  if (parent.id === DOM_ROOT_ID)
    return offset;

  return findOffsetOfDOMNode(parent, offset);
};

const countOffsetFromParent = (node) => {
  let offset = 0;
  for (; node.previousSibling !== null;) {
    offset += node.previousSibling.textContent.length;
    node = node.previousSibling;
  }
  return offset;
};

const wholeStartWord = (text, offset) => {
  if (offset === 0 || KEEP_LETTERS_WITH_SPACE_RE.test(text[offset - 1]))
    return '';
  return text.slice(0, offset).split(KEEP_LETTERS_WITH_SPACE_RE).slice(-1);
};

const wholeEndWord = (text, offset) => {
  if (offset === 0 || KEEP_LETTERS_WITH_SPACE_RE.test(text[offset]))
    return '';
  return text.slice(offset).split(KEEP_LETTERS_WITH_SPACE_RE)[0];
};

const isSelectionForward = (sel) => {
  const range = document.createRange();
  range.setStart(sel.anchorNode, sel.anchorOffset);
  range.setEnd(sel.focusNode, sel.focusOffset);
  const res = !range.collapsed;
  range.detach();
  return res;
};
