import { KEEP_LETTERS_RE } from './helper';

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

  buildMatch(search, data) {
    const words = search.replace(KEEP_LETTERS_RE, '.').split(' ').filter(word => !!word);
    const re    = new RegExp(words.map(word => `(${word})`).join('(.{0,5})'), 'sg');
    return Array.from(data.matchAll(re), m => m);
  };

  buildHtml() {
    return this.source;
  }
}
