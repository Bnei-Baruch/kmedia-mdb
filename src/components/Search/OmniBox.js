import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import { Icon, Input, Search } from 'semantic-ui-react';

import { RTL_LANGUAGES } from '../../helpers/consts';
import { SuggestionsHelper } from '../../helpers/search';
import { getQuery, isDebMode } from '../../helpers/url';
import { actions as filtersActions, selectors as filterSelectors } from '../../redux/modules/filters';
import { actions, selectors } from '../../redux/modules/search';
import { selectors as settingsSelectors } from '../../redux/modules/settings';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import { selectors as tagsSelectors } from '../../redux/modules/tags';
import { filtersTransformer } from '../../filters';
import { stringify as urlSearchStringify } from '../../helpers/url';
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
    addFilterValue: PropTypes.func.isRequired,
    setFilterValue: PropTypes.func.isRequired,
    location: shapes.HistoryLocation.isRequired,
    autocomplete: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    suggestions: PropTypes.object,
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
    suggestions: {},
    onSearch: noop,
  };

  componentWillMount() {
    this.resetComponent(this.props.query);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.suggestions !== this.props.suggestions) {
      this.setState({ suggestionsHelper: new SuggestionsHelper(nextProps.suggestions) });
    }

    // Clear search query when navigating from the search page into other pages (AS-38)
    if (this.props.query && !nextProps.location.pathname.endsWith('search') && nextProps.location.pathname !== this.props.location.pathname){
      this.handleFilterClear();
    }
  }

  resetComponent = () =>
    this.setState({ suggestionsHelper: new SuggestionsHelper() });

  doAutocomplete = debounce(() => {
    const { query } = this.props;
    if (query.trim()) {
      this.props.autocomplete(query);
    } else {
      this.resetComponent('');
    }
  }, 100);

  emptyQuery = () => {
    const { query }   = this.props;
    const { filters } = this.props;
    const params      = filtersTransformer.toApiParams(filters);
    return !query && !Object.values(params).length;
  };

  doSearch = (q = null, locationSearch = '') => {
    const query                                                       = q != null ? q : this.props.query;
    const { search, location, push, pageSize, resetFilter, onSearch } = this.props;

    if (this.emptyQuery()) {
      return;
    }

    // First of all redirect to search results page if we're not there
    if (!location.pathname.endsWith('search')) {
      // In case a filter was updated, React location object is not updated yet
      // so we use the second function parameter to pass the search part (to persist filters
      // to the search page when we redirect).

      push({ pathname: 'search', search: locationSearch});
    }

    // Reset filters for new search (query changed)
    if (query && getQuery(location).q !== query) {
      resetFilter('search', 'date-filter');
      resetFilter('search', 'topics-filter');
      resetFilter('search', 'sources-filter');
      resetFilter('search', 'sections-filter');
    }

    search(query, 1, pageSize, isDebMode(location));

    if (this.state.isOpen) {
      this.setState({ isOpen: false });
    }

    onSearch();
  };

  handleResultSelect = (e, data) => {
    const { key }  = data.result;
    const category = data.results.find(c => c.results.find(r => r.key === key)).name;
    if (category === 'search') {
      this.props.updateQuery(data.result.title);
      this.doSearch(data.result.title);
    } else if (category === 'tags') {
      this.props.updateQuery('');
      const path = this.props.getTagPath(data.result.key).map(p => p.id)
      const query = filtersTransformer.toQueryParams([
        { name: 'topics-filter', values: [path], queryKey: 'topic' }
      ]);
      const queryString = urlSearchStringify(query);
      this.props.addFilterValue('search', 'topics-filter', path);
      this.doSearch('', queryString);
    } else if (category === 'sources') {
      this.props.updateQuery('');
      const path = this.props.getSourcePath(data.result.key).map(p => p.id)
      const query = filtersTransformer.toQueryParams([
        { name: 'sources-filter', values: [path], queryKey: 'source' }
      ]);
      const queryString = urlSearchStringify(query);
      this.props.setFilterValue('search', 'sources-filter', path);
      this.doSearch('', queryString);
    }
    // Currently ignoring anything else.
  };

  handleSearchKeyDown = (e) => {
    // Fix bug that did not allows to handleResultSelect when string is empty
    // we have meaning for that when filters are not empty.
    if (e.keyCode === 13 && !this.props.query.trim()) {
      this.doSearch();
    }
    if (e.keyCode === 27) { // Esc
      this.handleFilterClear();
    }
  };

  handleFilterClear = () => {
    this.props.updateQuery('');
    this.closeSuggestions();
  };

  handleSearchChange = (e, data) => {
    this.props.updateQuery(data.value);
    if (data.value.trim()) {
      this.setState({ isOpen: true }, this.doAutocomplete);
    } else {
      this.setState({ isOpen: false });
    }
  };

  handleIconClick = () => {
    this.doSearch();
  };

  suggestionToResult = (type, item) => {
    if (type === 'tags') {
      return {
        key: item.id,
        title: (this.props.getTagPath(item.id) || [])
          .map(p => p.label)
          .join(' - ')
      };
    } else if (type === 'sources') {
      return {
        key: item.id,
        title: (this.props.getSourcePath(item.id) || [])
          .map(p => p.name)
          .join(' > ')
      };
    }

    return { key: item.id, title: item.text };
  };

  dontBlur = () => {
    this.setState({ dontBlur: true });
  };

  closeSuggestions = () => {
    if (this.state.dontBlur) {
      this.setState({ dontBlur: false });
    } else {
      this.setState({ isOpen: false, dontBlur: false });
    }
  };

  resultRTL = (language, result) => ({
    ...result,
    className: RTL_LANGUAGES.includes(language) ? 'search-result-rtl' : undefined,
  });

  renderCategory = (category) => {
    const { name } = category;
    const icon     = CATEGORIES_ICONS[name];
    return (
      <div>
        <Icon name={icon} />
        {this.props.t(`search.suggestions.categories.${name}`)}
      </div>
    );
  };

  renderInput() {
    return (<Input onKeyDown={this.handleSearchKeyDown} />);
  }

  render() {
    const { language, query }           = this.props;
    const { suggestionsHelper, isOpen } = this.state;

    const categories  = ['tags', 'sources', 'authors', 'persons'];
    const textResults = new Set([query]);
    
    let results       = categories.reduce((acc, val) => {
      const searchResults = suggestionsHelper.getSuggestions(val, 5);
      if (searchResults.length > 0) {
        searchResults.forEach(x => textResults.add(x.text));
        acc.push({
          name: val,
          results: searchResults.map(x => this.resultRTL(x.language, this.suggestionToResult(val, x))),
          onMouseDown: this.dontBlur,
        });
      }

      return acc;
    }, []);

    results = [{
      name: 'search',
      results: Array.from(textResults).map(q => this.resultRTL(language, { key: `search_${q}`, title: q })),
      onMouseDown: this.dontBlur
    }].concat(results);

    return (
      <Search
        className="search-omnibox"
        category
        fluid
        results={results}
        value={query}
        open={isOpen}
        selectFirstResult
        categoryRenderer={this.renderCategory}
        onSearchChange={this.handleSearchChange}
        onFocus={this.handleSearchChange}
        onResultSelect={this.handleResultSelect}
        onBlur={this.closeSuggestions}
        input={this.renderInput()}
        icon={<Icon link name="search" onClick={this.handleIconClick} />}
        size="mini"
        showNoResults={false}
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
  addFilterValue: filtersActions.addFilterValue,
  setFilterValue: filtersActions.setFilterValue,
  resetFilter: filtersActions.resetFilter,
  push,
}, dispatch);

export const wrap = (WrappedComponent, ms = mapState, md = mapDispatch) =>
  connect(ms, md)(WrappedComponent);

export default wrap(OmniBox);
