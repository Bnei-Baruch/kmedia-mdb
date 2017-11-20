import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
// import { isEmpty } from '../../helpers/utils';
import Filters from './Filters';

import { selectors as settings } from '../../redux/modules/settings';
import { actions as filterActions, selectors as filterSelectors } from '../../redux/modules/filters';
import { actions as sourceActions, selectors as sourceSelectors } from '../../redux/modules/sources';
import * as shapes from '../shapes';
import LibraryContentContainer from './LibraryContentContainer';
import { isEmpty } from '../../helpers/utils';

class LibraryContainer extends Component {
  static propTypes = {
    sourceValue: PropTypes.arrayOf(PropTypes.string),
    indexMap: PropTypes.objectOf(PropTypes.shape({
      data: PropTypes.object, // content index
      wip: shapes.WIP,
      err: shapes.Error,
    })).isRequired,
    language: PropTypes.string.isRequired,
    fetchIndex: PropTypes.func.isRequired,
    isFiltersHydrated: PropTypes.bool,
    shouldOpenSourcesFilter: PropTypes.bool,
    editNewFilter: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sourceValue: null,
    content: {
      data: null,
      wip: false,
      err: null,
    },
    shouldOpenSourcesFilter: false,
    isFiltersHydrated: false,
  };

  componentDidMount() {
    if (this.props.isFiltersHydrated) {
      this.fetchIndices(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    // if (!this.props.isFiltersHydrated) {
    //   return;
    // }
    if (nextProps.sourceValue !== this.props.sourceValue) {
      this.fetchIndices(nextProps);
    }
  }

  fetchIndices = (props) => {
    const { sourceValue, fetchIndex } = props;

    if (!isEmpty(sourceValue)) {
      const [realSource] = sourceValue.slice(-1);
      fetchIndex(realSource);
    }
  };

  handleFiltersChanged = () => this.fetchIndices(this.props);

  handleFiltersHydrated = () => {
    if (this.props.shouldOpenSourcesFilter) {
      this.props.editNewFilter('sources', 'sources-filter');
    }
  };

  render() {
    const { indexMap, sourceValue, language } = this.props;

    let index      = {};
    let realSource = '';

    if (!isEmpty(sourceValue)) {
      realSource = sourceValue.slice(-1)[0];
      index      = indexMap[realSource];
    }

    return (
      <div>
        <Filters onChange={this.handleFiltersChanged} onHydrated={this.handleFiltersHydrated} />
        <LibraryContentContainer
          source={realSource}
          index={index}
          language={language}
        />
      </div>
    );
  }
}

export default connect(
  state => ({
    indexMap: sourceSelectors.getIndexById(state.sources),
    content: sourceSelectors.getContent(state.sources),
    language: settings.getLanguage(state.settings),

    sourceValue: filterSelectors.getActiveValue(state.filters, 'sources', 'sources-filter'),
    isFiltersHydrated: filterSelectors.getIsHydrated(state.filters, 'sources'),
  }),
  dispatch => bindActionCreators({
    fetchIndex: sourceActions.fetchIndex,
    editNewFilter: filterActions.editNewFilter,
  }, dispatch)
)(translate()(LibraryContainer));
