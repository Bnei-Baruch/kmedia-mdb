import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import uniqBy from 'lodash/uniqBy';
import { Search } from 'semantic-ui-react';

import { SuggestionsHelper } from '../../helpers/search';
import { actions, selectors } from '../../redux/modules/search';

class OmniBox extends Component {

  static propTypes = {
    autocomplete: PropTypes.func.isRequired,
    suggestions: PropTypes.array,
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

  // renderResult = (result) => {
  //   // const =
  //   return <div>{result.}</div>;
  // };

  render() {
    const { query, suggestionsHelper } = this.state;

    const results = ['tags', 'sources', 'authors', 'persons'].reduce((acc, val) => {
      const typeResults   = suggestionsHelper.getSuggestions(val);
      const combined      = uniqBy((typeResults.name || []).concat(typeResults.description || []), 'id');
      const searchResults = combined.slice(0, 5).map(x => ({ key: x.id, title: x.text }));

      if (searchResults.length > 0) {
        acc.push({ name: val, results: searchResults });
      }

      return acc;
    }, []);

    console.log('OmniBox render:', results);

    return (
      <Search
        category
        onResultSelect={this.handleResultSelect}
        onSearchChange={this.handleSearchChange}
        // resultRenderer={this.renderResult}
        results={results}
        value={query}
      />
    );
  }
}

const mapState = state => ({
  suggestions: selectors.getSuggestions(state.search),
});

export default connect(mapState, actions)(OmniBox);
