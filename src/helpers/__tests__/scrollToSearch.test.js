import { prepareScrollToSearch } from '../utils';
import {
  data,
  expected,
  data_withTagInEnd,
  expected_withTagInEnd,
  data_withTagInMiddle,
  expected_withTagInMiddle,
  data_withP,
  expected_withP
} from './scrollToSearchData';

describe('Scroll to search, prepareScrollToSearch:', () => {
  const defSearchStart = 'Before I clarify';
  const defSearchEnd   = 'readers seem to consider';

  test('simple test', () => {
    const result = prepareScrollToSearch(data, defSearchStart, defSearchEnd);
    expect(result).toEqual(expected);
  });

  test('test data with html in the end', () => {
    const result = prepareScrollToSearch(data_withTagInEnd, defSearchStart, defSearchEnd);
    expect(result).toEqual(expected_withTagInEnd);
  });

  test('test data with html in the middle', () => {
    const result = prepareScrollToSearch(data_withTagInMiddle, defSearchStart, defSearchEnd);
    expect(result).toEqual(expected_withTagInMiddle);
  });

  test('test data separated to p', () => {
    const searchStart = 'Body and Soul';
    const result      = prepareScrollToSearch(data, searchStart, defSearchEnd);
    expect(result).toEqual(expected_withP);
  });
});
