import MediaHelper from '../../../helpers/media';
import { physicalFile, isEmpty } from '../../../helpers/utils';
import { isTaas } from '../../shared/PDF/PDF';
import { OFFSET_TEXT_SEPARATOR, DOM_ROOT_ID } from './scrollToSearch/helper';

//it's not mus be accurate number (average number letters per line)
const LETTERS_ON_LINE = 20;

export function cuToSubject(cu) {
  const { id, files, content_type: type } = cu;
  const subject                           = { id, type, languages: [], files: [] };
  files.filter(f => MediaHelper.IsText(f) || MediaHelper.IsAudio(f))
    .forEach(f => {
      subject.languages.push(f.language);
      const isPdf = MediaHelper.IsPDF(f);
      const ext   = f.name.split('.').slice(-1)[0];

      const file = {
        ext,
        isPdf,
        url: physicalFile(f, !isPdf),
        name: f.name,
        id: f.id,
        language: f.language,
        type: f.type,
        insert_type: f.insert_type
      };
      subject.files.push(file);
    });
  return subject;
}

export const selectTextFile = (files, id, language) => {
  const _isTaas            = isTaas(id);
  const { pdf, docx, doc } = files
    .filter(f => MediaHelper.IsText(f))
    .filter(f => f.language === language)
    .reduce((acc, f) => {
      if (f.isPdf && _isTaas)
        acc.pdf = f;
      else if (f.ext === 'docx')
        acc.docx = f;
      else if (f.ext === 'doc')
        acc.doc = f;
      return acc;
    }, {});
  return pdf || docx || doc || {};
};

export const selectMP3 = (files, language) => {
  const f = files.find(f => f.language === language && MediaHelper.IsAudio(f));
  return f?.url;
};

export const checkRabashGroupArticles = source => {
  if (/^gr-/.test(source)) { // Rabash Group Articles
    const result = /^gr-(.+)/.exec(source);
    return { uid: result[1], isGr: true };
  }

  return { uid: source, isGr: false };
};

export const firstLeafId = (sourceId, getSourceById) => {
  const { children } = getSourceById(sourceId) || { children: [] };
  if (isEmpty(children)) {
    return sourceId;
  }

  return firstLeafId(children[0], getSourceById);
};

export const highlightByPrefixAndId = (prefixes, id, style) => {
  const elStart = document.getElementById(`${prefixes.start}${id}`);
  const elEnd   = document.getElementById(`${prefixes.end}${id}`);

  if (!elStart || !elEnd) return;

  const r = new Range();
  r.setStart(elStart, 0);
  r.setEnd(elEnd, 0);
  addHighlightByRanges([r], style);
};

export const addHighlightByRanges = (ranges, style = 'selected_marker') => {
  ranges = ranges.filter(x => !!x);

  if (!CSS.highlights.has(style)) {
    const highlight = new window.Highlight(...ranges);
    CSS.highlights.set(style, highlight);
  } else {
    const _highlights = CSS.highlights.get(style);
    ranges.forEach(r => _highlights.add(r));
  }
};

export const clearHighlightByStyle = (style = 'selected_marker') => {
  CSS.highlights.has(style) && CSS.highlights.get(style).clear();
};

export const deleteHighlightByRange = (range, style = 'selected_marker') => {
  CSS.highlights.has(style) && CSS.highlights.get(style).delete(range);
};

export const buildOffsets = markers => markers.map(({ properties: { srchstart, srchend } = {}, id }) => {
  const start = Math.round(Number(srchstart?.split(OFFSET_TEXT_SEPARATOR)[1]) / LETTERS_ON_LINE);

  const end = Math.round(Number(srchend?.split(OFFSET_TEXT_SEPARATOR)[1]) / LETTERS_ON_LINE);

  return {
    start: Math.min(start, end) || Math.max(start, end),
    end: Math.max(start, end),
    id
  };
}).reduce((acc, l, i, arr) => {
  const cross = arr.filter(x => !(x.start > l.end + 2 || x.end < l.start - 2));
  cross.sort((a, b) => (b.end - b.start) - (a.end - a.start));
  const x   = cross.findIndex(x => x.id === l.id);
  const y   = cross.filter(x => x.start - l.start === 0).findIndex(x => x.id === l.id);
  acc[l.id] = { x, y };
  return acc;
}, {});

export const prepareTextNodes = root => {
  const textNodes = [];

  const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

  let offset = 0;
  let node   = treeWalker.nextNode();
  while (node) {
    textNodes.push({ node, offset });
    offset += node.textContent.length;
    node = treeWalker.nextNode();
  }

  return textNodes;
};

export const searchOnPage = str => {
  const root = document.getElementById(DOM_ROOT_ID);
  if (!root) return [];

  const textNodes = prepareTextNodes(root);

  const reg     = new RegExp(str.split(' ').map(word => `(${word})`).join('(.{0,5})'), 'sgi');
  const matches = Array.from(root.textContent.matchAll(reg), m => m);

  const resp = [];
  matches.forEach(m => {
    let start, end;
    const range     = new Range();
    const endOffset = m.index + m[0].length;

    for (let i = 0; i < textNodes.length; i++) {
      const current = textNodes[i];
      if (!start && (current.offset > m.index || (textNodes.length - 1) === i)) {
        start   = true;
        let idx = Math.max(0, i - 1);
        idx     = textNodes.length - 1 === i ? i : idx;

        const prev = getPrevNode(idx, textNodes);
        if (!prev) continue;

        range.setStart(prev.node, m.index - prev.offset);
      }

      if (!end && (current.offset > endOffset || (textNodes.length - 1) === i)) {
        end        = true;
        const idx  = textNodes.length - 1 === i ? i : i - 1;
        const prev = getPrevNode(idx, textNodes);
        if (!prev) continue;

        range.setEnd(prev.node, endOffset - prev.offset);
      }

      if (start && end) break;
    }

    resp.push(range);
  });

  return resp;
};

const getPrevNode = (idx, textNodes) => {
  if (idx < 0)
    return null;

  const prev = textNodes[idx];
  if (prev.node.length < 2) {
    return getPrevNode(idx - 1, textNodes);
  }
  return prev;
};
