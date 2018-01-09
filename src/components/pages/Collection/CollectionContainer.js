import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions as listsActions, selectors as lists } from '../../../redux/modules/lists';
import { actions, selectors } from '../../../redux/modules/publications';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as filters } from '../../../redux/modules/filters';
import * as shapes from '../../shapes';
import withPagination from '../../pagination/withPagination2';
import Collection from './Collection';

class CollectionContainer extends withPagination {

  static propTypes = {
    namespace: PropTypes.string.isRequired,
    location: shapes.HistoryLocation.isRequired,
    match: shapes.RouterMatch.isRequired,
    collection: shapes.GenericCollection,
    wip: PropTypes.bool,
    err: shapes.Error,
    items: PropTypes.arrayOf(shapes.Lecture),
    total: PropTypes.number.isRequired,
    pageNo: PropTypes.number.isRequired,
    itemsWip: PropTypes.bool,
    itemsErr: shapes.Error,
    pageSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    isFiltersHydrated: PropTypes.bool,
    fetchCollection: PropTypes.func.isRequired,
    fetchList: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    collection: null,
    wip: false,
    err: null,
    items: [],
    itemsWip: false,
    itemsErr: null,
    isFiltersHydrated: false,
  };

  componentDidMount() {
    this.fetchCollection(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id ||
      nextProps.language !== this.props.language) {
      this.fetchCollection(nextProps);
    }

    // filters haven't been hydrated yet.
    // returning here prevents duplicate calls to fetchList.
    if (!nextProps.isFiltersHydrated) {
      return;
    }

    super.componentWillReceiveProps(nextProps);

    if (nextProps.collection && !this.props.collection) {
      this.askForData(nextProps);
    }
  }

  fetchCollection = (props) => {
    props.fetchCollection(props.match.params.id);
  };

  extraFetchParams() {
    return { collection: this.props.match.params.id };
  }

  handlePageChanged = pageNo =>
    this.setPage(this.props, pageNo);

  handleFiltersChanged = () =>
    this.handlePageChanged(1);

  handleFiltersHydrated = () => {
    const p = this.getPageFromLocation(this.props.location);
    this.handlePageChanged(p);
  };

  render() {
    const { collection, wip, err, items, itemsWip, itemsErr, pageNo, total, pageSize, language } = this.props;

    return (
      <Collection
        collection={collection}
        wip={wip}
        err={err}
        items={items}
        itemsWip={itemsWip}
        itemsErr={itemsErr}
        pageNo={pageNo}
        total={total}
        pageSize={pageSize}
        language={language}
        onPageChange={this.handlePageChanged}
        onFiltersChanged={this.handleFiltersChanged}
        onFiltersHydrated={this.handleFiltersHydrated}
      />
    );
  }
}

function mapState(state, props) {
  const id         = props.match.params.id;
  const collection = mdb.getDenormCollection(state.mdb, id);
  const wipMap     = selectors.getWip(state.publications);
  const errMap     = selectors.getErrors(state.publications);

  const namespace = 'publications-collection';
  const nsState   = lists.getNamespaceState(state.lists, namespace);

  return {
    namespace,
    collection,
    wip: wipMap.collections[id],
    err: errMap.collections[id],
    items: (nsState.items || []).map(x => mdb.getDenormContentUnit(state.mdb, x)),
    itemsWip: nsState.wip,
    itemsErr: nsState.err,
    pageNo: nsState.pageNo,
    total: nsState.total,
    pageSize: settings.getPageSize(state.settings),
    language: settings.getLanguage(state.settings),
    isFiltersHydrated: filters.getIsHydrated(state.filters, namespace),
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchCollection: actions.fetchCollection,
    fetchList: listsActions.fetchList,
    setPage: listsActions.setPage,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(CollectionContainer);
