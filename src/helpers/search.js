import { ES_RESULT_TYPE_SOURCES, ES_RESULT_TYPE_TAGS } from './consts';

export class SuggestionsHelper {
  constructor(results) {
    this.suggestions = [];

    if (results && results.suggest && 'title_suggest' in results.suggest) {
      const query      = results.suggest.title_suggest[0].text;
      this.suggestions = results.suggest.title_suggest[0].options.map((option) => {
        const { text, _source: { title, result_type: resultType } } = option;
        const textParts                                             = text.split(' ');
        let splitChar                                               = null;
        if (resultType === ES_RESULT_TYPE_SOURCES) {
          splitChar = '>';
        } else if (resultType === ES_RESULT_TYPE_TAGS) {
          splitChar = '-';
        }
        // These !! are redundant, see https://eslint.org/docs/rules/no-extra-boolean-cast,
        // but we don't have tests, so...
        /* eslint no-extra-boolean-cast: "off" */
        const titleParts         = !!splitChar ? title.split(splitChar) : [title];
        const reversedTitleParts = titleParts.map(p => p.trim().split(' ').length).reverse();

        let suggestWords = 0;
        let reverseIdx   = 0;
        // Assume: length > 0 at start.
        // Total of reversedTitleParts equals to length.
        while (suggestWords < textParts.length) {
          suggestWords += reversedTitleParts[reverseIdx];
          reverseIdx++;
        }
        reverseIdx--;

        const titleWords              = title.split(' ');
        let suggestWordsWithSeparator = 0;
        while (suggestWords > 0) {
          if (titleWords[titleWords.length - 1 - suggestWordsWithSeparator] !== splitChar) {
            suggestWords--;
          }
          suggestWordsWithSeparator++;
        }

        return {
          part: reverseIdx,
          suggest: titleWords.slice(titleWords.length - suggestWordsWithSeparator).join(' '),
        };
      }).sort((a, b) => {
        if (a.part !== b.part) {
          return a.part - b.part;
        }
        if (a.suggest.startsWith(query) && !b.suggest.startsWith(query)) {
          return -1;
        }
        if (!a.suggest.startsWith(query) && b.suggest.startsWith(query)) {
          return 1;
        }
        return a.suggest.localeCompare(b.suggest);
      }).map(o => o.suggest);

      // remove duplicates (dedup)
      this.suggestions = Array.from(new Set(this.suggestions));
    }
  }

  getSuggestions() {
    return this.suggestions;
  }
}

const uidBytes = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const GenerateUID = (n) => {
  const ret = new Array(n);
  let times = n;
  while (times--) {
    ret[times] = uidBytes.charAt(Math.floor(Math.random() * uidBytes.length));
  }
  return ret.join('');
};

export const GenerateSearchId = () => GenerateUID(16);
