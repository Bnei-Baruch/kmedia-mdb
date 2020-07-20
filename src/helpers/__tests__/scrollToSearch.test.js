import { prepareScrollToSearch, wrapSeekingPlace } from '../utils';
import {
  data,
  tagsPosition_data,
  expected,
  data_withTagInEnd,
  expected_withTagInEnd,
  data_withTagInMiddle,
  expected_withTagInMiddle,
  /*data_withP,*/
  expected_withP, expected_wrapped_after, expected_wrapped_before, data_speedTest
} from './scrollToSearchData';

describe('Scroll to search, prepareScrollToSearch:', () => {
  const srchstart = 'Before I clarify';
  const srchend   = 'readers seem to consider';

  test('simple test', () => {
    const result = prepareScrollToSearch(data, { srchstart, srchend });
    expect(result).toEqual(expected);
  });

  test('test data with html in the end', () => {
    const result = prepareScrollToSearch(data_withTagInEnd, { srchstart, srchend });
    expect(result).toEqual(expected_withTagInEnd);
  });

  test('test data with html in the middle', () => {
    const result = prepareScrollToSearch(data_withTagInMiddle, { srchstart, srchend });
    expect(result).toEqual(expected_withTagInMiddle);
  });

  test('test data separated to p', () => {
    const searchStart = 'Body and Soul';
    const result      = prepareScrollToSearch(data, { srchstart: searchStart, srchend });
    expect(result).toEqual(expected_withP);
  });
});

describe('Scroll to search, wrapSeekingPlace:', () => {

  const from = data.indexOf('and Soul');
  const end  = 'it is important for me';
  const to   = data.indexOf(end) + end.length;

  test('simple test', () => {
    const { before, after } = wrapSeekingPlace(data, tagsPosition_data, from, to);
    expect(before).toEqual(expected_wrapped_before);
    expect(after).toEqual(expected_wrapped_after);

  });

});

describe('Speed test', () => {

  const srchstart = 'here to speak only through critique of empirical';
  const srchend   = 'reality from the perspective of provision';

  test('simple test', () => {
    const nowStart = Date.now();
    for (let i = 0; i < 100 * 1000; i++) {
      prepareScrollToSearch(data_speedTest, { srchstart, srchend });
    }

    const nowEnd = Date.now();
    expect(nowEnd - nowStart).toBeLessThan(1000);
  });

});
