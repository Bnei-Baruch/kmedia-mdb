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

  suggestionToResult = (type, item) => {
    switch (type) {
    case 'tags': {
      if (this.props.getTagPath) {
        const path    = this.props.getTagPath(item.id);
        const display = path.map(y => y.label).join(' - ');
        return { key: item.id, title: display };
      } else {
        return { key: item.id, title: item.text };
      }
    }
    case 'sources': {
      if (this.props.getSourcePath) {
        const path    = this.props.getSourcePath(item.id);
        const display = path.map(y => y.name).join(' > ');
        return { key: item.id, title: display };
      } else {
        return { key: item.id, title: item.text };
      }
    }
    default:
      return { key: item.id, title: item.text };
    }
  };

  renderCategory = (category) => {
    const { name } = category;
    const icon     = CATEGORIES_ICONS[name];
    return (
      <div style={{'padding-top': '0.5em'}}>
        <Icon name={icon} />
        {this.props.t(`search.suggestions.categories.${name}`)}
      </div>
    );
  };

  dontBlur = () => {
    this.setState({ dontBlur: true });
  }

  closeSuggestions = (e, data) => {
    if (this.state.dontBlur) {
      this.setState({ dontBlur: false });
    } else {
      this.setState({ isOpen: false, dontBlur: false });
    }
  }

  render() {
    const { query, suggestionsHelper, isOpen } = this.state;

    const categories = ['tags', 'sources', 'authors', 'persons'];
    const results = !query ? [] : [{
      name: 'search',
      results: [{ key: 'search', title: query }],
      onMouseDown: this.dontBlur
    }];
    categories.reduce((acc, val) => {
      const searchResults = suggestionsHelper.getSuggestions(val, 5);
      if (searchResults.length > 0) {
        acc.push({
          name: val,
          results: searchResults.map(x => this.suggestionToResult(val, x)),
          onMouseDown: this.dontBlur,
        });
      }

      return acc;
    }, results);

    return (
      <Search
        category
        fluid
        results={results}
        value={query}
        open={isOpen}
        categoryRenderer={this.renderCategory}
        onSearchChange={this.handleSearchChange}
        onFocus={this.handleSearchChange}
        onResultSelect={this.handleResultSelect}
        onBlur={this.closeSuggestions}
        input={<Input style={{ width: '600px' }} />}
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
  query: selectors.getQuery(state.search),
});

const mapDispatch = dispatch => bindActionCreators({
  autocomplete: actions.autocomplete,
  search: actions.search,
  push
}, dispatch);

export default connect(mapState, mapDispatch)(OmniBox);
