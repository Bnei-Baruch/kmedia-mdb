import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container, Divider } from 'semantic-ui-react';

import { actions, selectors as programSelectors } from '../../../redux/modules/programs';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import * as shapes from '../../shapes';
import withPagination from '../../pagination/withPagination';
import FullProgramFilters from './FullProgramFilters';
import FullProgramHeader from './FullProgramHeader';
// TODO: Move ProgramsList one directory up as it is used multiple
// times in List and in Full.
import ProgramsList from '../List/ProgramsList';

class FullProgramContainer extends withPagination {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
    language: PropTypes.string.isRequired,
    fullProgram: shapes.ProgramCollection,
    wip: PropTypes.bool,
    err: shapes.Error,
    fetchFullProgram: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(shapes.ProgramChapter),
  };

  static defaultProps = {
    fullProgram: null,
    wip: false,
    err: null,
  };

  componentDidMount() {
    this.askForData(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.askForData(nextProps.match.params.id);
    }

    if (nextProps.language !== this.props.language) {
      this.askForData(nextProps.match.params.id);
    }

    if (nextProps.fullProgram && !this.props.fullProgram) {
      withPagination.askForData(nextProps);
    }
    super.componentWillReceiveProps(nextProps);
  }

  askForData = (id) => {
    this.props.fetchFullProgram(id);
  };

  handleFiltersHydrated = () => {
    withPagination.handlePageChange(this.props);
  };

  handleFiltersChanged = () =>
    withPagination.handlePageChange(this.props, 1);

  render() {
    const { items, language, fullProgram, wip, err } = this.props;

    // return <FullProgram fullProgram={fullProgram} wip={wip} err={err} language={language} />;
    return (
      <div>
        <FullProgramHeader
          fullProgram={fullProgram}
          wip={wip}
          err={err}
        />
        <FullProgramFilters
          onChange={this.handleFiltersChanged}
          onHydrated={this.handleFiltersHydrated}
        />
        <Container className="padded">
          <withPagination.ResultsPageHeader {...this.props} />
          <ProgramsList items={items} />
        </Container>
        <Divider fitted />
        <Container className="padded" textAlign="center">
          <withPagination.Pagination {...this.props} />
        </Container>
      </div>
    );
  }
}

function mapState(state, props) {
  const id          = props.match.params.id;
  const fullProgram = mdb.getDenormCollection(state.mdb, id);

  const paginationProps = withPagination.mapState('programs', state, {
    getPageNo: s => programSelectors.getFullProgramPageNo(s)(id),
    getTotal: s => programSelectors.getFullProgramTotal(s)(id),
  }, settings);

  console.log(state['programs'].fullsItems, paginationProps);

  return {
    ...paginationProps,
    items: programSelectors.getFullProgramItems(state.programs)(id)
      .map(x => mdb.getDenormContentUnit(state.mdb, x)),
    fullProgram,
    id,
    wip: programSelectors.getWip(state.programs).fulls[id],
    err: programSelectors.getErrors(state.programs).fulls[id],
    language: settings.getLanguage(state.settings),
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchFullProgram: actions.fetchFullProgram,
    fetchProgramChapter: actions.fetchProgramChapter,
    // Support withPagination
    fetchList: actions.fetchFullProgramList,
    setPage: actions.setFullProgramPage,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(FullProgramContainer);
