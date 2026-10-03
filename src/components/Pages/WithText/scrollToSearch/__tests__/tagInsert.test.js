import { prepareScrollToSearch } from '../helper';

import { data, expected_withP, data_speedTest, expected_highlightBorder } from '../__fixtures__/tagInsert_data';

describe('Scroll to search, prepareScrollToSearch:', () => {

  test('test_data_separated_to_p', () => {
    const srchend     = 'readers seem to consider';
    const searchStart = 'Body and Soul';
    const result      = prepareScrollToSearch(data, { srchstart: searchStart, srchend }, true);
    expect(result).toEqual(expected_withP);
  });

  test('highlight_border', () => {
    const srchend     = 'readers seem to consider';
    const searchStart = 'Body and Soul';
    const result      = prepareScrollToSearch(data, { srchstart: searchStart, srchend }, false);
    expect(result).toEqual(expected_highlightBorder);
  });

  test('Speed_test', () => {
    const start = 'here to speak only through critique of empirical';
    const end   = 'reality from the perspective of provision';

    const nowStart = Date.now();
    // ~0.65ms/iteration on CircleCI with coverage instrumentation
    for (let i = 0; i < 10 * 1000; i++) {
      prepareScrollToSearch(data_speedTest, { srchstart: start, srchend: end }, true);
    }

    const nowEnd = Date.now();
    expect(nowEnd - nowStart).toBeLessThan(15000);
  });
});
