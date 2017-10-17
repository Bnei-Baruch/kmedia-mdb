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
    if (nextProps.query !== this.props.query) {
      this.setState({ query: nextProps.query });
    }
  }

  resetComponent = query =>
    this.setState({ suggestionsHelper: new SuggestionsHelper(), query });

  doAutocomplete = debounce(() => {
    const query = this.state.query;
    if (query) {
      this.props.autocomplete(query);
    } else {
      this.resetComponent('');
    }
  }, 100);

  doSearch = () => {
    const q = this.state.query;
    if (!q) {
      return;
    }

    const { search, location, push } = this.props;

    // redirect to search results page if we're not there
    if (!location.pathname.endsWith('search')) {
      console.log('pushing:', location.pathname);
      push('search');
    }

    search(q, 1, 10);

    if (this.state.isOpen) {
      this.setState({ isOpen: false });
    }
  };

  handleResultSelect = (e, data) => {
    console.log('OmniBox selection:', data);
    this.setState({ query: data.result.title }, this.doSearch);
  };

  handleSearchChange = (e, data) => {
    const diff = { query: data.value };
    if (!this.state.isOpen) {
      diff.isOpen = true;
    }
    this.setState(diff);
    this.doAutocomplete();
  };

  handleIconClick = () => {
    this.doSearch(this.state.query);
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
    // if (this.state.dontBlur) {
    //   this.setState({ dontBlur: false });
    // } else {
    //   this.setState({ isOpen: false, dontBlur: false });
    // }
  }

  resultRTL = (language, result) => ({
    ...result,
    className: RTL_LANGUAGES.includes(language) ? 'search-result-rtl' : undefined,
  })

  render() {
    const { language } = this.props;
    const { query, suggestionsHelper, isOpen } = this.state;

    const categories = ['tags', 'sources', 'authors', 'persons'];
    const results = !query ? [] : [{
      name: 'search',
      results: [this.resultRTL(language, { key: 'search', title: query })],
      onMouseDown: this.dontBlur
    }];
    categories.reduce((acc, val) => {
      const searchResults = suggestionsHelper.getSuggestions(val, 5);
      if (searchResults.length > 0) {
        acc.push({
          name: val,
          results: searchResults.map(x => this.resultRTL(x.language, this.suggestionToResult(val, x))),
          onMouseDown: this.dontBlur,
        });
      }

      return acc;
    }, results);

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
        input={<Input style={{ width: '100%' }} />}
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
});

const mapDispatch = dispatch => bindActionCreators({
  autocomplete: actions.autocomplete,
  search: actions.search,
  push
}, dispatch);

export default connect(mapState, mapDispatch)(OmniBox);
