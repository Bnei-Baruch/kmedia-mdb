import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../../redux/modules/programs';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as filters } from '../../../redux/modules/filters';
import * as shapes from '../../shapes';
import withPagination from '../../pagination/withPagination';
import FullProgram from './FullProgram';

class FullProgramContainer extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    match: shapes.RouterMatch.isRequired,
    fullProgram: shapes.ProgramCollection,
    wip: PropTypes.bool,
    err: shapes.Error,
    items: PropTypes.arrayOf(shapes.ProgramChapter),
    total: PropTypes.number.isRequired,
    pageNo: PropTypes.number.isRequired,
    itemsWip: PropTypes.bool,
    itemsErr: shapes.Error,
    pageSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    isFiltersHydrated: PropTypes.bool,
    fetchFullProgram: PropTypes.func.isRequired,
    fetchFullProgramList: PropTypes.func.isRequired,
    setFullProgramPage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    fullProgram: null,
    wip: false,
    err: null,
    items: [],
    itemsWip: false,
    itemsErr: null,
    isFiltersHydrated: false,
  };

  componentDidMount() {
    console.log('FullProgramContainer.componentDidMount: fetchCollection');
    this.fetchCollection(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      console.log('FullProgramContainer.componentWillReceiveProps: fetchCollection [match]');
      this.fetchCollection(nextProps);
    }

    if (nextProps.language !== this.props.language) {
      console.log('FullProgramContainer.componentWillReceiveProps: fetchCollection [language]');
      this.fetchCollection(nextProps);
    }

    // filters haven't been hydrated yet.
    // returning here prevents duplicate calls to fetchChapters.
    if (!nextProps.isFiltersHydrated) {
      return;
    }

    if (nextProps.fullProgram && !this.props.fullProgram) {
      console.log('FullProgramContainer.componentWillReceiveProps: fetchChapters [fullProgram]');
      this.fetchChapters(nextProps);
    }

    if (nextProps.pageSize !== this.props.pageSize) {
      console.log('FullProgramContainer.componentWillReceiveProps: setAndFetchPage [pageSize]');
      this.setAndFetchPage(nextProps, 1);
    }
  }

  fetchCollection = (props) => {
    const { match, fetchFullProgram } = props;
    fetchFullProgram(match.params.id);
  };

  fetchChapters = (props) => {
    const { match, pageNo, pageSize, language, fetchFullProgramList } = props;
    fetchFullProgramList(pageNo, pageSize, language, match.params.id);
  };

  setAndFetchPage = (props, pageNo) => {
    props.setFullProgramPage(pageNo);
    this.fetchChapters({ ...props, pageNo });
  };

  handlePageChanged = (pageNo) => {
    console.log('FullProgramContainer.handlePageChanged: setAndFetchPage');
    this.setAndFetchPage(this.props, pageNo);
  };

  handleFiltersChanged = () => {
    console.log('FullProgramContainer.handleFiltersChanged: setAndFetchPage');
    this.setAndFetchPage(this.props, 1);
  };

  handleFiltersHydrated = () => {
    console.log('FullProgramContainer.handleFiltersHydrated: handlePageChanged');
    const pageNo = withPagination.getPageNo({ location: this.props.location });
    this.handlePageChanged(pageNo);
  };

  render() {
    const { fullProgram, wip, err, items, itemsWip, itemsErr, pageNo, total, pageSize, language } = this.props;

    return (
      <FullProgram
        fullProgram={fullProgram}
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
  const fullProgram = mdb.getDenormCollection(state.mdb, id);
  const wipMap      = selectors.getWip(state.programs);
  const errMap      = selectors.getErrors(state.programs);
  const paging      = selectors.getFullPaging(state.programs);

  return {
    fullProgram,
    wip: wipMap.fulls[id],
    err: errMap.fulls[id],
    items: paging.items.map(x => mdb.getDenormContentUnit(state.mdb, x)),
    total: paging.total,
    pageNo: paging.pageNo,
    itemsWip: wipMap.fullList,
    itemsErr: errMap.fullList,
    pageSize: settings.getPageSize(state.settings),
    language: settings.getLanguage(state.settings),
    isFiltersHydrated: filters.getIsHydrated(state.filters, 'full-program'),
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchFullProgram: actions.fetchFullProgram,
    fetchFullProgramList: actions.fetchFullProgramList,
    setFullProgramPage: actions.setFullProgramPage,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(FullProgramContainer);
