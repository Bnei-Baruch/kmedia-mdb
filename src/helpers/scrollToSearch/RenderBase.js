import {KEEP_LETTERS_RE, OFFSET_TEXT_SEPARATOR} from './helper';

export class RenderBase {
  tagPositions = [];

  constructor(data, start, end) {
    this.source = data.replace(/\r?\n|\r{1,}|\s{2,}/g, ' ');
    const sSplited = start.split(OFFSET_TEXT_SEPARATOR)
    const eSplited = end.split(OFFSET_TEXT_SEPARATOR)
    this.startPlace = sSplited[1]
    this.endPlace = eSplited[1]
    this.start = sSplited[0];
    this.end = eSplited[0];
  }

  build() {
    this.clearHtmlFromTags();
    this.defineMatch();
    return this.buildHtml();
  }

  clearHtmlFromTags() {
    let diff = 0;
    this.dataCleanHtml = this.source
      .replace(/<.+?>/g, (str, pos) => {
        this.tagPositions.push({str, pos, noHtmlPos: pos - diff});
        diff += str.length;
        return '';
      });
  }

  defineMatch() {
    const {start, end} = this.getMatches();
    if (!start || !end)
      return;

    this.matchStart = start;
    this.matchEnd = end;
  }


  getMatches() {
    const start = this.findClose(this.buildMatch(this.start, this.dataCleanHtml), this.startPlace);
    const end = this.findClose(this.buildMatch(this.end, this.dataCleanHtml), this.endPlace);
    return {start, end};
  };

  findClose(list, pos) {
    if (list.length === 0)
      return null;
    let result = list[0];
    let diff = Math.abs(result.index - pos);

    for (const x of list) {
      const nextDiff = Math.abs(x.index - pos);
      if (nextDiff > diff) {
        break;
      }
      diff = nextDiff;
      result = x;
    }
    return result;
  }

  buildMatch(search, data) {
    const words = search.replace(KEEP_LETTERS_RE, '.').split(' ').filter((word) => !!word);
    const re = new RegExp(words.map((word) => `(${word})`).join('(.{0,5})'), 'sg');
    return Array.from(data.matchAll(re), m => m);
  };


  buildHtml() {
    return this.source;
  }
}
