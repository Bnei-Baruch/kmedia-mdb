import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Divider, Grid } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { actions, selectors as programSelectors } from '../../../redux/modules/programs';
import { CT_VIDEO_PROGRAM_CHAPTER } from '../../../helpers/consts';
import Pagination from '../../shared/Pagination';
import ProgramsList from './ProgramsList';
import ResultsPageHeader from '../../shared/ResultsPageHeader';
import withPagination from '../../../helpers/paginationHOC';

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
    getPageNo: PropTypes.func.isRequired,
    askForData: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    pageNo: 1,
    total: 0,
    items: [],
  };

  componentDidMount() {
    const { location, askForData, getPageNo } = this.props;

    const pageNo = getPageNo(location.search);
    askForData({ ...this.props, pageNo });
  }

  componentWillReceiveProps(nextProps) {
    const { language, pageSize }           = nextProps;
    const { handlePageChange, askForData } = this.props;

    if (pageSize !== this.props.pageSize) {
      handlePageChange(1, nextProps);
    }

    if (language !== this.props.language) {
      askForData(nextProps);
    }
  }

  render() {
    const { pageNo, total, items, pageSize, handlePageChange } = this.props;

    return (
      <Grid.Column width={16}>
        <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} />
        <Divider />
        <ProgramsList items={items} />
        <Pagination
          pageNo={pageNo}
          pageSize={pageSize}
          total={total}
          onChange={x => handlePageChange(x, this.props)}
        />
      </Grid.Column>
    );
  }
}

const enhance = compose(
  connect(
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
  ),
  withPagination
);

export default enhance(ProgramsContainer);
