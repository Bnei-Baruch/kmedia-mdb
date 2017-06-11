import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Divider, Grid } from 'semantic-ui-react';

import * as shapes from '../shapes';
import { selectors as settings } from '../../redux/modules/settings';
import { selectors as mdb } from '../../redux/modules/mdb';
import { actions, selectors as lessonsSelectors } from '../../redux/modules/lessons';
import { CT_LESSON_PART } from '../../helpers/consts';
import Pagination from '../shared/Pagination';
import ResultsPageHeader from '../shared/ResultsPageHeader';
import Filters from '../Filters/Filters';
import filterComponents from '../Filters/filterComponents';
import FiltersHydrator from '../Filters/FiltersHydrator/FiltersHydrator';
import FilterTags from '../Filters/FilterTags/FilterTags';
import LessonsList from './LessonsList';

const filters = [
  {
    name: 'date-filter',
    label: 'Date',
    component: filterComponents.DateFilter
  },
  {
    name: 'sources-filter',
    label: 'Sources',
    component: filterComponents.SourcesFilter
  },
  {
    name: 'topics-filter',
    label: 'Topics',
    component: filterComponents.TopicsFilter
  }
];

class LessonsContainer extends Component {

  static propTypes = {
    total: PropTypes.number,
    lessons: PropTypes.arrayOf(PropTypes.oneOfType([shapes.LessonCollection, shapes.LessonPart])),
    location: shapes.HistoryLocation.isRequired,
    fetchList: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    pageSize: PropTypes.number.isRequired,
  };

  static defaultProps = {
    total: 0,
    lessons: [],
  };

  componentWillReceiveProps(nextProps) {
    // if relevant props changed then askForData
    const { language, pageSize, location } = nextProps;
    const props                            = this.props;

    // TODO (edo): lesson.search changes shouldn't ask for data
    // remove from condition once pagination is implemented as a filter
    if (language !== props.language || pageSize !== props.pageSize || location.search !== props.location.search) {
      this.askForData(location.search, language, pageSize);
    }
    // TODO: what to do if total was changed?
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

  askForData = (search, language, pageSize) => {
    const pageNo = this.getPageNo(search);
    this.props.fetchList(pageNo, language, pageSize);
  };

  render() {
    const { total, lessons, language, pageSize, location } = this.props;
    const pageNo                                           = this.getPageNo(location.search);

    return (
      <Grid.Column width={16}>
        <FiltersHydrator
          namespace="lessons"
          onHydrated={() => this.askForData(location.search, language, pageSize)}
        />
        <Filters
          namespace="lessons"
          filters={filters}
          onFilterApplication={() => this.askForData(location.search, language, pageSize)}
        />
        <ResultsPageHeader pageNo={pageNo} pageSize={pageSize} total={total} />
        <FilterTags
          namespace="lessons"
          onClose={() => this.askForData(location.search, language, pageSize)}
        />
        <Divider />
        <LessonsList lessons={lessons} />
        <Pagination pageNo={pageNo} total={total} pageSize={pageSize} />
      </Grid.Column>
    );
  }
}

export default connect(
  state => ({
    total: lessonsSelectors.getTotal(state.lessons),
    lessons: lessonsSelectors.getLessons(state.lessons)
      .map(x => (x[1] === CT_LESSON_PART ?
        mdb.getUnitById(state.mdb)(x[0]) :
        mdb.getCollectionById(state.mdb)(x[0]))),
    language: settings.getLanguage(state.settings),
    pageSize: settings.getPageSize(state.settings),
  }),
  actions
)(LessonsContainer);
