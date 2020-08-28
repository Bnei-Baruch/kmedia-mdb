import { textToHtml, wrapSeekingPlace } from './helper';
import { RenderBase } from './RenderBase';

export class RenderHighlightAll extends RenderBase {

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
