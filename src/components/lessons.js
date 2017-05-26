import React  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Segment, Menu as RMenu, Header, Grid, List, ListItem } from 'semantic-ui-react';
import { Link, NavLink } from 'react-router-dom';

import * as lessonActions from '../actions/lessonActions';
import { getPageNo } from './router';

class LessonsIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page_no     : 1,
      activeFilter: null
    };
  }

  componentDidMount() {
    const pageNo = getPageNo(this.props.location.search);

    this.props.actions.loadLessons({
      language : this.props.settings.language,
      page_no  : pageNo,
      page_size: this.props.settings.pageSize
    });
  }

  render() {
    const { total, collections } = this.props.lessons;
    const { pageSize }           = this.props.settings;
    const state                  = this.state;

    return (
      <Grid.Column width={16}>
        <Header as="h3">
          Results {((state.page_no - 1) * pageSize) + 1} - {(state.page_no * pageSize) + 1}&nbsp;
          of {total}</Header>
        <FilterMenu active={state.activeFilter} handler={this.handleFilterClick} />
        <ActiveFilter filter={state.activeFilter} />
        <Pagination totalPages={total} />
        <Lessons lessons={collections} />
      </Grid.Column>

    );
  }
}

LessonsIndex.defaultProps = {
  lessons: { total: 0, containers: [] }
};

LessonsIndex.propTypes    = {
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
    loadLessons: PropTypes.func.isRequired
  }).isRequired,
  settings: PropTypes.shape({
    language: PropTypes.string.isRequired,
    pageSize: PropTypes.number.isRequired
  }).isRequired
};

function mapStateToProps(state /* , ownProps */) {
  return {
    lessons : state.root.lessons,
    pageNo  : state.root.pageNo,
    settings: state.root.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(lessonActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonsIndex);

// FILTERS

const ActiveFilter = ({ filter }) => {
  switch (filter) {
  case 'date-filter':
    return <DateFilter />;
  case 'sources-filter':
    return <Segment basic attached="bottom" className="tab active">Second</Segment>;
  case 'topic-filter':
    return <Segment basic attached="bottom" className="tab active">Third</Segment>;
  default:
    return <span />;
  }
};

ActiveFilter.propTypes = {
  filter: PropTypes.string
};

ActiveFilter.defaultProps = {
  filter: ''
};

const DateFilter = () => <Segment basic attached="bottom" className="tab active">First</Segment>;

const FilterMenu = props => (
  <RMenu secondary pointing color="violet" className="index-filters">
    <RMenu.Header className="item">Filter by:</RMenu.Header>
    <FilterMenuDate name="date" title="Date" {...props} />
    <FilterMenuSources name="sources" title="Sources" {...props} />
    <FilterMenuTopics name="topic" title="Topics" {...props} />
  </RMenu>);

const FilterMenuDate = ({ name, title, active, handler }) => {
  const fullName = `${name}-filter`;
  return (
    <RMenu.Item name={fullName} active={active === fullName} onClick={() => handler({ name: fullName })}>{title}</RMenu.Item>
  );
};

FilterMenuDate.propTypes = {
  name   : PropTypes.string.isRequired,
  title  : PropTypes.string.isRequired,
  active : PropTypes.string,
  handler: PropTypes.func,
};

const FilterMenuSources = ({ name, title, active, handler }) => {
  const fullName = `${name}-filter`;
  return (
    <RMenu.Item name={fullName} active={active === fullName} onClick={() => handler({ name: fullName })}>{title}</RMenu.Item>
  );
};

FilterMenuSources.propTypes = {
  name   : PropTypes.string.isRequired,
  title  : PropTypes.string.isRequired,
  active : PropTypes.string,
  handler: PropTypes.func,
};

const FilterMenuTopics = ({ name, title, active, handler }) => {
  const fullName = `${name}-filter`;
  return (
    <RMenu.Item name={fullName} active={active === fullName} onClick={() => handler({ name: fullName })}>{title}</RMenu.Item>
  );
};

FilterMenuTopics.propTypes = {
  name   : PropTypes.string.isRequired,
  title  : PropTypes.string.isRequired,
  active : PropTypes.string,
  handler: PropTypes.func,
};

// PAGINATION
const Pagination = ({ totalPages }) => {
  if (totalPages === '...') {
    return <Segment />;
  }

  const total = totalPages > 10 ? 10 : totalPages;
  const menu  = [...new Array(total).keys()].map(id =>
    (<RMenu.Item
      as={NavLink}
      activeClassName="active violet"
      key={`page-${id + 1}`}
      to={{
        pathname: '/lessons',
        search  : `?page=${id + 1}`
      }}
    >&nbsp;{id + 1}</RMenu.Item>)
  );

  return (
    <Segment> Pages: {menu} </Segment>
  );
};

Pagination.propTypes = {
  totalPages: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])
};

// LESSONS

const Lessons = (props) => {
  if (props.lessons === undefined) {
    return (<Grid columns={2} celled="internally">No lessons</Grid>);
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
  )
};
