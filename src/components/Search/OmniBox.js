import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import debounce from 'lodash/debounce';
import { Icon, Input, Search } from 'semantic-ui-react';

import { SuggestionsHelper } from '../../helpers/search';
import { actions, selectors } from '../../redux/modules/search';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import { selectors as tagsSelectors } from '../../redux/modules/tags';
import * as shapes from '../shapes';

const CATEGORIES_ICONS = {
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
  };

  static defaultProps = {
    suggestions: [],
  };

  componentWillMount() {
    this.resetComponent();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.suggestions !== this.props.suggestions) {
      this.setState({ suggestionsHelper: new SuggestionsHelper(nextProps.suggestions) });
    }
  }

  resetComponent = () =>
    this.setState({ suggestionsHelper: new SuggestionsHelper(), query: '' });

  doAutocomplete = debounce(() => {
    const query = this.state.query;
    if (query) {
      this.props.autocomplete(query);
    } else {
      this.resetComponent();
    }
  }, 100);

  doSearch = (q) => {
    if (!q) {
      return;
    }

    const { search, location, push } = this.props;
    search(q, 1, 10);

    // redirect to search results page if we're there already
    if (!location.pathname.startsWith('/search')) {
      push('search');
    }

    if (this.state.isOpen) {
      this.setState({ isOpen: false });
    }
  };

  handleResultSelect = (e, data) => {
    console.log('OmniBox selection:', data);
    this.resetComponent();
  };

  handleSearchChange = (e, data) => {
    const diff = { query: data.value };
    if (!this.state.isOpen) {
      diff.isOpen = true;
    }
    this.setState(diff);
    this.doAutocomplete();
  };

  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.doSearch(this.state.query);
    }
  };

  handleIconClick = () => {
    this.doSearch(this.state.query);
  };

  suggestionToResult = (type, item) => {
    switch (type) {
    case 'tags': {
      const path    = this.props.getTagPath(item.id);
      const display = path.map(y => y.label).join(' - ');
      return { key: item.id, title: display };
    }
    case 'sources': {
      const path    = this.props.getSourcePath(item.id);
      const display = path.map(y => y.name).join(' > ');
      return { key: item.id, title: display };
    }

    default:
      return { key: item.id, title: item.text };
    }
  };

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

  render() {
    const { query, suggestionsHelper, isOpen } = this.state;

    const results = ['tags', 'sources', 'authors', 'persons'].reduce((acc, val) => {
      const searchResults = suggestionsHelper.getSuggestions(val, 5);
      if (searchResults.length > 0) {
        acc.push({
          name: val,
          results: searchResults.map(x => this.suggestionToResult(val, x)),
        });
      }

      return acc;
    }, []);

    return (
      <Search
        category
        fluid
        results={results}
        value={query}
        open={isOpen}
        categoryRenderer={this.renderCategory}
        onResultSelect={this.handleResultSelect}
        onSearchChange={this.handleSearchChange}
        input={<Input onKeyDown={this.handleKeyDown} style={{ width: '600px' }} />}
        icon={<Icon link name="search" onClick={this.handleIconClick} />}
        size="mini"
        showNoResults={false}
      />
    );
  }
}

const mapState = state => ({
  suggestions: selectors.getSuggestions(state.search),
  getSourcePath: sourcesSelectors.getPathByID(state.sources),
  getTagPath: tagsSelectors.getPathByID(state.tags),
});

const mapDispatch = dispatch => bindActionCreators({
  autocomplete: actions.autocomplete,
  search: actions.search,
  push
}, dispatch);

export default connect(mapState, mapDispatch)(OmniBox);
