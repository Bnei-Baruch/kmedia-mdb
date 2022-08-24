import { prepareScrollToSearch } from '../helper';

import { data } from './base_data';

const srchstart = 'dedicated myself to it';
const srchend   = 'dedicated myself to it';
const expected  = '<div>  <div class="scroll-to-search" id="__scrollSearchToHere__"><p>  <strong>Kabbalah and <em class="_h _b">dedicated</em> <em class="_h _b">myself</em> <em class="_h _b">to</em> <em class="_h _b">it</em></strong><em class="_h _b"></em>  </p></div>  <p>  <strong>Before I clarify this exalted matter, it is important for me to note that although all the readers seem</strong>  </p> </div>';

describe('Select less then 5 words', () => {

  test('reproduse bug', () => {
    const result = prepareScrollToSearch(data, { srchstart, srchend }, false);
    expect(result).toEqual(expected);
  });

});
