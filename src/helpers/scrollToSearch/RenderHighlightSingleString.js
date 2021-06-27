import { OFFSET_TEXT_SEPARATOR, textToHtml, wrapSeekingPlace } from './helper';
import { RenderBase } from './RenderBase';

export class RenderHighlightSingleString extends RenderBase {
  constructor(data, search) {
    const splited = search.split(OFFSET_TEXT_SEPARATOR);
    super(data, splited[0], null);
    this.place = splited[1];

  }

  defineMatch() {
    const match = this.getMatches();
    if (!match)
      return;

    this.match = match;
  }

  getMatches() {
    return this.findClose(this.buildMatch(this.start, this.dataCleanHtml));
  };

  findClose(matches) {
    if (matches.length === 0)
      return null;
    let match = matches[0];
    let diff  = Math.abs(match.index - this.place);

    for (const m of matches) {
      const d = Math.abs(m.index - this.place);
      if (d > diff) {
        diff  = d;
        match = m;
      }
    }

    return match;
  }

  buildHtml() {
    if (!this.match) {
      return this.source;
    }

    const from = this.match.index;
    const to   = this.match.index + this.match[0].length;

    if (!from || !to)
      return this.source;

    const innerCleanHtml = this.dataCleanHtml.slice(from, to);

    const { before, after } = wrapSeekingPlace(this.source, this.tagPositions, from, to);
    const inner             = textToHtml(innerCleanHtml, from, to, this.tagPositions);
    return `${before}${inner}${after}`;
  }
}
