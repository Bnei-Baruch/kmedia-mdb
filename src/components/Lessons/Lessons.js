import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Grid, Header, List, ListItem } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Pagination } from '../pagination';
import Filter from '../filters/filters';
import FilterTags from '../filters/FilterTags/FilterTags';
import { selectors as settingsSelectors } from '../../redux/modules/settings';
import { actions, selectors as lessonsSelectors } from '../../redux/modules/lessons';

class LessonsIndex extends React.Component {

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
      page = parseInt(search.match(/page=(\d+)/)[1], 10);
    }

    return (isNaN(page) || page <= 0) ? 1 : page;
  };

  askForData(search, language, pageSize) {
    const pageNo = this.getPageNo(search);
    this.props.fetchList(pageNo, language, pageSize);
  }

  render() {
    const { total, lessons, pageSize, location } = this.props;
    const pageNo                                 = this.getPageNo(location.search);

    return (
      <Grid.Column width={16}>
        <Filter namespace="lessons" />
        <Header as="h2">
          Results {((pageNo - 1) * pageSize) + 1} - {(pageNo * pageSize) + 1}&nbsp;
          of {total}
        </Header>
        <FilterTags namespace="lessons" />
        <Pagination currentPage={pageNo} totalItems={total} pageSize={pageSize} />
        <Lessons lessons={lessons} />
      </Grid.Column>
    );
  }
}

LessonsIndex.propTypes = {
  total    : PropTypes.number,
  lessons  : PropTypes.arrayOf(
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
  ),
  location : PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  fetchList: PropTypes.func.isRequired,
  language : PropTypes.string.isRequired,
  pageSize : PropTypes.number.isRequired,
};

LessonsIndex.defaultProps = {
  total  : 0,
  lessons: [],
};

function mapStateToProps(state /* , ownProps */) {
  return {
    total   : state.lessons.total,
    lessons : lessonsSelectors.getLessons(state.lessons),
    language: settingsSelectors.getLanguage(state.settings),
    pageSize: settingsSelectors.getPageSize(state.settings),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonsIndex);

// LESSONS

const Lessons = (props) => {
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

Lessons.propTypes = {
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
