import uniqBy from 'lodash/uniqBy';

export class SuggestionsHelper {
  constructor(autocompleteResults) {
    this.byType = {};
    if (Array.isArray(autocompleteResults)) {
      autocompleteResults.forEach((results) => {
        results.suggest['classification_name'][0].options.forEach(x => this.$$addSuggestion(x, 'name'));
        results.suggest['classification_description'][0].options.forEach(x => this.$$addSuggestion(x, 'description'));
      });
    }
  }

  getSuggestions = (type, topN = 5) => {
    const x        = this.byType[type] || {};
    const combined = uniqBy((x.name || []).concat(x.description || []), 'id');
    return combined.slice(0, topN);
  };

  $$addSuggestion = (option, field) => {
    const { text, _type: type, _source } = option;
    const { mdb_uid: id }                = _source;
    const item                           = { id, type, text };

    let typeItems = this.byType[type];
    if (typeItems) {
      const fieldItems = typeItems[field];
      if (Array.isArray(fieldItems)) {
        fieldItems.push(item);
      } else {
        this.byType[type][field] = [item];
      }
    } else {
      this.byType[type] = { [field]: [item] };
    }
  };
}
