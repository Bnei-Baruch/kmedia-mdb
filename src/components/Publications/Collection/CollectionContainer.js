import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../../redux/modules/publications';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as filters } from '../../../redux/modules/filters';
import * as shapes from '../../shapes';
import withPagination from '../../pagination/withPagination';
import Collection from './Collection';

class PublicationCollectionContainer extends Component {

  static propTypes = {
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
    fetchCollectionList: PropTypes.func.isRequired,
    setCollectionPage: PropTypes.func.isRequired,
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
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.fetchCollection(nextProps);
    }

    if (nextProps.language !== this.props.language) {
      this.fetchCollection(nextProps);
    }

    // filters haven't been hydrated yet.
    // returning here prevents duplicate calls to fetchList.
    if (!nextProps.isFiltersHydrated) {
      return;
    }

    if (nextProps.collection && !this.props.collection) {
      this.fetchList(nextProps);
    }

    if (nextProps.pageSize !== this.props.pageSize) {
      this.setAndFetchPage(nextProps, 1);
    }
  }

  fetchCollection = (props) => {
    const { match, fetchCollection } = props;
    fetchCollection(match.params.id);
  };

  fetchList = (props) => {
    const { match, pageNo, pageSize, language, fetchCollectionList } = props;
    fetchCollectionList(pageNo, pageSize, language, match.params.id);
  };

  setAndFetchPage = (props, pageNo) => {
    props.setCollectionPage(pageNo);
    this.fetchList({ ...props, pageNo });
  };

  handlePageChanged = (pageNo) => {
    this.setAndFetchPage(this.props, pageNo);
  };

  handleFiltersChanged = () => {
    this.setAndFetchPage(this.props, 1);
  };

  handleFiltersHydrated = () => {
    const pageNo = withPagination.getPageNo({ location: this.props.location });
    this.handlePageChanged(pageNo);
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
  const id          = props.match.params.id;
  const collection = mdb.getDenormCollection(state.mdb, id);
  const wipMap      = selectors.getWip(state.publications);
  const errMap      = selectors.getErrors(state.publications);
  const paging      = selectors.getCollectionPaging(state.publications);

  return {
    collection,
    wip: wipMap.collections[id],
    err: errMap.collections[id],
    items: paging.items.map(x => mdb.getDenormContentUnit(state.mdb, x)),
    total: paging.total,
    pageNo: paging.pageNo,
    itemsWip: wipMap.collectionList,
    itemsErr: errMap.collectionList,
    pageSize: settings.getPageSize(state.settings),
    language: settings.getLanguage(state.settings),
    isFiltersHydrated: filters.getIsHydrated(state.filters, 'publications-collection'),
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchCollection: actions.fetchCollection,
    fetchCollectionList: actions.fetchCollectionList,
    setCollectionPage: actions.setCollectionPage,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(PublicationCollectionContainer);
