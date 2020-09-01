import { getMatches } from './helper';

export class RenderBase {
  tagPositions = [];

  constructor(data, start, end) {
    this.source = data.replace(/\r?\n|\r{1,}|\s{2,}/g, ' ');
    this.start  = start;
    this.end    = end;
  }

  build() {
    this.clearHtmlFromTags();
    this.defineMatch();
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
    const { start, end } = getMatches(this.dataCleanHtml, this.start, this.end);
    if (!start || !end)
      return;

    this.matchStart = start;
    this.matchEnd   = end;
  }

  buildHtml() {
    return this.source;
  }
}
