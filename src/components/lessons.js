import React  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Header, Grid, List, ListItem } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { Pagination } from './pagination';
import Filter from './filters';
import * as lessonActions from '../actions/lessonActions';

class LessonsIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNo: 1,
    };
  }

  componentDidMount() {
    const pageNo = this.getPageNo(this.props.location.search);
    this.props.actions.onSetPage(pageNo);
  }

  getPageNo = (search) => {
    let page = 0;
    if (search) {
      page = parseInt(search.match(/page=(\d+)/)[1], 10);
    }

    return (isNaN(page) || page <= 0) ? 1 : page;
  };

  render() {
    const { total, collections } = this.props.lessons;
    const { pageSize }           = this.props.settings;
    const { pageNo }             = this.state;
    const onSetPage              = this.props.actions.onSetPage;

    return (
      <Grid.Column width={16}>
        <Header as="h3">
          Results {((pageNo - 1) * pageSize) + 1} - {(pageNo * pageSize) + 1}&nbsp;
          of {total}</Header>
        <Filter />
        <Pagination currentPage={pageNo} totalItems={total} pageSize={pageSize} onSetPage={onSetPage} />
        <Lessons lessons={collections} />
      </Grid.Column>

    );
  }
}

LessonsIndex.defaultProps = {
  lessons: { total: 0, containers: [] }
};

LessonsIndex.propTypes = {
  lessons : PropTypes.shape({
    total      : PropTypes.number,
    collections: PropTypes.arrayOf(
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
    )
  }),
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  actions : PropTypes.shape({
    loadLessons: PropTypes.func.isRequired,
    onSetPage  : PropTypes.func.isRequired
  }).isRequired,
  settings: PropTypes.shape({
    language: PropTypes.string.isRequired,
    pageSize: PropTypes.number.isRequired
  }).isRequired
};

function mapStateToProps(state /* , ownProps */) {
  return {
    lessons : state.root.lessons.lessons,
    pageNo  : state.root.lessons.pageNo,
    settings: state.root.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(lessonActions, dispatch)
  };
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
