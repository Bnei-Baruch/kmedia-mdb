import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push as routerPush } from 'react-router-redux';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import { Icon, Input, Search } from 'semantic-ui-react';

import { RTL_LANGUAGES } from '../../helpers/consts';
import { SuggestionsHelper } from '../../helpers/search';
import { getQuery, isDebMode, stringify as urlSearchStringify } from '../../helpers/url';
import { isEmpty } from '../../helpers/utils';
import { filtersTransformer } from '../../filters';
import { actions as filtersActions, selectors as filterSelectors } from '../../redux/modules/filters';
import { actions, selectors } from '../../redux/modules/search';
import { selectors as settingsSelectors } from '../../redux/modules/settings';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import { selectors as tagsSelectors } from '../../redux/modules/tags';
import * as shapes from '../shapes';

const CATEGORIES_ICONS = {
  search: 'search',
  tags: 'tags',
  sources: 'book',
  authors: 'student',
  persons: 'user',
};

export class OmniBox extends Component {
  static propTypes = {
    setFilterValue: PropTypes.func.isRequired,
    location: shapes.HistoryLocation.isRequired,
    autocomplete: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    suggestions: PropTypes.arrayOf(PropTypes.object),
    getSourcePath: PropTypes.func,
    getTagPath: PropTypes.func,
    query: PropTypes.string.isRequired,
    updateQuery: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    pageSize: PropTypes.number.isRequired,
    filters: PropTypes.arrayOf(PropTypes.object).isRequired,
    resetFilter: PropTypes.func.isRequired,
    onSearch: PropTypes.func,
  };

  static defaultProps = {
    suggestions: [],
    onSearch: noop,
  };

