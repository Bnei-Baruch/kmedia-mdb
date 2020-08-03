import { getPositionInHtml, textToHtml, wrapSeekingPlace } from './helper';
import { RenderBase } from './RenderBase';

export class RenderHighlightBorder extends RenderBase {

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
    const innerAfter        = this.prepareHighlightedPart(fromEnd, toEnd);

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
