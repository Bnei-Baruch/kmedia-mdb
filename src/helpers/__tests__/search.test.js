import { ES_RESULT_TYPE_SOURCES, ES_RESULT_TYPE_TAGS } from '../consts';
import { localeCompareWithYear, SuggestionsHelper } from '../search';

const buildResults = (query, options) => {
  const results                            = {
    suggest: {
      title_suggest: [{
        offset: 0,
        length: 1,
        text: query,
        options: [{ text: 'one', _source: { title: 'one is the best' } }]
      }]
    }
  };
  results.suggest.title_suggest[0].options = options.map(o => ({
    text: o.text,
    _source: { result_type: o.result_type, title: o.title }
  }));
  return results;
};

describe('SuggestionsHelper', () => {
  test('simple', () => {
    const sh = new SuggestionsHelper(buildResults('2', [
      { text: '2 3', title: '1 > 2 > 3', result_type: ES_RESULT_TYPE_SOURCES },
      { text: '2', title: '1 > 2', result_type: ES_RESULT_TYPE_SOURCES },
    ]));
    expect(sh.getSuggestions()).toEqual(['2', '2 > 3']);
  });

  test('simple same level', () => {
    const sh = new SuggestionsHelper(buildResults('2', [
      { text: '2 3', title: '1 > 2 > 3', result_type: ES_RESULT_TYPE_SOURCES },
      { text: '2', title: '1 > 2', result_type: ES_RESULT_TYPE_SOURCES },
      { text: '2 a', title: '3 > 2 a', result_type: ES_RESULT_TYPE_SOURCES },
    ]));
    expect(sh.getSuggestions()).toEqual(['2', '2 a', '2 > 3']);
  });

  test('simple dash', () => {
    const sh = new SuggestionsHelper(buildResults('2', [
      { text: '2 3', title: '1 - 2 - 3', result_type: ES_RESULT_TYPE_TAGS },
      { text: '2', title: '1 - 2', result_type: ES_RESULT_TYPE_TAGS },
    ]));
    expect(sh.getSuggestions()).toEqual(['2', '2 - 3']);
  });

  test('less then with dash', () => {
    const sh = new SuggestionsHelper(buildResults('3', [
      { text: '3 - nice', title: '1 > 2 > 3 - nice', result_type: ES_RESULT_TYPE_SOURCES },
    ]));
    expect(sh.getSuggestions()).toEqual(['3 - nice']);
  });

  test('partial match', () => {
    const sh = new SuggestionsHelper(buildResults('shamati none', [
      {
        text: 'shamati > there is none one else beside him',
        title: 'bs > book of shamati > there is none one else beside him',
        result_type: ES_RESULT_TYPE_SOURCES
      },
    ]));
    expect(sh.getSuggestions()).toEqual(['book of shamati > there is none one else beside him']);
  });

  test('order', () => {
    const sh = new SuggestionsHelper(buildResults('a d', [
      { text: 'a b 3 c d', title: '1 > 2 a b > 3 c d', result_type: ES_RESULT_TYPE_SOURCES },
      { text: 'a c d', title: '1 > 2 > a c d', result_type: ES_RESULT_TYPE_SOURCES },
    ]));
    expect(sh.getSuggestions()).toEqual(['a c d', '2 a b > 3 c d']);
  });

  test('prefix', () => {
    const sh = new SuggestionsHelper(buildResults('21', [
      { text: '21 3', title: '1 > 1 21 > 3', result_type: ES_RESULT_TYPE_SOURCES },
      { text: '21 1 3', title: '1 > 21 1 > 3', result_type: ES_RESULT_TYPE_SOURCES },
    ]));
    expect(sh.getSuggestions()).toEqual(['21 1 > 3', '1 21 > 3']);
  });

  test('dedup', () => {
    const sh = new SuggestionsHelper(buildResults('21', [
      { text: '21 3', title: '1 > 1 21 > 3', result_type: ES_RESULT_TYPE_SOURCES },
      { text: '21 3', title: '1 > 1 21 > 3', result_type: ES_RESULT_TYPE_SOURCES },
    ]));
    expect(sh.getSuggestions()).toEqual(['1 21 > 3']);
  });

  test('sort with year', () => {
    const sh = new SuggestionsHelper(buildResults('21', [
      { text: 'los angeles 2016', title: 'Convention in Los Angeles 2016' },
      { text: 'los angeles 2014', title: 'Convention in Los Angeles 2014' },
      { text: 'Los Angeles “Day Two” – 11.01.14', title: 'Convention In Los Angeles “Day Two” – 11.01.14' },
      { text: 'los angeles 2010', title: 'Convention in Los Angeles 2009' },
      { text: 'los angeles 2010', title: 'Convention in Los Angeles 2007' },
      { text: 'Los Angeles “Day Two” – 16.01.14', title: 'Convention In Los Angeles “Day Two” – 16.01.14' },
      { text: 'los angeles 2010', title: 'Convention in Los Angeles 2008' },
      { text: 'los angeles 2010', title: 'Convention in Los Angeles 2010' },
      { text: 'los angeles 2017', title: 'Convention in Los Angeles 2017' },
      { text: 'los angeles 2015', title: 'Convention in Los Angeles 2015' },
    ]));
    expect(sh.getSuggestions()).toEqual([
      'Convention In Los Angeles “Day Two” – 11.01.14',
      'Convention In Los Angeles “Day Two” – 16.01.14',
      'Convention in Los Angeles 2017',
      'Convention in Los Angeles 2016',
      'Convention in Los Angeles 2015',
      'Convention in Los Angeles 2014',
      'Convention in Los Angeles 2010',
      'Convention in Los Angeles 2009',
      'Convention in Los Angeles 2008',
      'Convention in Los Angeles 2007'
    ]);
  });
});
