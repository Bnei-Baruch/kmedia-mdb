import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { Icon, Search } from 'semantic-ui-react';

import { SuggestionsHelper } from '../../helpers/search';
import { actions, selectors } from '../../redux/modules/search';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import { selectors as tagsSelectors } from '../../redux/modules/tags';

const CATEGORIES_ICONS = {
  'tags': 'tags',
  'sources': 'book',
  'authors': 'student',
  'persons': 'user',
};

class OmniBox extends Component {

  static propTypes = {
    autocomplete: PropTypes.func.isRequired,
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

  handleResultSelect = (e, data) => {
    console.log('OmniBox selection:', data);
    this.resetComponent();
  };

  handleSearchChange = (e, data) => {
    this.setState({ query: data.value });
    this.doAutocomplete();
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
    const { query, suggestionsHelper } = this.state;

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
        size="mini"
        categoryRenderer={this.renderCategory}
        onResultSelect={this.handleResultSelect}
        onSearchChange={this.handleSearchChange}
        results={results}
        value={query}
      />
    );
  }
}

const mapState = state => ({
  suggestions: selectors.getSuggestions(state.search),
  getSourcePath: sourcesSelectors.getPathByID(state.sources),
  getTagPath: tagsSelectors.getPathByID(state.tags),
});

export default connect(mapState, actions)(OmniBox);
