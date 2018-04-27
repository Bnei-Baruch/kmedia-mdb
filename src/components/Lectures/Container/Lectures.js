import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// import { actions, selectors } from '../../../redux/modules/lectures';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as filters } from '../../../redux/modules/filters';
import { actions as listsActions, selectors as lists } from '../../../redux/modules/lists';
import * as shapes from '../../shapes';
import withPagination from '../../pagination/withPagination';
import Lectures, { tabs as lectureTabs } from '../MainPage';
import { MAP_TAB_TO_CONTENT_TYPE } from '../../../helpers/consts';
import { getQuery } from '../../../helpers/url';


class LecturesContainer extends withPagination {
  static propTypes = {
    location:          shapes.HistoryLocation.isRequired,
    items:             PropTypes.arrayOf(shapes.Lecture),
    wip:               shapes.WIP,
    err:               shapes.Error,
    pageNo:            PropTypes.number.isRequired,
    total:             PropTypes.number.isRequired,
    pageSize:          PropTypes.number.isRequired,
    language:          PropTypes.string.isRequired,
    isFiltersHydrated: PropTypes.bool,
    fetchList:         PropTypes.func.isRequired,
    setPage:           PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: [],
    wip: false,
    err: null,
    isFiltersHydrated: false,
  };

  componentDidMount() {
    // If filters are already hydrated, handleFiltersHydrated won't be called.
    // We'll have to ask for data here instead.
    if (this.props.isFiltersHydrated) {
      this.askForData(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { language } = nextProps;
    const currentTab   = this.props.match.params.tab;
    const nextTab      = nextProps.match.params.tab;

    if (language !== this.props.language || currentTab !== nextTab) {
      nextProps.setPage(`lectures-${nextTab}`, 1);
      this.askForData(nextProps, 1, nextTab);
    }

    if (nextProps.pageSize !== this.props.pageSize) {
      this.askForData(nextProps, 1, nextTab);
    }

    super.componentWillReceiveProps(nextProps);
  }

  askForData = (props, pn, tabName = this.props.match.params.tab || lectureTabs[0]) => {
    const { fetchList, pageSize, pageNo } = props;

    fetchList(`lectures-${tabName}`, pn || pageNo, {
      pageSize,
      content_type: MAP_TAB_TO_CONTENT_TYPE('lectures', tabName),
    });
  };

  handlePageChanged = (pageNo) => {
    const {  setPage } = this.props;
    const tabName = this.props.match.params.tab || lectureTabs[0];

    setPage(`lectures-${tabName}`, pageNo);
    this.askForData(this.props, pageNo);
  };

  handleFiltersChanged = () => {
    this.handlePageChanged(1);
  };

  handleFiltersHydrated = () => {
    const { location, pageNo } = this.props;
    let p                      = pageNo;

    const q = getQuery(location);
    if (q.page) {
      const pn = parseInt(q.page, 10);
      if (!isNaN(pn) && pn !== pageNo) {
        p = pn;
      }
    }
    this.handlePageChanged(p);
  };

  render() {
    const {
      items,
      wip,
      err,
      pageNo,
      total,
      pageSize,
      language,
      match,
    } = this.props;
    return (
      <Lectures
        items={items}
        wip={wip}
        err={err}
        match={match}
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

const mapState = (state, ownProps) => {
  const tabName   = ownProps.match.params.tab || lectureTabs[0];
  const namespace = `lectures-${tabName}`;
  const nsState   = lists.getNamespaceState(state.lists, namespace);

  return {
    items:             (nsState.items || []).map(x => mdb.getDenormContentUnit(state.mdb, x)),
    wip:               nsState.wip,
    err:               nsState.err,
    pageNo:            nsState.pageNo,
    total:             nsState.total,
    pageSize:          settings.getPageSize(state.settings),
    language:          settings.getLanguage(state.settings),
    isFiltersHydrated: filters.getIsHydrated(state.filters, namespace),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchList: listsActions.fetchList,
    setPage: listsActions.setPage,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(LecturesContainer);
