import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Divider, Grid } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { actions, selectors as programSelectors } from '../../../redux/modules/programs';
import { CT_VIDEO_PROGRAM_CHAPTER } from '../../../helpers/consts';
import Pagination from '../../shared/Pagination';
import ProgramsList from './ProgramsList';
import ResultsPageHeader from '../../shared/ResultsPageHeader';

class ProgramsContainer extends Component {

  static propTypes = {
    pageNo: PropTypes.number,
    total: PropTypes.number,
    items: PropTypes.arrayOf(PropTypes.oneOfType([shapes.ProgramCollection, shapes.ProgramPart])),
    location: shapes.HistoryLocation.isRequired,
    fetchList: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    pageSize: PropTypes.number.isRequired,
  };

  static defaultProps = {
    pageNo: 1,
    total: 0,
    items: [],
  };

  componentDidMount() {
    const { location, language, pageSize } = this.props;

    const pageNo = this.getPageNo(location.search);
    this.askForData(pageNo, language, pageSize);
  }

  componentWillReceiveProps(nextProps) {
    const { pageNo, language, pageSize } = nextProps;
    const props                          = this.props;

    if (pageSize !== props.pageSize) {
      this.handlePageChange(1);
    }

    if (language !== props.language) {
      this.askForData(pageNo, language, pageSize);
    }
  }

  getPageNo = (search) => {
    let page = 0;
    if (search) {
      const match = search.match(/page=(\d+)/);
      if (match) {
        page = parseInt(match[1], 10);
      }
    }

    return (isNaN(page) || page <= 0) ? 1 : page;
  };

  handlePageChange = (pageNo) => {
    const { setPage, language, pageSize } = this.props;
    setPage(pageNo);
    this.askForData(pageNo, language, pageSize);
  };

  askForData = (pageNo, language, pageSize) => {
    this.props.fetchList(pageNo, language, pageSize);
  };

  render() {
    const { pageNo, total, items, pageSize } = this.props;

    return (
      <Grid.Column width={16}>
        <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} />
        <Divider />
        <ProgramsList items={items} />
        <Pagination
          pageNo={pageNo}
          pageSize={pageSize}
          total={total}
          onChange={x => this.handlePageChange(x)}
        />
      </Grid.Column>
    );
  }
}

export default connect(
  state => ({
    pageNo: programSelectors.getPageNo(state.programs),
    total: programSelectors.getTotal(state.programs),
    items: programSelectors.getItems(state.programs)
      .map(x => (x[1] === CT_VIDEO_PROGRAM_CHAPTER ?
        mdb.getUnitById(state.mdb, x[0]) :
        mdb.getDenormCollection(state.mdb, x[0]))),
    language: settings.getLanguage(state.settings),
    pageSize: settings.getPageSize(state.settings),
  }),
  actions
)(ProgramsContainer);
