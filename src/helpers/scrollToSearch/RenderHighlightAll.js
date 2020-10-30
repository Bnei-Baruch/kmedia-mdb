import { textToHtml, wrapSeekingPlace } from './helper';
import { RenderBase } from './RenderBase';

export class RenderHighlightAll extends RenderBase {
  getMatches() {
    const sMatch = this.buildMatch(this.start, this.dataCleanHtml);
    const eMatch = this.buildMatch(this.end, this.dataCleanHtml);
    return this.findClose(sMatch, eMatch);
  };

  findClose(sMatch, eMatch) {
    if (sMatch.length === 0 || eMatch.length === 0)
      return { start: null, end: null };
    let start = null, end = null;
    let diff  = 0;
    for (const s of sMatch) {
      for (const e of eMatch) {
        const d = e.index - s.index;
        if (d < diff) {
          diff  = d;
          start = s;
          end   = e;
        }
      }
    }
    return { start, end };
  }

  buildHtml() {
    if (!this.matchStart || !this.matchEnd) {
      return this.source;
    }
    const from = this.matchStart.index;
    const to   = this.matchEnd.index + this.matchEnd[0].length;

    if (!from || !to)
      return this.source;

    const innerCleanHtml = this.dataCleanHtml.slice(from, to);

    const { before, after } = wrapSeekingPlace(this.source, this.tagPositions, from, to);
    const inner             = textToHtml(innerCleanHtml, from, to, this.tagPositions);
    return `${before}${inner}${after}`;
  }
}
