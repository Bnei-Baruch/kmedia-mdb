import uniqBy from 'lodash/uniqBy';

export class SuggestionsHelper {
  constructor(results) {
    this.byType = {};
    if (results && results.suggest) {
      results.suggest['title_suggest'][0].options.forEach(x => this.$$addSuggestion(x, 'title'));
    }
  }

  getSuggestions = (result_type, topN = 5) => {
    const x        = this.byType[result_type] || {};
    // TODO: Order results here by heuristics (not sure the right place to do this):
    // 1) Most detailed element title should be selected first.
    // 2) Prefix match should be selected first
    // Example: for query [some], suggest should return following order:
    // [baal sulam > shamati > some]   <== This is an interesting case as the title is "some"
    //                                     but we also have the path. "some" is better match then "something"
    // [something]
    // [something else]
    // [baal sulam > some > other]     <== This is interesing, the title is "other", but in path
    //                                     we have "some".
    // [else something]
    // [some > shamati > other]
    const combined = uniqBy(x.title, 'id');
    return combined.slice(0, topN);
  };

  $$addSuggestion = (option, field) => {
    const { _index, _source } = option;
    const { mdb_uid: id, result_type, [field]: text} = _source;
    // TODO: Fix that to return detected language explicitly!
    const language = _index.split('_').slice(-1)[0];
    const item = { id, result_type, text, language };

    let typeItems = this.byType[result_type];
    if (typeItems) {
      const fieldItems = typeItems[field];
      if (Array.isArray(fieldItems)) {
        fieldItems.push(item);
      } else {
        this.byType[result_type][field] = [item];
      }
    } else {
      this.byType[result_type] = { [field]: [item] };
    }
  };
};

const uidBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const GenerateUID = (n) => {
  const ret = new Array(n);
  while (n--) {
    ret[n] = uidBytes.charAt(Math.floor(Math.random() * uidBytes.length));
  }
  return ret.join('');
};

export const GenerateSearchId = () => GenerateUID(16);

