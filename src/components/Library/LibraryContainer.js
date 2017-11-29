import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import LibraryFilters from './Filters';
import LibraryContentContainer from './LibraryContentContainer';
import { selectors as settings } from '../../redux/modules/settings';
import {
  actions as filterActions,
  selectors as filters,
  selectors as filterSelectors
} from '../../redux/modules/filters';
import { actions as sourceActions, selectors as sourceSelectors } from '../../redux/modules/sources';
import * as shapes from '../shapes';
import { formatError, isEmpty } from '../../helpers/utils';
import { ErrorSplash, FrownSplash } from '../shared/Splash';

class LibraryContainer extends Component {
  static propTypes = {
    sourceValue: PropTypes.arrayOf(PropTypes.string),
    indexMap: PropTypes.objectOf(PropTypes.shape({
      data: PropTypes.object, // content index
      wip: shapes.WIP,
      err: shapes.Error,
    })),
    language: PropTypes.string.isRequired,
    fetchIndex: PropTypes.func.isRequired,
    isFiltersHydrated: PropTypes.bool.isRequired,
    shouldOpenSourcesFilter: PropTypes.bool.isRequired,
    editNewFilter: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sourceValue: null,
    content: {
      data: null,
      wip: false,
      err: null,
    },
    indexMap: {
      data: null,
      wip: false,
      err: null,
    },
  };

  componentDidMount() {
    this.fetchIndices(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sourceValue !== this.props.sourceValue) {
      this.fetchIndices(nextProps);
    }
  }

  fetchIndices = (props) => {
    const { sourceValue, fetchIndex, } = props;

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
    const { indexMap, sourceValue, language, t } = this.props;

    let index      = {};
    let realSource = '';

    if (!isEmpty(sourceValue)) {
      realSource = sourceValue.slice(-1)[0];
      index      = indexMap[realSource];
    }

    let content;
    const { err } = index || {};
    if (err) {
      if (err.response && err.response.status === 404) {
        content = <FrownSplash text={t('messages.source-content-not-found')} />;
      } else {
        content = <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
      }
    } else {
      content = <LibraryContentContainer source={realSource} index={index} language={language} />;
    }

    return (
      <div>
        <LibraryFilters onChange={this.handleFiltersChanged} onHydrated={this.handleFiltersHydrated} />
        {content}
      </div>
    );
  }
}

const mapState = (state) => {
  // we want to open sources-filter if no filter is applied
  const allFilters              = filters.getFilters(state.filters, 'sources');
  const shouldOpenSourcesFilter = allFilters.length === 0;

  return {
    indexMap: sourceSelectors.getIndexById(state.sources),
    content: sourceSelectors.getContent(state.sources),
    language: settings.getLanguage(state.settings),

    sourceValue: filterSelectors.getActiveValue(state.filters, 'sources', 'sources-filter'),
    isFiltersHydrated: filterSelectors.getIsHydrated(state.filters, 'sources'),
    shouldOpenSourcesFilter
  };
};

export default connect(
  mapState,
  dispatch => bindActionCreators({
    fetchIndex: sourceActions.fetchIndex,
    editNewFilter: filterActions.editNewFilter,
  }, dispatch)
)(translate()(LibraryContainer));
