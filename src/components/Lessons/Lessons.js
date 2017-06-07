import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Grid, Header, List, ListItem, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Pagination } from '../pagination';
import Filters from '../Filters/Filters';
import filterComponents from '../Filters/filterComponents';
import FilterTags from '../Filters/FilterTags/FilterTags';
import FiltersHydrator from '../Filters/FiltersHydrator/FiltersHydrator';
import { selectors as settingsSelectors } from '../../redux/modules/settings';
import { actions as lessonActions, selectors as lessonsSelectors } from '../../redux/modules/lessons';

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
  }
];

class LessonsIndex extends React.Component {

  static propTypes = {
    total: PropTypes.number,
    lessons: PropTypes.arrayOf(
      PropTypes.shape({
        id : PropTypes.string.isRequired,
        film_date: PropTypes.string.isRequired,
        content_type: PropTypes.string.isRequired,
        content_units: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            description: PropTypes.string,
          })
        ).isRequired,
      })
    ),
    location: PropTypes.shape({
      search: PropTypes.string.isRequired
    }).isRequired,
    fetchList: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    pageSize: PropTypes.number.isRequired,
  };

  static defaultProps = {
    total  : 0,
    lessons: [],
  };

  componentDidMount() {
    const { language, pageSize, location } = this.props;
    this.askForData(location.search, language, pageSize);
  }

  componentWillReceiveProps(nextProps) {
    // if relevant props changed then askForData
    const { language, pageSize, location } = nextProps;
    const props                            = this.props;

    if (language !== props.language || pageSize !== props.pageSize || location.search !== props.location.search) {
      this.askForData(location.search, language, pageSize);
    }
    // TODO: what to do if total was changed?
  }

  getPageNo = (search) => {
    let page = 0;
    if (search) {
      const pageMatchInSearch = search.match(/page=(\d+)/);
      if (pageMatchInSearch) {
        page = parseInt(pageMatchInSearch[1], 10);
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
    const pageNo = this.getPageNo(location.search);

    return (
      <Grid.Column width={16}>
        <FiltersHydrator namespace="lessons" />
        <Filters
          namespace="lessons"
          filters={filters}
          onFilterApplication={() => this.askForData(location.search, language, pageSize)}
        />
        <Header as="h2">
          Results {((pageNo - 1) * pageSize) + 1} - {(pageNo * pageSize) + 1}&nbsp;
          of {total}
        </Header>
        <FilterTags namespace="lessons" onClose={() => this.askForData(location.search, language, pageSize)} />
        <Divider />
        <LessonsList lessons={lessons} />
        <Pagination currentPage={pageNo} totalItems={total} pageSize={pageSize} />
      </Grid.Column>
    );
  }
}

export default connect(
  state => ({
    total   : state.lessons.total,
    lessons : lessonsSelectors.getLessons(state.lessons),
    language: settingsSelectors.getLanguage(state.settings),
    pageSize: settingsSelectors.getPageSize(state.settings),
  }),
  lessonActions
)(LessonsIndex);

// LESSONS

const LessonsList = (props) => {
  if (!props.lessons) {
    return (<Grid columns={2} celled="internally" />);
  }

  const lessons = props.lessons.map((lesson) => {
    const units = lesson.content_units.map(unit => (
      <Link to={`/lessons/${unit.id}`} key={`u-${unit.id}`}>{unit.name}<br />{unit.description}</Link>
    ));

    return (
      <Grid.Row key={`l-${lesson.id}`}>
        <Grid.Column width={2}><strong>{lesson.film_date}</strong></Grid.Column>
        <Grid.Column width={14}>
          <List divided relaxed="very">
            <ListItem><Link to={`/lessons/${lesson.id}`}><strong>{lesson.content_type}</strong></Link></ListItem>
            {units}
          </List>
        </Grid.Column>
      </Grid.Row>
    );
  });

  return (<Grid columns={2} celled="internally">{lessons}</Grid>);
};

LessonsList.propTypes = {
  lessons: PropTypes.arrayOf(
    PropTypes.shape({
      id           : PropTypes.string.isRequired,
      film_date    : PropTypes.string.isRequired,
      content_type : PropTypes.string.isRequired,
      content_units: PropTypes.arrayOf(
        PropTypes.shape({
          id         : PropTypes.string.isRequired,
          name       : PropTypes.string.isRequired,
          description: PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired
};
