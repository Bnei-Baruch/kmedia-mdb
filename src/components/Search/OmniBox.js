import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import debounce from 'lodash/debounce';
import { Icon, Input, Search } from 'semantic-ui-react';

import { SuggestionsHelper } from '../../helpers/search';
import { actions, selectors } from '../../redux/modules/search';
import { selectors as settingsSelectors } from '../../redux/modules/settings';
import * as shapes from '../shapes';
import { RTL_LANGUAGES } from '../../helpers/consts';
import { selectors as filterSelectors } from '../../redux/modules/filters';
import { filtersTransformer } from '../../filters';

const CATEGORIES_ICONS = {
  'search': 'search',
  'tags': 'tags',
  'sources': 'book',
  'authors': 'student',
  'persons': 'user',
};

class OmniBox extends Component {

  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    autocomplete: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    suggestions: PropTypes.array,
    getSourcePath: PropTypes.func,
    getTagPath: PropTypes.func,
    query: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    filters: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  static defaultProps = {
    suggestions: [],
  };

  componentWillMount() {
    this.resetComponent(this.props.query);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.suggestions !== this.props.suggestions) {
      this.setState({ suggestionsHelper: new SuggestionsHelper(nextProps.suggestions) });
    }
  }

  resetComponent = query =>
    this.setState({ suggestionsHelper: new SuggestionsHelper(), query });

  doAutocomplete = debounce(() => {
    const query = this.props.query;
    if (query) {
      this.props.autocomplete(query);
    } else {
      this.resetComponent('');
    }
  }, 100);

  emptyQuery = () => {
    const { query } = this.props;
    const { filters } = this.props;
    const params  = filtersTransformer.toApiParams(filters);
    return !query && !Object.values(params).length;
  }

  doSearch = (q = null) => {
    const query = q || this.props.query;
    console.log('Query: ', query);
    const { search, location, push } = this.props;

    if (this.emptyQuery()) {
      return;
    }

    // redirect to search results page if we're not there
    if (!location.pathname.endsWith('search')) {
      push('search');
    }

    search(query, 1, 10);

    if (this.state.isOpen) {
      this.setState({ isOpen: false });
    }
  };

  handleResultSelect = (e, data) => {
    console.log('Result selected.', data.result.title);
    this.props.updateQuery(data.result.title);
    this.doSearch(data.result.title);
  };

  handleSearchKeyDown = (e, data) => {
    // Fix bug that now allows to handleResultSelect when string is empty
    // we have meaning for that when filters are not empty.
    if (e.keyCode === 13) {
      this.doSearch();
    }
  };

  handleSearchChange = (e, data) => {
    this.props.updateQuery(data.value);
    if (data.value) {
      this.setState({ isOpen: true }, this.doAutocomplete);
    } else {
      this.setState({ isOpen: false });
    }
  };

  handleIconClick = () => {
    this.doSearch();
  };

  suggestionToResult = (type, item) => ({ key: item.id, title: item.text});

  renderCategory = (category) => {
    const { name } = category;
    const icon     = CATEGORIES_ICONS[name];
    return (
      <div style={{paddingTop: '0.5em'}}>
        <Icon name={icon} />
        {this.props.t(`search.suggestions.categories.${name}`)}
      </div>
    );
  };

  dontBlur = () => {
    this.setState({ dontBlur: true });
  }

  closeSuggestions = (e, data) => {
    console.log('Blur (close)', this.state);
    if (this.state.dontBlur) {
      this.setState({ dontBlur: false });
    } else {
      this.setState({ isOpen: false, dontBlur: false });
    }
  }

  resultRTL = (language, result) => ({
    ...result,
    className: RTL_LANGUAGES.includes(language) ? 'search-result-rtl' : undefined,
  })

  render() {
    const { language, query } = this.props;
    const { suggestionsHelper, isOpen } = this.state;

    const categories = ['tags', 'sources', 'authors', 'persons'];
    const textResults = new Set([query]);
    let results = categories.reduce((acc, val) => {
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
        style={{width: '100%'}}
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
        input={<Input onKeyUp={this.handleSearchKeyDown} style={{ width: '100%' }} />}
        icon={<Icon link name="search" onClick={this.handleIconClick} />}
        size="mini"
        showNoResults={false}
      />
    );
  }
}

const mapState = state => ({
  suggestions: selectors.getSuggestions(state.search),
  query: selectors.getQuery(state.search),
  language: settingsSelectors.getLanguage(state.settings),
  filters: filterSelectors.getFilters(state.filters, 'search'),
});

const mapDispatch = dispatch => bindActionCreators({
  autocomplete: actions.autocomplete,
  search: actions.search,
  updateQuery: actions.updateQuery,
  push
}, dispatch);

export default connect(mapState, mapDispatch)(OmniBox);
