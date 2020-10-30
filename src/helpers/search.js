import { ES_RESULT_TYPE_TAGS, SEARCH_GRAMMAR_HIT_TYPE_LANDING_PAGE, ES_RESULT_TYPE_SOURCES } from './consts';

export class SuggestionsHelper {
  constructor(results) {
    this.suggestions = [];

    if (results?.suggest && results.suggest['title_suggest']) {
      const query      = results.suggest.title_suggest[0].text.toLowerCase();
      this.suggestions = results.suggest.title_suggest[0].options.map((option) => {
        const { text, _source: { title, result_type: resultType } } = option;
        const textParts                                             = text.split(' ');
        let splitChar                                               = null;
        if (resultType === ES_RESULT_TYPE_TAGS) {
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

        const suggest   = titleWords.slice(titleWords.length - suggestWordsWithSeparator).join(' ');
        const suggestLC = suggest.toLowerCase();

        //take as year if contain number after 2000 for other date formats it's problematic cause
        // we use not standard date format (dd.mm.yyyy in js standard mm.dd.yyyy)
        const year = titleWords.find(w => !isNaN(w) && w > 2000);

        return {
          resultType,
          year,
          part: reverseIdx,
          suggest: suggest,
          suggestLC: suggestLC,
        };
      }).sort((a, b) => {
        if (a.part !== b.part) {
          return a.part - b.part;
        }
        if (a.resultType === SEARCH_GRAMMAR_HIT_TYPE_LANDING_PAGE &&
          b.resultType !== SEARCH_GRAMMAR_HIT_TYPE_LANDING_PAGE) {
          return -1;
        }
        if (a.resultType !== SEARCH_GRAMMAR_HIT_TYPE_LANDING_PAGE &&
          b.resultType === SEARCH_GRAMMAR_HIT_TYPE_LANDING_PAGE) {
          return 1;
        }
        if (a.resultType === ES_RESULT_TYPE_SOURCES &&
          b.resultType !== ES_RESULT_TYPE_SOURCES) {
          return -1;
        }
        if (a.resultType !== ES_RESULT_TYPE_SOURCES &&
          b.resultType === ES_RESULT_TYPE_SOURCES) {
          return 1;
        }
        const aSuggestion = a.suggestLC.startsWith(query);
        const bSuggestion = a.suggestLC.startsWith(query);
        
        if (aSuggestion && !bSuggestion) {
          return -1;
        }
        if (!aSuggestion && bSuggestion) {
          return 1;
        }
        if (a.year && b.year) {
          return localeCompareWithYear(a, b);
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

const localeCompareWithYear = (a, b) => {
  const aSliced = a.suggest.split(a.year).map(w => w.trim());
  const bSliced = b.suggest.split(b.year).map(w => w.trim());

  if (aSliced[0] && aSliced[0].toLowerCase() !== bSliced[0].toLowerCase())
    return aSliced[0].localeCompare(bSliced[0]);
  if (a.year !== b.year)
    return new Date(b.year) - new Date(a.year);
  return aSliced[1].localeCompare(bSliced[1]);
};

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
