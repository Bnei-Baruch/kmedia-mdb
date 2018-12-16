import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push as routerPush } from 'react-router-redux';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import { Icon, Input, Search } from 'semantic-ui-react';

import { RTL_LANGUAGES } from '../../helpers/consts';
import { SuggestionsHelper } from '../../helpers/search';
import { getQuery, isDebMode } from '../../helpers/url';
import { isEmpty } from '../../helpers/utils';
import { filtersTransformer } from '../../filters';
import { actions as filtersActions, selectors as filterSelectors } from '../../redux/modules/filters';
import { actions, selectors } from '../../redux/modules/search';
import { selectors as settingsSelectors } from '../../redux/modules/settings';
import * as shapes from '../shapes';

export class OmniBox extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    autocomplete: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    suggestions: PropTypes.object,
    query: PropTypes.string.isRequired,
    updateQuery: PropTypes.func.isRequired,
    setSuggest: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    pageSize: PropTypes.number.isRequired,
    filters: PropTypes.arrayOf(PropTypes.object).isRequired,
    resetFilterNS: PropTypes.func.isRequired,
    onSearch: PropTypes.func,
  };

  static defaultProps = {
    suggestions: {},
    onSearch: noop,
  };

  doAutocomplete = debounce(() => {
    const { query, autocomplete } = this.props;
    if (query.trim()) {
      autocomplete(query);
    } else {
      this.setState({ suggestionsHelper: new SuggestionsHelper() });
    }
  }, 100);

  constructor(props) {
    super(props);
    this.search = null;

    this.state = {
      suggestionsHelper: new SuggestionsHelper(),
      suggestions: {},
      query: '',
      pathname: ''

    };
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { suggestions, query, pathname } = state;
    const { updateQuery, setSuggest }      = state;
    let newState                           = null;

    if (nextProps.suggestions !== suggestions) {
      newState = {
        suggestionsHelper: new SuggestionsHelper(nextProps.suggestions),
        suggestions: nextProps.suggestions,
      };
    }

    // Clear search query when navigating from the search page into other pages (AS-38)
    if (query
      && !nextProps.location.pathname.endsWith('search')
      && nextProps.location.pathname !== pathname) {
      newState = Object.assign({}, newState, { pathname: nextProps.location.pathname, query: nextProps.query });
      updateQuery('');
      setSuggest('');
    }

    return newState;
  }

  componentDidMount() {
    const { suggestions, query, location: { pathname } } = this.props;
    this.setState({ suggestions, query, pathname });
  }

  isEmptyQuery = (query) => {
    const { filters } = this.props;
    const params      = filtersTransformer.toApiParams(filters);
    return isEmpty(query) && isEmpty(params);
  };

  doSearch = (q = null, suggest = '', locationSearch = '') => {
    const { isOpen, qurey: pquery }                                     = this.state;
    const query                                                         = q != null ? q : pquery;
    const { search, location, push, pageSize, resetFilterNS, onSearch } = this.props;

    if (this.isEmptyQuery(query)) {
      return;
    }

    // First of all redirect to search results page if we're not there
    if (!location.pathname.endsWith('search')) {
      // In case a filter was updated, React location object is not updated yet
      // so we use the second function parameter to pass the search part (to persist filters
      // to the search page when we redirect).

      push({ pathname: 'search', search: locationSearch });

      // Reset filters for new search (query changed)
      if (query && getQuery(location).q !== query) {
        resetFilterNS('search');
      }
    }

    search(query, 1, pageSize, suggest, isDebMode(location));
    if (isOpen) {
      this.setState({ isOpen: false });
    }

    onSearch();
    // So as to close the suggestions on "enter search" (KeyDown 13)
    this.setState({ suggestionsHelper: new SuggestionsHelper() });
  };

  handleResultSelect = (e, data) => {
    const { updateQuery, setSuggest, query } = this.props;

    const { title } = data.result;
    const prevQuery = query;

    updateQuery(title);
    setSuggest(prevQuery);
    this.doSearch(title, prevQuery);
  };

  handleSearchKeyDown = (e) => {
    const { updateQuery, query } = this.props;
    const { getSelectedResult }  = this.search;

    // Fix bug that did not allows to handleResultSelect when string is empty
    // we have meaning for that when filters are not empty.
    if (e.keyCode === 13 && query.trim()) {
      const selectedResult = getSelectedResult();
      if (!!selectedResult && !!selectedResult.title) {
        this.doSearch(selectedResult.title);
      } else {
        this.doSearch();
      }
    }

    if (e.keyCode === 27) { // Esc
      updateQuery('');
    }
  };

  handleSearchChange = (e, data) => {
    const { updateQuery, setSuggest, query } = this.props;
    updateQuery(data.value);
    setSuggest(query);
    if (data.value.trim()) {
      this.doAutocomplete();
    }
  };

  makeResult = (language, result) => ({
    ...result,
    className: RTL_LANGUAGES.includes(language) ? 'search-result-rtl' : '',
  });

  renderInput() {
    return <Input onKeyDown={this.handleSearchKeyDown} />;
  }

  render() {
    const { language, query }   = this.props;
    const { suggestionsHelper } = this.state;

    const results = suggestionsHelper.getSuggestions()
      .map(s => (this.makeResult(language, { key: s, title: s })));

    return (
      <Search
        ref={(s) => {
          this.search = s;
        }}
        fluid
        className="search-omnibox"
        size="mini"
        results={results}
        value={query}
        input={this.renderInput()}
        icon={<Icon link name="search" onClick={this.doSearch} />}
        showNoResults={false}
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
});

export const mapDispatch = dispatch => bindActionCreators({
  autocomplete: actions.autocomplete,
  search: actions.search,
  updateQuery: actions.updateQuery,
  setSuggest: actions.setSuggest,
  resetFilterNS: filtersActions.resetNamespace,
  push: routerPush,
}, dispatch);

export const wrap = (WrappedComponent, ms = mapState, md = mapDispatch) => connect(ms, md)(WrappedComponent);

export default wrap(withNamespaces()(OmniBox));