  state = {
    suggestionsHelper: new SuggestionsHelper(),
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.suggestions !== this.props.suggestions) {
      this.setState({ suggestionsHelper: new SuggestionsHelper(nextProps.suggestions) });
    }
  }

  doAutocomplete = debounce(() => {
    const { query } = this.props;
    if (query.trim()) {
      this.props.autocomplete(query);
    } else {
      this.setState({ suggestionsHelper: new SuggestionsHelper() });
    }
  }, 100);

  isEmptyQuery = (q) => {
    const { query = q, filters } = this.props;
    const params             = filtersTransformer.toApiParams(filters);
    return isEmpty(query) && isEmpty(params);
  };

  doSearch = (q = null, locationSearch = '') => {
    if (this.isEmptyQuery(q)) {
      return;
    }

    const { search, location, push, pageSize, resetFilter, onSearch } = this.props;

    // First of all redirect to search results page if we're not there
    if (!location.pathname.endsWith('search')) {
      // In case a filter was updated, React location object is not updated yet
      // so we use the second function parameter to pass the search part (to persist filters
      // to the search page when we redirect).

      push({ pathname: 'search', search: locationSearch });
    }

    const query = q != null ? q : this.props.query;

    // Reset filters for new search (query changed)
    if (query && getQuery(location).q !== query) {
      resetFilter('search', 'date-filter');
      resetFilter('search', 'topics-filter');
      resetFilter('search', 'sources-filter');
      resetFilter('search', 'sections-filter');
    }

    search(query, 1, pageSize, isDebMode(location));
    onSearch();

    // so as to close the suggestions on "enter search" (KeyDown 13)
    this.setState({ suggestionsHelper: new SuggestionsHelper() });
  };

  handleResultSelect = (e, data) => {
    const { key, title, category } = data.result;

    switch (category) {
    case 'search':
      this.props.updateQuery(title);
      this.doSearch(title);
      break;

    case 'tags': {
      const path        = this.props.getTagPath(key).map(p => p.id);
      const query       = filtersTransformer.toQueryParams([
        { name: 'topics-filter', values: [path], queryKey: 'topic' }
      ]);
      const queryString = urlSearchStringify(query);
      this.props.setFilterValue('search', 'topics-filter', path);
      this.props.updateQuery('');
      this.doSearch('', queryString);
      break;
    }

    case 'sources': {
      const path        = this.props.getSourcePath(key).map(p => p.id);
      const query       = filtersTransformer.toQueryParams([
        { name: 'sources-filter', values: [path], queryKey: 'source' }
      ]);
      const queryString = urlSearchStringify(query);
      this.props.setFilterValue('search', 'sources-filter', path);
      this.props.updateQuery('');
      this.doSearch('', queryString);
      break;
    }

    default:
      break;  // Currently ignoring anything else.
    }
  };

  handleSearchKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.doSearch();
    }

    if (e.keyCode === 27) { // Esc
      this.props.updateQuery('');
    }
  };

  handleSearchChange = (e, data) => {
    this.props.updateQuery(data.value);
    if (data.value.trim()) {
      this.doAutocomplete();
    }
  };

  suggestionToResult = (type, item) => {
    if (type === 'tags') {
      return {
        category: type,
        key: item.id,
        title: (this.props.getTagPath(item.id) || [])
          .map(p => p.label)
          .join(' - ')
      };
    } else if (type === 'sources') {
      return {
        category: type,
        key: item.id,
        title: (this.props.getSourcePath(item.id) || [])
          .map(p => p.name)
          .join(' > ')
      };
    }

    return { category: type, key: item.id, title: item.text };
  };

  makeResult = (language, result) => ({
    ...result,
    className: RTL_LANGUAGES.includes(language) ? 'search-result-rtl' : '',
  });

  renderCategory = (category) => {
    const { name } = category;
    return (
      <div>
        <Icon name={CATEGORIES_ICONS[name]} />
        {this.props.t(`search.suggestions.categories.${name}`)}
      </div>
    );
  };

  renderInput() {
    return <Input onKeyDown={this.handleSearchKeyDown} />;
  }

  render() {
    const { language, query }   = this.props;
    const { suggestionsHelper } = this.state;

    // build suggestions categories
    const categories  = ['tags', 'sources', 'authors', 'persons'];
    const textResults = new Set();
    const results     = categories.reduce((acc, val) => {
      const searchResults = suggestionsHelper.getSuggestions(val, 5);
      if (searchResults.length > 0) {
        searchResults.map(x => x.text)
          .filter(x => !!x)
          .forEach(x => textResults.add(x));

        acc[val] = {
          name: val,
          results: searchResults.map(x =>
            this.makeResult(x.language, this.suggestionToResult(val, x))),
        };
      }

      return acc;
    }, {});

    // blend in text results
    const finalResults = {};
    if (textResults.size > 0) {
      finalResults.search = {
        name: 'search',
        results: Array.from(textResults).map(q =>
          this.makeResult(language, {
            category: 'search',
            key: `search_${q}`,
            title: q
          })),
      };
    }

    // Object property creation order is important for us here
    // (even though not a js spec most browsers implement it)
    categories.map(x => results[x])
      .filter(x => !!x)
      .forEach((x) => {
        finalResults[x.name] = x;
      });

    return (
      <Search
        category
        fluid
        className="search-omnibox"
        size="mini"
        results={finalResults}
        value={query}
        input={this.renderInput()}
        icon={<Icon link name="search" onClick={() => this.doSearch()} />}
        showNoResults={false}
        categoryRenderer={this.renderCategory}
        onSearchChange={this.handleSearchChange}
        onResultSelect={this.handleResultSelect}
      />
    );
  }
}

export const mapState = state => ({
  suggestions: selectors.getSuggestions(state.search),
  query: selectors.getQuery(state.search),
  pageSize: settingsSelectors.getPageSize(state.settings),
  language: settingsSelectors.getLanguage(state.settings),
  filters: filterSelectors.getFilters(state.filters, 'search'),
  getSourcePath: sourcesSelectors.getPathByID(state.sources),
  getTagPath: tagsSelectors.getPathByID(state.tags),
});

export const mapDispatch = dispatch => bindActionCreators({
  autocomplete: actions.autocomplete,
  search: actions.search,
  updateQuery: actions.updateQuery,
  setFilterValue: filtersActions.setFilterValue,
  resetFilter: filtersActions.resetFilter,
  push: routerPush,
}, dispatch);

export const wrap = (WrappedComponent, ms = mapState, md = mapDispatch) =>
  connect(ms, md)(WrappedComponent);

export default wrap(OmniBox);
