import { getPositionInHtml, OFFSET_TEXT_SEPARATOR, textToHtml, wrapSeekingPlace } from './helper';
import { RenderBase } from './RenderBase';

export class RenderHighlightBorder extends RenderBase {

  constructor(data, start, end) {
    const sSplited = start.split(OFFSET_TEXT_SEPARATOR);
    const eSplited = end.split(OFFSET_TEXT_SEPARATOR);

    super(data, sSplited[0], eSplited[0]);
    this.startPlace = sSplited[1];
    this.endPlace   = eSplited[1];

  }

  getMatches() {
    const start = this.findClose(this.buildMatch(this.start, this.dataCleanHtml), this.startPlace);
    const end   = this.findClose(this.buildMatch(this.end, this.dataCleanHtml), this.endPlace);
    return { start, end };
  };

  findClose(list, pos) {
    if (list.length === 0)
      return null;
    let result = list[0];
    let diff   = Math.abs(result.index - pos);

    for (const x of list) {
      const nextDiff = Math.abs(x.index - pos);
      if (nextDiff > diff) {
        break;
      }
      diff   = nextDiff;
      result = x;
    }
    return result;
  }

  buildHtml() {
    if (!this.matchStart || !this.matchEnd) {
      return this.source;
    }
    const fromStart = this.matchStart.index;
    const toStart   = this.matchStart.index + this.matchStart[0].length;
    const fromEnd   = this.matchEnd.index;
    const toEnd     = this.matchEnd.index + this.matchEnd[0].length;

    if (!fromStart || !fromEnd)
      return this.source;

    const { before, after } = wrapSeekingPlace(this.source, this.tagPositions, fromStart, toEnd);
    const innerBefore       = this.prepareHighlightedPart(fromStart, toStart);
    const innerAfter        = this.matchStart.index !== this.matchEnd.index ? this.prepareHighlightedPart(fromEnd, toEnd) : '';

    return `${before}${innerBefore}${this.notHighLightedInner(toStart, fromEnd)}${innerAfter}${after}`;
  }

  prepareHighlightedPart(from, to) {
    const cleanHtml = this.dataCleanHtml.slice(from, to);
    return textToHtml(cleanHtml, from, to, this.tagPositions);
  }

  notHighLightedInner(fromNoHtml, toNoHtml) {
    const from = getPositionInHtml(fromNoHtml, this.tagPositions);
    const to   = getPositionInHtml(toNoHtml, this.tagPositions);
    return this.source.slice(from, to);
  }
}
