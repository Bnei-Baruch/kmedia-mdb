import { insertAdded } from './helper';
import { RenderBase } from './RenderBase';

export class RenderNoSearch extends RenderBase {
  constructor(data) {
    super(data, null, null);
  }

  getMatches() {
    return false;
  };

  findClose(list, pos) {
    if (list.length === 0)
      return pos;
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
    const res = insertAdded(this.source, this.tagPositions, 0, -1);
    return res;
  }
}
