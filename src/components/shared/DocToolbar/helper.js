//it's not mus be accurate number (average number letters per line)
import { OFFSET_TEXT_SEPARATOR } from '../../../helpers/scrollToSearch/helper';

const LETTERS_ON_LINE = 20;

export const buildOffsets = labels => labels.map(({ properties: { srchstart, srchend } = {}, id }) => {
  let start = Math.round(Number(srchstart?.split(OFFSET_TEXT_SEPARATOR)[1]) / LETTERS_ON_LINE);
  start     = Math.round(start / LETTERS_ON_LINE);

  let end = Math.round(Number(srchend?.split(OFFSET_TEXT_SEPARATOR)[1]) / LETTERS_ON_LINE);
  end     = Math.round(end / LETTERS_ON_LINE);

  return {
    start: Math.min(start, end) || Math.max(start, end),
    end: Math.max(start, end),
    id
  };
}).reduce((acc, l, i, arr) => {
  const cross = arr.filter(x => !(x.start > l.end + 2 || x.end < l.start - 2));
  cross.sort((a, b) => (b.end - b.start) - (a.end - a.start));
  const x   = cross.findIndex(x => x.id === l.id);
  const y   = cross.filter(x => x.start - l.start === 0).findIndex(x => x.id === l.id);
  acc[l.id] = { x, y };
  return acc;
}, {});
