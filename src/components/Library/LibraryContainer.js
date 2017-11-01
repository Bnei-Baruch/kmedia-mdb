import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { selectors as settings } from '../../redux/modules/settings';
import { actions as filtersActions, selectors as filterSelectors } from '../../redux/modules/filters';
import { actions as sourcesActions } from '../../redux/modules/sources';
import Library from './Library';

class LibraryContainer extends Component {
  static propTypes = {
    sourceValue: PropTypes.arrayOf(PropTypes.string),
    language: PropTypes.string.isRequired,
    shouldOpenSourcesFilter: PropTypes.bool,
    editNewFilter: PropTypes.func.isRequired,
    fetchIndex: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sourceValue: null,
    shouldOpenSourcesFilter: true,
  };

  handleFiltersChanged = () => (true);

  handleFiltersHydrated = () => {
    const { shouldOpenSourcesFilter, editNewFilter } = this.props;
    if (shouldOpenSourcesFilter) {
      editNewFilter('sources', 'sources-filter');
    }
  };

  render() {
    const { sourceValue, language, fetchIndex } = this.props;

    return (
      <Library
        source={sourceValue}
        language={language}
        fetchIndex={fetchIndex}
        onFiltersChanged={this.handleFiltersChanged}
        onFiltersHydrated={this.handleFiltersHydrated}
      />);
  }
}

const mapState = state => ({
  sourceValue: filterSelectors.getActiveValue(state.filters, 'sources', 'sources-filter'),
  language: settings.getLanguage(state.settings),
  isFiltersHydrated: filterSelectors.getIsHydrated(state.filters, 'sources'),
  shouldOpenSourcesFilter: true,
});

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchIndex: sourcesActions.fetchIndex,
    editNewFilter: filtersActions.editNewFilter,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(LibraryContainer);
