import { KEEP_LETTERS_RE, OFFSET_TEXT_SEPARATOR } from './helper';

export class RenderBase {
  tagPositions = [];

  constructor(data, start, end) {
    this.source = data.replace(/\r?\n|\r{1,}|\s{2,}|&nbsp;{1,}/g, ' ');
    this.start  = start;
    this.end    = end;
  }

  build(labels) {
    this.clearHtmlFromTags();
    this.defineMatch();
    this.insertLabels(labels);
    return this.buildHtml();
  }

  clearHtmlFromTags() {
    let diff           = 0;
    this.dataCleanHtml = this.source
      .replace(/<.+?>/g, (str, pos) => {
        this.tagPositions.push({ str, pos, noHtmlPos: pos - diff });
        diff += str.length;
        return '';
      });
  }

  defineMatch() {
    const { start, end } = this.getMatches();
    if (!start || !end)
      return;

    this.matchStart = start;
    this.matchEnd   = end;
  }

  getMatches() {
    throw new Error('abstract method');
  };

  findClose(list, pos) {
    throw new Error('abstract method');
  }

  insertLabels(labels) {
    if (!labels?.length)
      return;
    const lPositions = labels.reduce((acc, { properties: { srchstart, srchend } = {}, id }) => {
      const start = srchstart?.split(OFFSET_TEXT_SEPARATOR);
      if (start) {
        const match     = this.findClose(this.buildMatch(start[0], this.dataCleanHtml), start[1]);
        const noHtmlPos = match?.index - 1;
        acc.push({ str: `<span class="label_pos" id="start_${id}"></span>`, noHtmlPos, isAdded: true });
      }

      const end = srchend?.split(OFFSET_TEXT_SEPARATOR);
      if (end) {
        const match     = this.findClose(this.buildMatch(end[0], this.dataCleanHtml), end[1]);
        const noHtmlPos = match?.index + end[0].length + 1;
        acc.push({ str: `<span class="label_pos" id="end_${id}"></span>`, noHtmlPos, isAdded: true });
      }

      return acc;
    }, []);
    lPositions.sort((a, b) => a.noHtmlPos - b.noHtmlPos);

    const len          = lPositions.length + this.tagPositions.length;
    const tagPositions = [];
    let diffp          = 0, diffl = 0;
    for (let i = 0, j = 0; i + j < len;) {
      const ti = this.tagPositions[i];
      const lj = lPositions[j];
      if (!lj || (ti && ti.noHtmlPos <= lj.noHtmlPos)) {
        tagPositions.push(ti);
        i++;
        diffp = diffp + ti.str.length;
        continue;
      }

      //if prev tag was close </p>|</h*> we replace them
      const prevPos = i + j - 1;
      const prevT   = tagPositions[prevPos > 0 ? prevPos : 0];
      if (prevT && (prevT.str.search(/<\/p>|<\/h\d>/) !== -1 && prevT.noHtmlPos > lj.noHtmlPos - 1)) {
        lj.pos = prevT.pos - 1;
      } else {
        lj.pos = lj.noHtmlPos + diffp;
      }

      tagPositions.push(lj);
      j++;
      diffl = diffl + lj.str.length;
    }

    tagPositions.sort((a, b) => a.pos - b.pos);
    this.tagPositions = tagPositions;
  }

  buildMatch(search, data) {
    const words = search.replace(KEEP_LETTERS_RE, '.').split(' ').filter(word => !!word);
    const re    = new RegExp(words.map(word => `(${word})`).join('(.{0,5})'), 'sg');
    return Array.from(data.matchAll(re), m => m);
  };

  buildHtml() {
    return this.source;
  }
}
